import { ch } from '../theory'
import type { StyleDef } from '../../types'

const Imaj7 = ch(1, 'maj7')
const Imaj9 = ch(1, 'maj9')
const II7 = ch(2, 'dom7')
const ii7 = ch(2, 'min7')
const iii7 = ch(3, 'min7')
const IVmaj7 = ch(4, 'maj7')
const IV9 = ch(4, 'dom9')
const V9 = ch(5, 'dom9')
const vi7 = ch(6, 'min7')
const bVII7 = ch(7, 'dom7', -1) // 教堂后门终止

const eighthHats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]

export const gospel: StyleDef = {
  id: 'gospel',
  name: 'Gospel 福音',
  bpm: { min: 56, max: 132, default: 78 },
  swing: 0.3,
  swingSubdivision: '8n',
  tonic: 'maj9',
  templates: [
    { weight: 3, bars: [[ii7], [V9], [Imaj9], [Imaj9]] },
    { weight: 2, bars: [[Imaj7], [IVmaj7], [V9], [Imaj9]] },
    { weight: 2, bars: [[iii7], [IVmaj7], [V9], [Imaj9]] },
    { weight: 2, bars: [[IVmaj7], [bVII7], [Imaj9], [Imaj9]] }, // 后门终止
    { weight: 1, bars: [[Imaj7], [vi7], [ii7], [V9]] },
    { weight: 1, bars: [[Imaj9], [II7], [ii7], [V9]] },
    { weight: 2, bars: [[ii7, V9]] },
    { weight: 1, bars: [[Imaj9], [iii7]] },
  ],
  cadences: [
    [[ii7], [V9], [Imaj9]],
    [[ii7], [V9]],
    [[bVII7], [Imaj9]],
  ],
  drums: [
    { weight: 3, pattern: { kick: [0, 1.75, 2.5], snare: [1, 3], hihat: eighthHats } },
    {
      weight: 2,
      pattern: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3], openHat: [3.5] },
    },
    { weight: 2, pattern: { kick: [0, 1.75, 2.5], snare: [1, 3], hihat: eighthHats, snareGhost: [2.75] } },
    { weight: 1, pattern: { kick: [0, 2, 3.5], snare: [1, 3], hihat: eighthHats } },
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3, 3.25, 3.5, 3.75], hihat: [0] } },
    { weight: 1, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], openHat: [0] } },
  ],
  comp: [
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 3.9 }] } }, // 长音铺底
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.9 }, { pos: 2, dur: 1.9 }] } },
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
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.9 }],
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
          { pos: 0, dur: 1.45, note: 'root' },
          { pos: 1.5, dur: 0.45, note: 'fifth' },
          { pos: 2, dur: 1.45, note: 'root' },
          { pos: 3.5, dur: 0.45, note: 'octave' },
        ],
      },
    },
    {
      weight: 1,
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
    hits: [{ pos: 0, dur: 1.9, note: 'root' }],
  },
  // 每次生成随机在风琴与钢琴之间切换
  compVoices: ['organ', 'piano'],
}
