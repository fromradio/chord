import { ch } from '../theory'
import type { StyleDef } from '../../types'

const Imaj7 = ch(1, 'maj7')
const ii7 = ch(2, 'min7')
const iii7 = ch(3, 'min7')
const IVmaj7 = ch(4, 'maj7')
const V7 = ch(5, 'dom7')
const vi7 = ch(6, 'min7')

export const latin: StyleDef = {
  id: 'latin',
  name: 'Latin 拉丁',
  bpm: { min: 60, max: 150, default: 96 },
  swing: 0,
  swingSubdivision: '8n',
  tonic: 'maj7',
  templates: [
    { weight: 2, bars: [[Imaj7], [vi7], [ii7], [V7]] },
    { weight: 2, bars: [[ii7], [V7], [Imaj7], [Imaj7]] },
    { weight: 1, bars: [[Imaj7], [IVmaj7], [iii7], [vi7]] },
    { weight: 2, bars: [[ii7, V7]] },
    { weight: 1, bars: [[Imaj7], [ii7]] },
    { weight: 1, bars: [[vi7], [ii7], [V7], [Imaj7]] },
  ],
  cadences: [
    [[ii7], [V7], [Imaj7]],
    [[ii7], [V7]],
  ],
  drums: [
    {
      // son clave 3-2 + cascara
      weight: 3,
      pattern: { rim: [0, 0.75, 1.5, 3, 3.5], ride: [0, 0.75, 1.25, 2, 2.75, 3.25] },
    },
    {
      // clave 2-3 变体
      weight: 2,
      pattern: { rim: [0, 1, 1.75, 3.5], ride: [0.5, 1.25, 2, 2.5, 3.25] },
    },
    { weight: 1, pattern: { rim: [0, 0.75, 1.5, 3, 3.5], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] } },
  ],
  drumFills: [
    { weight: 2, pattern: { snare: [1, 1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], rim: [0], kick: [0] } },
  ],
  comp: [
    {
      // montuno 律动
      weight: 3,
      pattern: {
        hits: [0.5, 1.5, 2.5, 3.5].map(pos => ({ pos, dur: 0.35 })),
      },
    },
    {
      weight: 2,
      pattern: {
        hits: [0, 1.5, 2.5, 3.5].map(pos => ({ pos, dur: 0.35 })),
      },
    },
    {
      weight: 2,
      pattern: {
        hits: [0.5, 1.5, 2, 3.5].map(pos => ({ pos, dur: 0.35 })),
      },
    },
  ],
  compHalf: {
    hits: [0.5, 1.5].map(pos => ({ pos, dur: 0.35 })),
  },
  bass: [
    {
      // tumbao：2& 拍根音 + 4& 拍五音
      weight: 3,
      pattern: {
        hits: [
          { pos: 1.5, dur: 0.95, note: 'root' },
          { pos: 3.5, dur: 0.95, note: 'fifth' },
        ],
      },
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 1.5, dur: 0.95, note: 'root' },
          { pos: 3.5, dur: 0.95, note: 'root' },
        ],
      },
    },
  ],
  bassHalf: {
    hits: [{ pos: 1.5, dur: 0.45, note: 'root' }],
  },
  compVoices: ['piano'],
}
