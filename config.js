// config.js
window.CONFIG = {
  weights: {
    likeMe: 3,
    face: 4,
    body: 3,
    positivity: 2,
    kindness: 3.5,
    humor: 4,
    conversation: 4.5,

    games: 2,
    gym: 3,
    intCurious: 4.5,
    emotionalCuriosity: 4.5,
    niche: 1,
    food: 2,
    coolness: 2,
    education: 3.5,
    wealth: 3.5,
    futch: 4,

    puppy: 2.5,
    bodyLang: 2,
    voice: 2,
    manners: 2,
    style: 2,

    height: 2,
    athlete: 3,
    religion: 1,
    douchiness: 3,
    promiscuity: -3,
    political: 2,

    // social energy
    stemVibes: 3,
    chalant: 1.5,
    shyGreg: 3,
    introExtro: 1.5,
    agency: 5
  },

  thresholds: [
    { min: 40, decision: "this might be it", note: "very high alignment!!! your brain and your gut are on the same page.", css: "result-yes" },
    { min: 30, decision: "date", note: "good alignment. worth a real-life dateee ;)", css: "result-yes" },
    { min: 25, decision: "date casually", note: "this could be promising, but keep it low stakes.", css: "result-yes" },
    { min: 20, decision: "situationship", note: "chemistry is there but values / logistics may be messy. proceed with awareness.", css: "result-yes" },
    { min: 10, decision: "maybe you can hang out once", note: "curiosity is allowed, just do not over-invest.", css: "result-no" },
    { min: 0,  decision: "textuationship", note: "fine for occasional texting but probably not worth IRL energy.", css: "result-no" },
    { min: -1, decision: "is this really what you want", note: "you are negotiating against your own standards here.", css: "result-no" },
    { min: -Infinity, decision: "girl no", note: "you already know the answer.", css: "result-no" }
  ],

  curves: {
    chalantIdeal: 0.60,
    chalantWidth: 0.45,

    shyGregIdeal: 0.65,
    shyGregWidth: 0.50,

    introExtroIdeal: 0.60,
    introExtroWidth: 0.70,

    agencyLowPenalty: 1.7
  }
};