import { ch } from '../theory'
import type { StyleDef } from '../../types'

const i7 = ch(1, 'min7') // 小调式律动
const iv7 = ch(4, 'min7')
const IV9 = ch(4, 'dom9')
const V7 = ch(5, 'dom7')
const bVII9 = ch(7, 'dom9', -1)

const eighthHats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
const sixteenthHats = Array.from({ length: 16 }, (_, k) => k * 0.25)

export const afro: StyleDef = {
  id: 'afro',
  name: 'Afrobeat 非洲律动',
  bpm: { min: 70, max: 140, default: 102 },
  swing: 0,
  swingSubdivision: '8n',
  tonic: 'min7',
  templates: [
    { weight: 3, bars: [[i7], [IV9]] }, // dorian 律动
    { weight: 2, bars: [[i7], [bVII9]] },
    { weight: 2, bars: [[i7], [IV9], [i7], [IV9]] },
    { weight: 1, bars: [[i7], [iv7], [i7], [V7]] },
    { weight: 1, bars: [[i7], [IV9], [bVII9], [IV9]] },
  ],
  cadences: [
    [[IV9], [i7]],
    [[bVII9], [i7]],
  ],
  drums: [
    { weight: 3, pattern: { kick: [0, 1.5, 2.5, 3.5], rim: [0, 0.75, 2.5, 3.25], hihat: eighthHats } },
    { weight: 2, pattern: { kick: [0, 1.5, 2, 3.5], rim: [0.5, 1.5, 2.5, 3.5], hihat: eighthHats } },
    { weight: 1, pattern: { kick: [0, 1.5, 2.5, 3.5], rim: [0, 0.75, 2.5, 3.25], hihat: sixteenthHats } },
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3, 3.25, 3.5, 3.75], hihat: [0] } },
    { weight: 1, pattern: { kick: [0], snare: [2.5, 2.75, 3, 3.25, 3.5, 3.75], rim: [0, 0.75] } },
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
          { pos: 3.5, dur: 0.4 },
        ],
      },
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 0.4 },
          { pos: 1.5, dur: 0.4 },
          { pos: 2.5, dur: 0.4 },
          { pos: 3.5, dur: 0.4 },
        ],
      },
    },
    {
      weight: 1,
      pattern: {
        hits: [{ pos: 0.5, dur: 0.45 }, { pos: 2, dur: 0.45 }, { pos: 3.5, dur: 0.45 }],
      },
    },
  ],
  compHalf: {
    hits: [{ pos: 0.5, dur: 0.4 }, { pos: 1.5, dur: 0.4 }],
  },
  bass: [
    {
      // 交织切分低音
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 0.95, note: 'root' },
          { pos: 1.5, dur: 0.45, note: 'b7' },
          { pos: 2, dur: 0.95, note: 'root' },
          { pos: 3.5, dur: 0.45, note: 'octave' },
        ],
      },
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 0.45, note: 'root' },
          { pos: 0.5, dur: 0.45, note: 'root' },
          { pos: 1.5, dur: 0.95, note: 'root' },
          { pos: 2.5, dur: 0.95, note: 'fifth' },
          { pos: 3.5, dur: 0.45, note: 'root' },
        ],
      },
    },
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 1.45, note: 'root' }],
  },
  // 节奏吉他 skank
  guitar: {
    comp: [
      {
        weight: 3,
        pattern: { hits: [0.5, 1.5, 2.5, 3.5].map(pos => ({ pos, dur: 0.18 })) },
      },
      {
        weight: 1,
        pattern: { hits: sixteenthHats.map(pos => ({ pos, dur: 0.16 })) },
      },
    ],
    half: {
      hits: [0.5, 1.5].map(pos => ({ pos, dur: 0.18 })),
    },
  },
  compVoices: ['organ'],
}
