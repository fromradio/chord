import { ch } from '../theory'
import type { StyleDef } from '../../types'

const I = ch(1, 'maj7')
const II7 = ch(2, 'dom7')
const ii = ch(2, 'min7')
const III7 = ch(3, 'dom7')
const iii = ch(3, 'min7')
const IV = ch(4, 'maj7')
const V = ch(5, 'dom7')
const vi = ch(6, 'min7')
const VI7 = ch(6, 'dom7')
const bVII7 = ch(7, 'dom7', -1) // backdoor

export const bebop: StyleDef = {
  id: 'bebop',
  name: 'Bebop 比波普',
  bpm: { min: 140, max: 260, default: 184 },
  swing: 0.6,
  swingSubdivision: '8n',
  tonic: 'maj7',
  templates: [
    { weight: 3, bars: [[I, VI7], [ii, V], [ii, V], [ii, V]] }, // Rhythm Changes A
    { weight: 2, bars: [[iii], [VI7], [II7], [V]] }, // 四度圈桥段
    { weight: 2, bars: [[I], [II7], [ii], [V]] }, // Confirmation 气息
    { weight: 2, bars: [[I, VI7], [ii, V], [iii, VI7], [ii, V]] },
    { weight: 1, bars: [[III7], [VI7], [II7], [V]] },
    { weight: 1, bars: [[I], [vi], [ii], [V]] },
    { weight: 2, bars: [[ii, V]] },
    { weight: 1, bars: [[I], [IV], [ii, V], [I]] },
  ],
  cadences: [
    [[ii], [V], [I]],
    [[ii], [V]],
    [[iii, VI7], [ii, V]],
    [[bVII7], [I]], // backdoor 终止
  ],
  drums: [
    { weight: 4, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3] } },
    { weight: 2, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3], snareGhost: [1.75, 2.75, 3.25] } },
    { weight: 2, pattern: { ride: [0, 1, 2, 3], hihat: [1, 3], kick: [0, 2] } },
    { weight: 1, pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], openHat: [3.5], hihat: [1, 3] } },
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.5], ride: [0, 2] } },
    { weight: 1, pattern: { kick: [0, 2], snare: [3, 3.25, 3.5, 3.75], ride: [0, 1] } },
  ],
  comp: [
    { weight: 3, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }] } },
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }, { pos: 2.5, dur: 0.45 }] } },
    { weight: 2, pattern: { hits: [{ pos: 0.5, dur: 0.45 }, { pos: 1.5, dur: 0.45 }, { pos: 2.5, dur: 0.45 }] } },
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
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1, note: 'root' },
          { pos: 1, dur: 1, note: 'third' },
          { pos: 2, dur: 1, note: 'octave' },
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
