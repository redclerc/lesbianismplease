// engine.js
(function () {
  console.log("engine.js loaded");

  const C = window.CONFIG;
  const H = window.H;

  if (!C) {
    console.error("[engine] window.CONFIG is missing. Check config.js load order.");
    return;
  }
  if (!H) {
    console.error("[engine] window.H is missing. Check helpers.js load order and errors.");
    return;
  }

  const entries = [];
  window.entries = entries;

  function runDecision() {
    const hardCheck = H.hasHardRedFlags();
    const resultBox = document.getElementById("resultBox");
    const debugBox = document.getElementById("detailsBox");

    if (!resultBox) {
      console.error("[engine] Missing #resultBox in DOM.");
      return;
    }

    const nameInput = (document.getElementById("personName")?.value || "").trim();
    const personName = nameInput || `entry_${entries.length + 1}`;

    if (hardCheck.hard) {
      const decision = "girl no";
      const note = hardCheck.reason || "be so for real... absolutely not.";

      resultBox.className = "result-no";
      resultBox.innerHTML = `
        <div>${decision}</div>
        <div class="result-note">
          ${note}<br/>saved as: ${personName}
        </div>
        <img src="assets/redflag.gif" style="width:120px;margin-top:10px;" />
      `;

      entries.push({
        name: personName,
        timestamp: new Date().toISOString(),
        decision,
        score: null,
        notes: note
      });

      if (debugBox) debugBox.textContent = "hard red flag triggered → no further scoring.";
      return;
    }

    // sliders (0..1)
    const likeMe = H.slider01("likeMe");
    const faceAttract = H.slider01("faceAttract");
    const bodyAttract = H.slider01("bodyAttract");
    const positivity = H.slider01("positivity");
    const kindness = H.slider01("kindness");
    const humor = H.slider01("humor");
    const conversation = H.slider01("conversation");

    const games = H.slider01("hobbiesGames");
    const gym = H.slider01("hobbiesGym");
    const intCurious = H.slider01("intCuriosity");
    const emotionalCuriosity = H.slider01("emotionalCuriosity");
    const niche = H.slider01("hobbiesNiche");
    const food = H.slider01("foodPref");
    const education = H.slider01("education");
    const wealth = H.slider01("wealth");
    const futch = H.slider01("futchFactor");

    const coolness = H.slider01("swag");
    const puppy = H.slider01("puppyFactor");
    const bodyLang = H.slider01("bodyLanguage");
    const voice = H.slider01("voice");
    const manners = H.slider01("manners");
    const style = H.slider01("style");

    const stemVibes = H.slider01("stemVibes");
    const chalant = H.slider01("chalantness");
    const shyGreg = H.slider01("shyGreg");
    const introExtro = H.slider01("introExtro");

    // preference curves / special models
    const agency = H.agencyScore();                 // -1..+1
    const chalantPref = H.chalantScore(chalant);    // -1..+1
    const shyGregPref = H.shyGregScore(shyGreg);    // -1..+1
    const introExtroPref = H.introExtroScore(introExtro); // -1..+1

    const relScore = H.religionGoodness();          // ~ -1..+1-ish
    const athleteBonus = H.athleteScore();          // 0..1
    const poli = H.politicalScore();                // signed-ish
    const dRaw = H.slider01("douchiness");
    const dBalance = H.douchinessBalanced(dRaw);    // 0..1

    const promiscRaw = H.slider01("promiscuity");   // 0..1
    const promiscPref = H.promiscScore(promiscRaw); // -1..+1

    const gutRaw = parseInt(document.getElementById("gutOverride")?.value ?? "0", 10) || 0;
    const heightVal01 = hardCheck.heightPref ?? 0.0; // 0..1 (from helpers)

    const w = C.weights;
    if (!w) {
      console.error("[engine] C.weights missing in CONFIG.");
      return;
    }

    // contributions
    const contrib = {
      likeMe: w.likeMe * H.signed01(likeMe),
      face: w.face * H.signed01(faceAttract),
      body: w.body * H.signed01(bodyAttract),
      positivity: w.positivity * H.signed01(positivity),
      kindness: w.kindness * H.signed01(kindness),
      humor: w.humor * H.signed01(humor),
      conversation: w.conversation * H.signed01(conversation),

      games: w.games * H.signed01(games),
      gym: w.gym * H.signed01(gym),

      // emotionalCuriosity is a normal slider: treat it like the others
      emotionalCuriosity: w.emotionalCuriosity * H.signed01(emotionalCuriosity),

      intCurious: w.intCurious * H.signed01(intCurious),
      niche: w.niche * H.signed01(niche),
      food: w.food * H.signed01(food),
      coolness: w.coolness * H.signed01(coolness),
      education: w.education * H.signed01(education),
      wealth: w.wealth * H.signed01(wealth),
      futch: w.futch * H.signed01(futch),

      puppy: w.puppy * H.signed01(puppy),
      bodyLang: w.bodyLang * H.signed01(bodyLang),
      voice: w.voice * H.signed01(voice),
      manners: w.manners * H.signed01(manners),
      style: w.style * H.signed01(style),

      // heightVal01 is 0..1; choose ONE:
      // Option A (bonus-only): height: w.height * heightVal01
      // Option B (preference with mild penalty): signed01()
      height: w.height * H.signed01(heightVal01),

      // athlete is bonus-only
      athlete: w.athlete * athleteBonus,

      religion: w.religion * relScore,
      douchiness: w.douchiness * H.signed01(dBalance),

      // promiscPref already -1..+1
      promiscuity: w.promiscuity * promiscPref,

      political: w.political * poli,

      stemVibes: w.stemVibes * H.signed01(stemVibes),
      chalant: w.chalant * chalantPref,
      shyGreg: w.shyGreg * shyGregPref,
      introExtro: w.introExtro * introExtroPref,
      agency: w.agency * agency,

      gut: gutRaw
    };

    // detect NaN early
    for (const [k, v] of Object.entries(contrib)) {
      if (!Number.isFinite(v)) {
        console.error(`[engine] contrib.${k} is not finite:`, v, { w, hardCheck });
        return;
      }
    }

    const score = Object.values(contrib).reduce((sum, x) => sum + x, 0);

    // max score approx (consistent with your approach)
    const maxScore =
      w.likeMe + w.face + w.body + w.positivity + w.kindness + w.humor + w.conversation +
      w.games + w.gym + w.intCurious + w.emotionalCuriosity + w.niche + w.food +
      w.coolness + w.education + w.wealth + w.futch +
      w.puppy + w.bodyLang + w.voice + w.manners + w.style +
      w.height + w.athlete + w.religion + w.douchiness +
      w.stemVibes + w.chalant + w.shyGreg + w.introExtro + w.agency +
      (2 * w.political) + 10;

    const fitPercent = Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)));

    const chosen = (C.thresholds || []).find(t => score >= t.min) || {
      decision: "girl no",
      note: "config thresholds missing or score too low.",
      css: "result-no"
    };

    resultBox.className = chosen.css;
    resultBox.innerHTML = `
      <div>${chosen.decision}</div>
      <div class="result-note">
        score: ${score.toFixed(2)}<br/>
        ~${fitPercent}% match to your ideal<br/>
        ${chosen.note}<br/>
        saved as: ${personName}
      </div>
      <div class="score-bar">
        <div class="score-fill" style="width: ${fitPercent}%;"></div>
      </div>
      <div class="score-percentile">
        0% = not your type at all · 100% = terrifyingly on-paper perfect
      </div>
      <img src="assets/chickenflower.gif" style="width:120px;margin-top:10px;" />
    `;

    if (debugBox) {
      const lines = [];
      lines.push(`total score: ${score.toFixed(2)}`);
      lines.push(`fit to ideal: ${fitPercent}%`);
      lines.push("");
      lines.push("breakdown:");
      for (const [k, v] of Object.entries(contrib)) {
        lines.push(`${k}: ${v >= 0 ? "+" : ""}${v.toFixed(2)}`);
      }
      debugBox.textContent = lines.join("\n");
    }

    entries.push({
      name: personName,
      timestamp: new Date().toISOString(),
      decision: chosen.decision,
      score: score.toFixed(2),
      econ: document.getElementById("econ")?.value ?? "",
      social: document.getElementById("social")?.value ?? ""
    });
  }

  function downloadLog() {
    if (!entries.length) {
      alert("no entries saved yet!");
      return;
    }

    const headers = ["name", "timestamp", "decision", "score", "econ", "social"];
    const rows = entries.map(e => [e.name, e.timestamp, e.decision, e.score, e.econ, e.social]);

    const csv = [
      headers.join(","),
      ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "date_decisions.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  window.runDecision = runDecision;
  window.downloadLog = downloadLog;

  console.log("runDecision now:", window.runDecision);
})();
