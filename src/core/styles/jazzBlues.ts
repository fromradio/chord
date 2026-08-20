import { ch } from '../theory'
import type { BarTemplate, StyleDef } from '../../types'

const I7 = ch(1, 'dom7')
const II7 = ch(2, 'dom7') // V7/V
const ii7 = ch(2, 'min7')
const iii7 = ch(3, 'min7')
const IV7 = ch(4, 'dom7')
const V7 = ch(5, 'dom7')
const VI7 = ch(6, 'dom7')
const sharpIVdim7 = ch(4, 'dim7', 1) // 经过减和弦

/** 爵士布鲁斯 12 小节 form（带 bebop 变化） */
export function jazzBlues12(): BarTemplate[] {
  const bar4 = Math.random() < 0.25 ? [II7] : [I7]
  const bar6 = Math.random() < 0.35 ? [sharpIVdim7] : [IV7]
  const bar8 = Math.random() < 0.4 ? [iii7, VI7] : [VI7]
  const bar12 = Math.random() < 0.3 ? [iii7, VI7] : [V7]
  return [[I7], [IV7], [I7], bar4, [IV7], bar6, [I7], bar8, [ii7], [V7], [I7], bar12]
}

/** 8 小节 form */
export function jazzBlues8(): BarTemplate[] {
  return [[I7], [IV7], [I7], [VI7], [ii7], [V7], [I7], [V7]]
}

export const jazzBlues: StyleDef = {
  id: 'jazzBlues',
  name: 'Jazz Blues 爵士布鲁斯',
  bpm: { min: 70, max: 220, default: 132 },
  swing: 0.6,
  swingSubdivision: '8n',
  tonic: 'dom7',
  // 走固定 form，templates 不参与
  templates: [],
  cadences: [],
  drums: [
    { weight: 4, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3] } },
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] } }, // 换鼓刷型
    { weight: 2, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3], snareGhost: [1.75, 3.25] } },
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.5], ride: [0, 2] } },
    { weight: 1, pattern: { kick: [0, 2], snare: [3, 3.25, 3.5, 3.75], ride: [0, 1] } },
  ],
  comp: [
    { weight: 3, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }] } }, // Charleston
    {
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
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.9 }, { pos: 2, dur: 1.9 }] } },
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.6 }],
  },
  bass: [
    {
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: 'root' },
          { pos: 1, dur: 1, note: 'third' },
          { pos: 2, dur: 1, note: 'fifth' },
          { pos: 3, dur: 1, note: 'approach' },
        ],
      },
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: 'root' },
          { pos: 1, dur: 1, note: 'fifth' },
          { pos: 2, dur: 1, note: 'sixth' },
          { pos: 3, dur: 1, note: 'approach' },
        ],
      },
    },
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 2, note: 'root' }],
  },
  compVoices: ['piano'],
}
