"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/core/generator.ts
var generator_exports = {};
__export(generator_exports, {
  generateProgression: () => generateProgression,
  weightedPick: () => weightedPick
});
module.exports = __toCommonJS(generator_exports);

// src/core/theory.ts
var LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
var LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
var MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
function mod12(n) {
  return (n % 12 + 12) % 12;
}
var SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
function pcToName(pc, flats) {
  return (flats ? FLAT_NAMES : SHARP_NAMES)[mod12(pc)];
}
function scaleSpelling(key) {
  const startLetter = LETTERS.indexOf(key.name[0]);
  return MAJOR_STEPS.map((step, i) => {
    const letter = LETTERS[(startLetter + i) % 7];
    let acc = mod12(key.pc + step) - LETTER_PC[letter];
    if (acc > 6) acc -= 12;
    if (acc < -6) acc += 12;
    return letter + (acc === 0 ? "" : acc > 0 ? "#".repeat(acc) : "b".repeat(-acc));
  });
}
var QUALITY_INTERVALS = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj6: [0, 4, 7, 9],
  min6: [0, 3, 7, 9],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  m7b5: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],
  maj9: [0, 4, 7, 11, 14],
  min9: [0, 3, 7, 10, 14],
  dom9: [0, 4, 7, 10, 14],
  sus4: [0, 5, 7],
  dom7sus4: [0, 5, 7, 10]
};
var QUALITY_SUFFIX = {
  maj: "",
  min: "m",
  dim: "dim",
  aug: "aug",
  maj6: "6",
  min6: "m6",
  maj7: "maj7",
  min7: "m7",
  dom7: "7",
  m7b5: "m7b5",
  dim7: "dim7",
  maj9: "maj9",
  min9: "m9",
  dom9: "9",
  sus4: "sus4",
  dom7sus4: "7sus4"
};
var ROMAN_SUFFIX = {
  maj: "",
  min: "",
  dim: "\xB0",
  aug: "+",
  maj6: "6",
  min6: "6",
  maj7: "maj7",
  min7: "7",
  dom7: "7",
  m7b5: "\xF87",
  dim7: "\xB07",
  maj9: "maj9",
  min9: "9",
  dom9: "9",
  sus4: "sus4",
  dom7sus4: "7sus4"
};
var MINORISH = /* @__PURE__ */ new Set(["min", "min6", "min7", "min9", "m7b5", "dim", "dim7"]);
var NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];
function ch(degree, quality, alter) {
  return { degree, quality, alter };
}
function buildSlot(key, spec, startBeat, lenBeats, scale, id) {
  const rootPc = mod12(key.pc + MAJOR_STEPS[spec.degree - 1] + (spec.alter ?? 0));
  const rootName = spec.alter ? pcToName(rootPc, spec.alter < 0) : scale[spec.degree - 1];
  const q = spec.quality;
  const name = rootName + QUALITY_SUFFIX[q];
  const numeralBase = NUMERALS[spec.degree - 1];
  const numeral = MINORISH.has(q) ? numeralBase.toLowerCase() : numeralBase;
  const roman = (spec.alter === -1 ? "b" : spec.alter === 1 ? "#" : "") + numeral + ROMAN_SUFFIX[q];
  const ivs = QUALITY_INTERVALS[q];
  let upper = ivs.filter((iv) => iv > 0);
  if (upper.length > 3) upper = upper.filter((iv) => mod12(iv) !== 7);
  const midi = [48 + rootPc, ...upper.slice(0, 3).map((iv) => 60 + mod12(rootPc + iv))];
  const guitarRoot = 40 + rootPc;
  const powerMidi = [guitarRoot, guitarRoot + 7, guitarRoot + 12];
  return {
    id,
    name,
    roman,
    quality: q,
    rootPc,
    startBeat,
    lenBeats,
    midi,
    powerMidi,
    bassMidi: 36 + rootPc
  };
}

// src/core/styles/jazz.ts
var I = ch(1, "maj7");
var ii = ch(2, "min7");
var iii = ch(3, "min7");
var IV = ch(4, "maj7");
var V = ch(5, "dom7");
var vi = ch(6, "min7");
var VI7 = ch(6, "dom7");
var jazz = {
  id: "jazz",
  name: "Jazz \u7235\u58EB",
  bpm: { min: 60, max: 220, default: 130 },
  swing: 0.55,
  swingSubdivision: "8n",
  tonic: "maj7",
  templates: [
    { weight: 3, bars: [[ii], [V], [I]] },
    { weight: 3, bars: [[I], [VI7], [ii], [V]] },
    { weight: 1, bars: [[iii], [VI7], [ii], [V]] },
    { weight: 2, bars: [[I, VI7], [ii, V], [ii, V], [ii, V]] },
    // Rhythm Changes A 段气息
    { weight: 1, bars: [[I], [vi], [ii], [V]] },
    { weight: 1, bars: [[I], [iii], [vi], [ii]] },
    // 下行四度圈
    { weight: 1, bars: [[I], [IV], [iii, vi], [ii, V]] },
    { weight: 2, bars: [[ii, V]] },
    // 单小节 ii-V，减少主和弦静态填充
    { weight: 1, bars: [[iii, VI7]] }
  ],
  cadences: [
    [[ii], [V], [I]],
    [[ii], [V]],
    // turnaround 结尾，循环时回到开头更顺
    [[I, VI7], [ii, V]]
  ],
  drums: [
    {
      weight: 4,
      pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3] }
      // 经典 swing ride + 踩镲脚拍
    },
    {
      weight: 2,
      pattern: { ride: [0, 1, 2, 3], hihat: [1, 3] }
      // 四分 ride，更松弛
    },
    {
      weight: 2,
      pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3], snareGhost: [1.75, 3.25] }
    },
    {
      weight: 1,
      pattern: { ride: [0, 1, 2, 3], openHat: [3.5], hihat: [1, 3] }
    }
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.5], ride: [0, 2] } },
    { weight: 1, pattern: { kick: [0, 2], snare: [3, 3.25, 3.5, 3.75], ride: [0, 1] } }
  ],
  comp: [
    { weight: 3, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }] } },
    // Charleston
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }, { pos: 2.5, dur: 0.45 }] } },
    { weight: 1, pattern: { hits: [{ pos: 0.5, dur: 0.45 }, { pos: 1.5, dur: 0.45 }, { pos: 2.5, dur: 0.45 }] } }
    // 反拍
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.6 }]
  },
  bass: [
    {
      // 行走贝斯：根 - 三 - 五 - 半音导入
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "third" },
          { pos: 2, dur: 1, note: "fifth" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    },
    {
      // 根 - 五 - 六 - 半音导入
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "fifth" },
          { pos: 2, dur: 1, note: "sixth" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    },
    {
      // 根 - 三 - 八度 - 半音导入
      weight: 1,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "third" },
          { pos: 2, dur: 1, note: "octave" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 2, note: "root" }]
  }
};

// src/core/styles/bebop.ts
var I2 = ch(1, "maj7");
var II7 = ch(2, "dom7");
var ii2 = ch(2, "min7");
var III7 = ch(3, "dom7");
var iii2 = ch(3, "min7");
var IV2 = ch(4, "maj7");
var V2 = ch(5, "dom7");
var vi2 = ch(6, "min7");
var VI72 = ch(6, "dom7");
var bebop = {
  id: "bebop",
  name: "Bebop \u6BD4\u6CE2\u666E",
  bpm: { min: 140, max: 260, default: 184 },
  swing: 0.6,
  swingSubdivision: "8n",
  tonic: "maj7",
  templates: [
    { weight: 3, bars: [[I2, VI72], [ii2, V2], [ii2, V2], [ii2, V2]] },
    // Rhythm Changes A
    { weight: 2, bars: [[iii2], [VI72], [II7], [V2]] },
    // 四度圈桥段
    { weight: 2, bars: [[I2], [II7], [ii2], [V2]] },
    // Confirmation 气息
    { weight: 2, bars: [[I2, VI72], [ii2, V2], [iii2, VI72], [ii2, V2]] },
    { weight: 1, bars: [[III7], [VI72], [II7], [V2]] },
    { weight: 1, bars: [[I2], [vi2], [ii2], [V2]] },
    { weight: 2, bars: [[ii2, V2]] },
    { weight: 1, bars: [[I2], [IV2], [ii2, V2], [I2]] }
  ],
  cadences: [
    [[ii2], [V2], [I2]],
    [[ii2], [V2]],
    [[iii2, VI72], [ii2, V2]]
  ],
  drums: [
    { weight: 4, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3] } },
    { weight: 2, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3], snareGhost: [1.75, 2.75, 3.25] } },
    { weight: 2, pattern: { ride: [0, 1, 2, 3], hihat: [1, 3], kick: [0, 2] } },
    { weight: 1, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], openHat: [3.5], hihat: [1, 3] } }
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.5], ride: [0, 2] } },
    { weight: 1, pattern: { kick: [0, 2], snare: [3, 3.25, 3.5, 3.75], ride: [0, 1] } }
  ],
  comp: [
    { weight: 3, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }] } },
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }, { pos: 2.5, dur: 0.45 }] } },
    { weight: 2, pattern: { hits: [{ pos: 0.5, dur: 0.45 }, { pos: 1.5, dur: 0.45 }, { pos: 2.5, dur: 0.45 }] } }
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.6 }]
  },
  bass: [
    {
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "third" },
          { pos: 2, dur: 1, note: "fifth" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "fifth" },
          { pos: 2, dur: 1, note: "sixth" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "third" },
          { pos: 2, dur: 1, note: "octave" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 2, note: "root" }]
  },
  compVoices: ["piano"]
};

// src/core/styles/jazzBlues.ts
var I7 = ch(1, "dom7");
var II72 = ch(2, "dom7");
var ii7 = ch(2, "min7");
var iii7 = ch(3, "min7");
var IV7 = ch(4, "dom7");
var V7 = ch(5, "dom7");
var VI73 = ch(6, "dom7");
var sharpIVdim7 = ch(4, "dim7", 1);
function jazzBlues12() {
  const bar4 = Math.random() < 0.25 ? [II72] : [I7];
  const bar6 = Math.random() < 0.35 ? [sharpIVdim7] : [IV7];
  const bar8 = Math.random() < 0.4 ? [iii7, VI73] : [VI73];
  const bar12 = Math.random() < 0.3 ? [iii7, VI73] : [V7];
  return [[I7], [IV7], [I7], bar4, [IV7], bar6, [I7], bar8, [ii7], [V7], [I7], bar12];
}
function jazzBlues8() {
  return [[I7], [IV7], [I7], [VI73], [ii7], [V7], [I7], [V7]];
}
var jazzBlues = {
  id: "jazzBlues",
  name: "Jazz Blues \u7235\u58EB\u5E03\u9C81\u65AF",
  bpm: { min: 70, max: 220, default: 132 },
  swing: 0.6,
  swingSubdivision: "8n",
  tonic: "dom7",
  // 走固定 form，templates 不参与
  templates: [],
  cadences: [],
  drums: [
    { weight: 4, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3] } },
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] } },
    // 换鼓刷型
    { weight: 2, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3], snareGhost: [1.75, 3.25] } }
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.5], ride: [0, 2] } },
    { weight: 1, pattern: { kick: [0, 2], snare: [3, 3.25, 3.5, 3.75], ride: [0, 1] } }
  ],
  comp: [
    { weight: 3, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }] } },
    // Charleston
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 0.95 },
          { pos: 1.5, dur: 0.45 },
          { pos: 2, dur: 0.95 },
          { pos: 3.5, dur: 0.45 }
        ]
      }
    },
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.9 }, { pos: 2, dur: 1.9 }] } }
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.6 }]
  },
  bass: [
    {
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "third" },
          { pos: 2, dur: 1, note: "fifth" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "fifth" },
          { pos: 2, dur: 1, note: "sixth" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 2, note: "root" }]
  },
  compVoices: ["piano"]
};

// src/core/styles/blues.ts
var eighthHats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
var blues = {
  id: "blues",
  name: "Blues \u5E03\u9C81\u65AF",
  bpm: { min: 50, max: 180, default: 88 },
  swing: 0.6,
  swingSubdivision: "8n",
  tonic: "dom7",
  // 布鲁斯走固定的 12/8 小节 form，templates 不参与
  templates: [],
  cadences: [],
  drums: [
    { weight: 3, pattern: { kick: [0, 2], snare: [1, 3], hihat: eighthHats } },
    { weight: 2, pattern: { kick: [0, 1.5, 2, 3.5], snare: [1, 3], hihat: eighthHats } },
    // boogie 底鼓
    {
      weight: 1,
      pattern: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3], openHat: [3.5] }
    }
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3, 3.25, 3.5], hihat: [] } },
    { weight: 1, pattern: { kick: [0], snare: [1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], ride: [0] } }
  ],
  comp: [
    {
      // shuffle 律动：1 2& 3 4&
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 0.95 },
          { pos: 1.5, dur: 0.45 },
          { pos: 2, dur: 0.95 },
          { pos: 3.5, dur: 0.45 }
        ]
      }
    },
    {
      weight: 1,
      pattern: {
        hits: [0, 1, 2, 3].map((pos) => ({ pos, dur: 0.9 }))
      }
    }
  ],
  compHalf: {
    hits: [
      { pos: 0, dur: 0.95 },
      { pos: 1.5, dur: 0.45 }
    ]
  },
  bass: [
    {
      // 根 - 五 交替
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "fifth" },
          { pos: 2, dur: 1, note: "root" },
          { pos: 3, dur: 1, note: "fifth" }
        ]
      }
    },
    {
      // boogie 行走：根 - 五 - 六 - b7
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "fifth" },
          { pos: 2, dur: 1, note: "sixth" },
          { pos: 3, dur: 1, note: "b7" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 1.9, note: "root" }]
  }
};
function blues12(quickChange, turnaround) {
  const I72 = ch(1, "dom7");
  const IV72 = ch(4, "dom7");
  const V75 = ch(5, "dom7");
  return [
    [I72],
    [quickChange ? IV72 : I72],
    [I72],
    [I72],
    [IV72],
    [IV72],
    [I72],
    [I72],
    [V75],
    [IV72],
    [I72],
    [turnaround ? V75 : I72]
  ];
}
function blues8() {
  const I72 = ch(1, "dom7");
  const IV72 = ch(4, "dom7");
  const V75 = ch(5, "dom7");
  return [[I72], [IV72], [I72], [I72], [IV72], [IV72], [I72], [V75]];
}

// src/core/styles/popRock.ts
var I3 = ch(1, "maj");
var ii3 = ch(2, "min7");
var bIII = ch(3, "maj", -1);
var iii3 = ch(3, "min");
var IV3 = ch(4, "maj");
var V3 = ch(5, "maj");
var vi3 = ch(6, "min");
var bVII = ch(7, "maj", -1);
var eighthHats2 = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
var popRock = {
  id: "popRock",
  name: "Pop / Rock \u6D41\u884C\u6447\u6EDA",
  bpm: { min: 60, max: 200, default: 100 },
  swing: 0,
  swingSubdivision: "8n",
  tonic: "maj",
  templates: [
    { weight: 3, bars: [[I3], [V3], [vi3], [IV3]] },
    // 1-5-6-4
    { weight: 2, bars: [[I3], [vi3], [IV3], [V3]] },
    // 50s 进行
    { weight: 2, bars: [[vi3], [IV3], [I3], [V3]] },
    // 6-4-1-5
    { weight: 3, bars: [[IV3, V3], [iii3, vi3], [ii3, V3], [I3, V3]] },
    // 4536251
    { weight: 2, bars: [[I3], [V3], [vi3], [iii3], [IV3], [I3], [IV3], [V3]] },
    // 卡农
    { weight: 1, bars: [[I3], [bVII], [IV3], [I3]] },
    // 混合利底亚摇滚
    { weight: 1, bars: [[IV3], [I3], [V3], [vi3]] },
    { weight: 2, bars: [[I3], [IV3], [V3], [IV3]] },
    // 经典摇滚
    { weight: 1, bars: [[I3], [bIII], [IV3], [I3]] },
    // 小调借用
    { weight: 2, bars: [[I3], [V3]] },
    { weight: 1, bars: [[vi3], [IV3]] },
    { weight: 1, bars: [[IV3], [I3]] }
    // 变格进行
  ],
  cadences: [
    [[IV3], [V3], [I3]],
    [[IV3], [V3]]
  ],
  drums: [
    { weight: 3, pattern: { kick: [0, 2, 2.5], snare: [1, 3], hihat: eighthHats2 } },
    { weight: 2, pattern: { kick: [0, 1.5, 2.5], snare: [1, 3], hihat: eighthHats2 } },
    {
      weight: 2,
      pattern: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3], openHat: [3.5] }
    },
    {
      weight: 1,
      pattern: { kick: [0, 1.75], snare: [2], hihat: eighthHats2, snareGhost: [1, 3, 3.5] }
      // half-time
    }
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3, 3.25, 3.5, 3.75], hihat: [0] } },
    { weight: 1, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], openHat: [0] } }
  ],
  // 钢琴声部在摇滚里退居长音铺垫，律动交给吉他
  comp: [
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.9 }, { pos: 2, dur: 1.9 }] } },
    { weight: 1, pattern: { hits: [{ pos: 0, dur: 3.9 }] } }
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.9 }]
  },
  bass: [
    {
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1.45, note: "root" },
          { pos: 1.5, dur: 0.45, note: "fifth" },
          { pos: 2, dur: 1.45, note: "root" },
          { pos: 3.5, dur: 0.45, note: "fifth" }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1.45, note: "root" },
          { pos: 1.5, dur: 0.45, note: "root" },
          { pos: 2, dur: 1.45, note: "root" },
          { pos: 3.5, dur: 0.45, note: "octave" }
        ]
      }
    },
    {
      weight: 1,
      pattern: {
        hits: [
          { pos: 0, dur: 0.95, note: "root" },
          { pos: 1, dur: 0.95, note: "root" },
          { pos: 1.5, dur: 0.95, note: "fifth" },
          { pos: 2.5, dur: 0.95, note: "root" },
          { pos: 3, dur: 0.95, note: "root" },
          { pos: 3.5, dur: 0.95, note: "fifth" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 1.9, note: "root" }]
  },
  guitar: {
    comp: [
      {
        weight: 3,
        // 8 分下拨强力和声
        pattern: { hits: eighthHats2.map((pos) => ({ pos, dur: 0.42 })) }
      },
      {
        weight: 2,
        // palm mute 短促音
        pattern: { hits: eighthHats2.map((pos) => ({ pos, dur: 0.2 })) }
      },
      {
        weight: 1,
        // 长音强力和声
        pattern: { hits: [{ pos: 0, dur: 1.9 }, { pos: 2, dur: 1.9 }] }
      }
    ],
    half: {
      hits: [0, 0.5, 1, 1.5].map((pos) => ({ pos, dur: 0.42 }))
    }
  }
};

// src/core/styles/gospel.ts
var Imaj7 = ch(1, "maj7");
var Imaj9 = ch(1, "maj9");
var II73 = ch(2, "dom7");
var ii72 = ch(2, "min7");
var iii72 = ch(3, "min7");
var IVmaj7 = ch(4, "maj7");
var IV9 = ch(4, "dom9");
var V9 = ch(5, "dom9");
var vi7 = ch(6, "min7");
var bVII7 = ch(7, "dom7", -1);
var eighthHats3 = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
var gospel = {
  id: "gospel",
  name: "Gospel \u798F\u97F3",
  bpm: { min: 56, max: 132, default: 78 },
  swing: 0.3,
  swingSubdivision: "8n",
  tonic: "maj9",
  templates: [
    { weight: 3, bars: [[ii72], [V9], [Imaj9], [Imaj9]] },
    { weight: 2, bars: [[Imaj7], [IVmaj7], [V9], [Imaj9]] },
    { weight: 2, bars: [[iii72], [IVmaj7], [V9], [Imaj9]] },
    { weight: 2, bars: [[IVmaj7], [bVII7], [Imaj9], [Imaj9]] },
    // 后门终止
    { weight: 1, bars: [[Imaj7], [vi7], [ii72], [V9]] },
    { weight: 1, bars: [[Imaj9], [II73], [ii72], [V9]] },
    { weight: 2, bars: [[ii72, V9]] },
    { weight: 1, bars: [[Imaj9], [iii72]] }
  ],
  cadences: [
    [[ii72], [V9], [Imaj9]],
    [[ii72], [V9]],
    [[bVII7], [Imaj9]]
  ],
  drums: [
    { weight: 3, pattern: { kick: [0, 1.75, 2.5], snare: [1, 3], hihat: eighthHats3 } },
    {
      weight: 2,
      pattern: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3], openHat: [3.5] }
    },
    { weight: 2, pattern: { kick: [0, 1.75, 2.5], snare: [1, 3], hihat: eighthHats3, snareGhost: [2.75] } },
    { weight: 1, pattern: { kick: [0, 2, 3.5], snare: [1, 3], hihat: eighthHats3 } }
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3, 3.25, 3.5, 3.75], hihat: [0] } },
    { weight: 1, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], openHat: [0] } }
  ],
  comp: [
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 3.9 }] } },
    // 长音铺底
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.9 }, { pos: 2, dur: 1.9 }] } },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 0.95 },
          { pos: 1.5, dur: 0.45 },
          { pos: 2, dur: 0.95 },
          { pos: 3.5, dur: 0.45 }
        ]
      }
    }
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.9 }]
  },
  bass: [
    {
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "third" },
          { pos: 2, dur: 1, note: "fifth" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1.45, note: "root" },
          { pos: 1.5, dur: 0.45, note: "fifth" },
          { pos: 2, dur: 1.45, note: "root" },
          { pos: 3.5, dur: 0.45, note: "octave" }
        ]
      }
    },
    {
      weight: 1,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: "root" },
          { pos: 1, dur: 1, note: "fifth" },
          { pos: 2, dur: 1, note: "sixth" },
          { pos: 3, dur: 1, note: "approach" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 1.9, note: "root" }]
  },
  // 每次生成随机在风琴与钢琴之间切换
  compVoices: ["organ", "piano"]
};

// src/core/styles/bossa.ts
var Imaj72 = ch(1, "maj7");
var II74 = ch(2, "dom7");
var ii73 = ch(2, "min7");
var iii73 = ch(3, "min7");
var IVmaj72 = ch(4, "maj7");
var V72 = ch(5, "dom7");
var vi72 = ch(6, "min7");
var VI74 = ch(6, "dom7");
var eighthHats4 = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
var bossa = {
  id: "bossa",
  name: "Bossa Nova",
  bpm: { min: 60, max: 180, default: 132 },
  swing: 0,
  swingSubdivision: "8n",
  tonic: "maj7",
  templates: [
    { weight: 3, bars: [[Imaj72], [II74], [ii73], [V72]] },
    // Ipanema A 段气息
    { weight: 2, bars: [[Imaj72], [vi72], [ii73], [V72]] },
    { weight: 2, bars: [[Imaj72], [ii73, V72], [Imaj72], [IVmaj72]] },
    { weight: 1, bars: [[iii73], [VI74], [ii73], [V72]] },
    { weight: 2, bars: [[ii73, V72]] },
    // 单小节 ii-V 回转，减少主和弦静态填充
    { weight: 1, bars: [[Imaj72], [VI74]] },
    { weight: 1, bars: [[vi72], [ii73], [V72], [Imaj72]] }
  ],
  cadences: [
    [[ii73, V72], [Imaj72]],
    [[ii73], [V72]]
  ],
  drums: [
    {
      weight: 3,
      pattern: { kick: [1, 3], rim: [0, 0.75, 2.5, 3.5], hihat: eighthHats4 }
      // surdo 2/4 + clave
    },
    {
      weight: 2,
      pattern: { kick: [1, 3], rim: [0.5, 1.5, 2.25, 3.25], hihat: eighthHats4 }
      // clave 变体
    },
    {
      weight: 1,
      pattern: { kick: [1, 3], hihat: eighthHats4 }
      // 只有 surdo + shaker，更空
    }
  ],
  comp: [
    {
      // 反拍吉他律动
      weight: 3,
      pattern: {
        hits: [0.5, 1.5, 2.5, 3.5].map((pos) => ({ pos, dur: 0.4 }))
      }
    },
    {
      // partido alto 气息
      weight: 2,
      pattern: {
        hits: [0.5, 1, 2, 2.5, 3.5].map((pos) => ({ pos, dur: 0.4 }))
      }
    }
  ],
  compHalf: {
    hits: [0.5, 1.5].map((pos) => ({ pos, dur: 0.4 }))
  },
  bass: [
    {
      // 附点律动：根（1.5 拍）+ 五（0.5 拍）
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1.45, note: "root" },
          { pos: 1.5, dur: 0.45, note: "fifth" },
          { pos: 2, dur: 1.45, note: "root" },
          { pos: 3.5, dur: 0.45, note: "fifth" }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1.45, note: "root" },
          { pos: 1.5, dur: 0.45, note: "fifth" },
          { pos: 2, dur: 0.95, note: "root" },
          { pos: 3, dur: 0.95, note: "fifth" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [
      { pos: 0, dur: 1.45, note: "root" },
      { pos: 1.5, dur: 0.45, note: "fifth" }
    ]
  }
};

// src/core/styles/latin.ts
var Imaj73 = ch(1, "maj7");
var ii74 = ch(2, "min7");
var iii74 = ch(3, "min7");
var IVmaj73 = ch(4, "maj7");
var V73 = ch(5, "dom7");
var vi73 = ch(6, "min7");
var latin = {
  id: "latin",
  name: "Latin \u62C9\u4E01",
  bpm: { min: 60, max: 150, default: 96 },
  swing: 0,
  swingSubdivision: "8n",
  tonic: "maj7",
  templates: [
    { weight: 2, bars: [[Imaj73], [vi73], [ii74], [V73]] },
    { weight: 2, bars: [[ii74], [V73], [Imaj73], [Imaj73]] },
    { weight: 1, bars: [[Imaj73], [IVmaj73], [iii74], [vi73]] },
    { weight: 2, bars: [[ii74, V73]] },
    { weight: 1, bars: [[Imaj73], [ii74]] },
    { weight: 1, bars: [[vi73], [ii74], [V73], [Imaj73]] }
  ],
  cadences: [
    [[ii74], [V73], [Imaj73]],
    [[ii74], [V73]]
  ],
  drums: [
    {
      // son clave 3-2 + cascara
      weight: 3,
      pattern: { rim: [0, 0.75, 1.5, 3, 3.5], ride: [0, 0.75, 1.25, 2, 2.75, 3.25] }
    },
    {
      // clave 2-3 变体
      weight: 2,
      pattern: { rim: [0, 1, 1.75, 3.5], ride: [0.5, 1.25, 2, 2.5, 3.25] }
    },
    { weight: 1, pattern: { rim: [0, 0.75, 1.5, 3, 3.5], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] } }
  ],
  drumFills: [
    { weight: 2, pattern: { snare: [1, 1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], rim: [0], kick: [0] } }
  ],
  comp: [
    {
      // montuno 律动
      weight: 3,
      pattern: {
        hits: [0.5, 1.5, 2.5, 3.5].map((pos) => ({ pos, dur: 0.35 }))
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [0, 1.5, 2.5, 3.5].map((pos) => ({ pos, dur: 0.35 }))
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [0.5, 1.5, 2, 3.5].map((pos) => ({ pos, dur: 0.35 }))
      }
    }
  ],
  compHalf: {
    hits: [0.5, 1.5].map((pos) => ({ pos, dur: 0.35 }))
  },
  bass: [
    {
      // tumbao：2& 拍根音 + 4& 拍五音
      weight: 3,
      pattern: {
        hits: [
          { pos: 1.5, dur: 0.95, note: "root" },
          { pos: 3.5, dur: 0.95, note: "fifth" }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 1.5, dur: 0.95, note: "root" },
          { pos: 3.5, dur: 0.95, note: "root" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [{ pos: 1.5, dur: 0.45, note: "root" }]
  },
  compVoices: ["piano"]
};

// src/core/styles/afro.ts
var i7 = ch(1, "min7");
var iv7 = ch(4, "min7");
var IV92 = ch(4, "dom9");
var V74 = ch(5, "dom7");
var bVII9 = ch(7, "dom9", -1);
var eighthHats5 = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
var sixteenthHats = Array.from({ length: 16 }, (_, k) => k * 0.25);
var afro = {
  id: "afro",
  name: "Afrobeat \u975E\u6D32\u5F8B\u52A8",
  bpm: { min: 70, max: 140, default: 102 },
  swing: 0,
  swingSubdivision: "8n",
  tonic: "min7",
  templates: [
    { weight: 3, bars: [[i7], [IV92]] },
    // dorian 律动
    { weight: 2, bars: [[i7], [bVII9]] },
    { weight: 2, bars: [[i7], [IV92], [i7], [IV92]] },
    { weight: 1, bars: [[i7], [iv7], [i7], [V74]] },
    { weight: 1, bars: [[i7], [IV92], [bVII9], [IV92]] }
  ],
  cadences: [
    [[IV92], [i7]],
    [[bVII9], [i7]]
  ],
  drums: [
    { weight: 3, pattern: { kick: [0, 1.5, 2.5, 3.5], rim: [0, 0.75, 2.5, 3.25], hihat: eighthHats5 } },
    { weight: 2, pattern: { kick: [0, 1.5, 2, 3.5], rim: [0.5, 1.5, 2.5, 3.5], hihat: eighthHats5 } },
    { weight: 1, pattern: { kick: [0, 1.5, 2.5, 3.5], rim: [0, 0.75, 2.5, 3.25], hihat: sixteenthHats } }
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3, 3.25, 3.5, 3.75], hihat: [0] } },
    { weight: 1, pattern: { kick: [0], snare: [2.5, 2.75, 3, 3.25, 3.5, 3.75], rim: [0, 0.75] } }
  ],
  comp: [
    {
      // 风琴切分 stab
      weight: 3,
      pattern: {
        hits: [
          { pos: 0.5, dur: 0.4 },
          { pos: 1.5, dur: 0.4 },
          { pos: 2.5, dur: 0.4 },
          { pos: 3.5, dur: 0.4 }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 0.4 },
          { pos: 1.5, dur: 0.4 },
          { pos: 2.5, dur: 0.4 },
          { pos: 3.5, dur: 0.4 }
        ]
      }
    },
    {
      weight: 1,
      pattern: {
        hits: [{ pos: 0.5, dur: 0.45 }, { pos: 2, dur: 0.45 }, { pos: 3.5, dur: 0.45 }]
      }
    }
  ],
  compHalf: {
    hits: [{ pos: 0.5, dur: 0.4 }, { pos: 1.5, dur: 0.4 }]
  },
  bass: [
    {
      // 交织切分低音
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 0.95, note: "root" },
          { pos: 1.5, dur: 0.45, note: "b7" },
          { pos: 2, dur: 0.95, note: "root" },
          { pos: 3.5, dur: 0.45, note: "octave" }
        ]
      }
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 0.45, note: "root" },
          { pos: 0.5, dur: 0.45, note: "root" },
          { pos: 1.5, dur: 0.95, note: "root" },
          { pos: 2.5, dur: 0.95, note: "fifth" },
          { pos: 3.5, dur: 0.45, note: "root" }
        ]
      }
    }
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 1.45, note: "root" }]
  },
  // 节奏吉他 skank
  guitar: {
    comp: [
      {
        weight: 3,
        pattern: { hits: [0.5, 1.5, 2.5, 3.5].map((pos) => ({ pos, dur: 0.18 })) }
      },
      {
        weight: 1,
        pattern: { hits: sixteenthHats.map((pos) => ({ pos, dur: 0.16 })) }
      }
    ],
    half: {
      hits: [0.5, 1.5].map((pos) => ({ pos, dur: 0.18 }))
    }
  },
  compVoices: ["organ"]
};

// src/core/styles/index.ts
var STYLES = {
  jazz,
  bebop,
  jazzBlues,
  blues,
  popRock,
  gospel,
  bossa,
  latin,
  afro
};
var STYLE_LIST = ["jazz", "bebop", "jazzBlues", "blues", "popRock", "gospel", "bossa", "latin", "afro"].map((id) => ({ id, name: STYLES[id].name, def: STYLES[id] }));

// src/core/generator.ts
function weightedPick(items) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}
function cloneBars(bars) {
  return bars.map((b) => b.map((s) => ({ ...s })));
}
function applySpice(bars) {
  const flat = bars.flat();
  flat.forEach((spec, i) => {
    const next = flat[i + 1];
    if (next) {
      if (spec.quality === "min7" && spec.degree === 2 && next.degree === 5 && next.quality === "dom7") {
        if (Math.random() < 0.3) spec.quality = "dom7";
        return;
      }
      if ((spec.quality === "min7" || spec.quality === "min") && spec.degree === 6 && (next.degree === 2 || next.degree === 4)) {
        if (Math.random() < 0.2) spec.quality = "dom7";
        return;
      }
    }
    if (spec.quality === "maj7" && Math.random() < 0.12) spec.quality = "maj6";
  });
}
function formBars(styleId, bars) {
  const mk12 = () => styleId === "blues" ? blues12(Math.random() < 0.5, Math.random() < 0.4) : jazzBlues12();
  const mk8 = () => styleId === "blues" ? blues8() : jazzBlues8();
  const forms = [];
  let rem = bars;
  while (rem >= 12) {
    forms.push(mk12());
    rem -= 12;
  }
  if (rem >= 8) {
    forms.push(mk8());
    rem -= 8;
  }
  if (rem > 0) forms.push(mk8());
  return forms.flat().slice(0, bars);
}
function genericBars(style, bars) {
  const out = [];
  const tail = style.cadences[Math.floor(Math.random() * style.cadences.length)];
  const headTarget = Math.max(0, bars - tail.length);
  let lastTpl = null;
  while (out.length < headTarget) {
    const remaining = headTarget - out.length;
    let pool = style.templates.filter((tp) => tp.bars.length <= remaining);
    if (pool.length > 1 && lastTpl !== null) pool = pool.filter((tp) => tp !== lastTpl);
    if (pool.length === 0) {
      out.push([{ degree: 1, quality: style.tonic }]);
      continue;
    }
    const tpl = weightedPick(pool);
    lastTpl = tpl;
    out.push(...cloneBars(tpl.bars));
  }
  const tailTaken = Math.min(tail.length, bars - out.length);
  out.push(...cloneBars(tail.slice(tail.length - tailTaken)));
  applySpice(out);
  return out;
}
function generateProgression(styleId, key, bars) {
  const style = STYLES[styleId];
  const isForm = styleId === "blues" || styleId === "jazzBlues";
  const barTemplates = isForm ? formBars(styleId, bars) : genericBars(style, bars);
  const scale = scaleSpelling(key);
  const slots = [];
  const outBars = [];
  let beat = 0;
  barTemplates.forEach((bt, i) => {
    const len = 4 / bt.length;
    const ids = [];
    for (const spec of bt) {
      ids.push(slots.length);
      slots.push(buildSlot(key, spec, beat, len, scale, slots.length));
      beat += len;
    }
    outBars.push({ index: i, slotIds: ids });
  });
  return { key, styleId, bars: outBars, slots };
}
