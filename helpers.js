// helpers.js
(function () {
  const C = window.CONFIG || { curves: {} };

  function clamp(min, x, max) {
    return Math.max(min, Math.min(max, x));
  }

  function getEl(id) {
    return document.getElementById(id);
  }

  // DOM slider -> 0..1 (SAFE)
  function slider01(id) {
    const el = getEl(id);
    if (!el) {
      console.warn(`[helpers] slider01: missing element #${id}`);
      return 0.5; // neutral default instead of crashing
    }
    const n = parseFloat(el.value);
    if (Number.isNaN(n)) return 0.5;
    return clamp(0, n / 100, 1);
  }

  // 0..1 -> -1..+1
  function signed01(x01) {
    return 2 * x01 - 1;
  }

  // "goldilocks" parabola: peak at center, falls off on both sides
  function goldilocks(val01, center, width) {
    if (!width || width <= 0) width = 0.5;
    const x = (val01 - center) / width;
    let s = 1 - x * x; // peak 1 at center
    s = 2 * s - 1;     // roughly -1..+1
    return clamp(-1, s, 1);
  }

  // Height preference model
  // hard bounds: 5'2 (62) to 5'11 (71)
  // ideal: 5'6–5'10 (66–70)
  function heightScore(h) {
    if (h < 62 || h > 71) return null;

    if (h >= 66 && h <= 70) return 1.0; // ideal band
    if (h === 65 || h === 71) return 0.7;
    if (h === 64) return 0.4;
    if (h === 62 || h === 63) return 0.2;

    return 0.0;
  }

  // Athlete bonus dropdown: #athleteBonus
  // values: "d1" -> 1.0, "hobbyist" -> 0.4, else 0.0
  function athleteScore() {
    const el = getEl("athleteBonus");
    if (!el) {
      console.warn("[helpers] athleteScore: missing #athleteBonus");
      return 0.0;
    }
    const v = el.value;
    if (v === "d1") return 1.0;
    if (v === "hobbyist") return 0.4;
    return 0.0;
  }

  function religionGoodness() {
    const r = slider01("religion");
    if (r <= 0.5) return r * 2;            // 0..1
    return 1 - 4 * (r - 0.5);              // drops below 0 if very intense
  }

  function douchinessBalanced(val01) {
    const d = 1 - 4 * Math.pow(val01 - 0.5, 2);
    return Math.max(d, 0); // 0..1
  }

  function politicalScore() {
    const econEl = getEl("econ");
    const socialEl = getEl("social");
    if (!econEl || !socialEl) {
      console.warn("[helpers] politicalScore: missing #econ or #social");
      return 0;
    }

    const econ = parseInt(econEl.value, 10) / 100;
    const social = parseInt(socialEl.value, 10) / 100;

    const ll = (-econ + -social) / 2;
    const rl = (econ + -social) / 2;
    const moderate = 1 - (Math.abs(econ) + Math.abs(social)) / 2;
    const la = (-econ + social) / 2;
    const ra = (econ + social) / 2;

    return (
      2.0 * ll +
      1.0 * rl +
      0.5 * moderate -
      1.0 * Math.max(0, la) -
      3.0 * Math.max(0, ra)
    );
  }

  // Curves (with safe defaults if CONFIG missing)
  function chalantScore(val01) {
    const ideal = C.curves?.chalantIdeal ?? 0.60;
    const width = C.curves?.chalantWidth ?? 0.45;
    return goldilocks(val01, ideal, width);
  }

  function shyGregScore(val01) {
    const ideal = C.curves?.shyGregIdeal ?? 0.65;
    const width = C.curves?.shyGregWidth ?? 0.50;
    return goldilocks(val01, ideal, width);
  }

  function introExtroScore(val01) {
    const ideal = C.curves?.introExtroIdeal ?? 0.60;
    const width = C.curves?.introExtroWidth ?? 0.70;
    return goldilocks(val01, ideal, width);
  }

  function agencyScore() {
    const raw = slider01("agency"); // 0..1
    const s = signed01(raw);        // -1..+1
    const penalty = C.curves?.agencyLowPenalty ?? 1.7;
    return s >= 0 ? s : penalty * s;
  }

  // Promiscuity preference curve (returns -1..+1)
  function promiscScore(val01) {
    const ideal = 0.35; // “low–mid” sweet spot
    const width = 0.5;

    const x = (val01 - ideal) / width;
    let s = 1 - x * x; // parabola peak at ideal
    s = 2 * s - 1;     // -1..+1

    return clamp(-1, s, 1);
  }

  // Hard red flags for your new HTML
  function hasHardRedFlags() {
    const ids = ["emotionallyUnavailable", "notAttractedAtAll", "hasAddictions"];

    for (const id of ids) {
      const el = getEl(id);
      if (el && el.checked) {
        return { hard: true, reason: "hard red flag selected." };
      }
    }

    const feetEl = getEl("heightFeet");
    const inchesEl = getEl("heightInches");
    if (!feetEl || !inchesEl) {
      return { hard: true, reason: "height inputs missing." };
    }

    const feet = parseInt(feetEl.value, 10);
    const inches = parseInt(inchesEl.value, 10);
    const totalHeight = feet * 12 + inches;

    const hScore = heightScore(totalHeight);
    if (hScore === null) {
      return { hard: true, reason: "height outside acceptable range." };
    }

    return { hard: false, totalHeight, heightPref: hScore };
  }

  // expose
  window.H = {
    clamp,
    slider01,
    signed01,
    goldilocks,
    heightScore,
    athleteScore,
    religionGoodness,
    douchinessBalanced,
    politicalScore,
    chalantScore,
    shyGregScore,
    introExtroScore,
    agencyScore,
    promiscScore,
    hasHardRedFlags,
  };
})();
