import { ch } from '../theory'
import type { StyleDef } from '../../types'

const eighthHats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]

export const blues: StyleDef = {
  id: 'blues',
  name: 'Blues 布鲁斯',
  bpm: { min: 50, max: 180, default: 88 },
  swing: 0.6,
  swingSubdivision: '8n',
  tonic: 'dom7',
  // 布鲁斯走固定的 12/8 小节 form，templates 不参与
  templates: [],
  cadences: [],
  drums: [
    { weight: 3, pattern: { kick: [0, 2], snare: [1, 3], hihat: eighthHats } },
    { weight: 2, pattern: { kick: [0, 1.5, 2, 3.5], snare: [1, 3], hihat: eighthHats } }, // boogie 底鼓
    {
      weight: 1,
      pattern: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3], openHat: [3.5] },
    },
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3, 3.25, 3.5], hihat: [] } },
    { weight: 1, pattern: { kick: [0], snare: [1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], ride: [0] } },
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
          { pos: 3.5, dur: 0.45 },
        ],
      },
    },
    {
      weight: 1,
      pattern: {
        hits: [0, 1, 2, 3].map(pos => ({ pos, dur: 0.9 })),
      },
    },
  ],
  compHalf: {
    hits: [
      { pos: 0, dur: 0.95 },
      { pos: 1.5, dur: 0.45 },
    ],
  },
  bass: [
    {
      // 根 - 五 交替
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: 'root' },
          { pos: 1, dur: 1, note: 'fifth' },
          { pos: 2, dur: 1, note: 'root' },
          { pos: 3, dur: 1, note: 'fifth' },
        ],
      },
    },
    {
      // boogie 行走：根 - 五 - 六 - b7
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: 'root' },
          { pos: 1, dur: 1, note: 'fifth' },
          { pos: 2, dur: 1, note: 'sixth' },
          { pos: 3, dur: 1, note: 'b7' },
        ],
      },
    },
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 1.9, note: 'root' }],
  },
}

/** 标准 12 小节 form（quickChange / turnaround 随机变化） */
export function blues12(quickChange: boolean, turnaround: boolean) {
  const I7 = ch(1, 'dom7')
  const IV7 = ch(4, 'dom7')
  const V7 = ch(5, 'dom7')
  return [
    [I7],
    [quickChange ? IV7 : I7],
    [I7],
    [I7],
    [IV7],
    [IV7],
    [I7],
    [I7],
    [V7],
    [IV7],
    [I7],
    [turnaround ? V7 : I7],
  ]
}

/** 8 小节 form */
export function blues8() {
  const I7 = ch(1, 'dom7')
  const IV7 = ch(4, 'dom7')
  const V7 = ch(5, 'dom7')
  return [[I7], [IV7], [I7], [I7], [IV7], [IV7], [I7], [V7]]
}
