import { ch } from '../theory'
import type { StyleDef } from '../../types'

const I = ch(1, 'maj')
const ii = ch(2, 'min7')
const bIII = ch(3, 'maj', -1)
const iii = ch(3, 'min')
const IV = ch(4, 'maj')
const V = ch(5, 'maj')
const vi = ch(6, 'min')
const bVII = ch(7, 'maj', -1)

const eighthHats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]

export const popRock: StyleDef = {
  id: 'popRock',
  name: 'Pop / Rock 流行摇滚',
  bpm: { min: 60, max: 200, default: 100 },
  swing: 0,
  swingSubdivision: '8n',
  tonic: 'maj',
  templates: [
    { weight: 3, bars: [[I], [V], [vi], [IV]] }, // 1-5-6-4
    { weight: 2, bars: [[I], [vi], [IV], [V]] }, // 50s 进行
    { weight: 2, bars: [[vi], [IV], [I], [V]] }, // 6-4-1-5
    { weight: 3, bars: [[IV, V], [iii, vi], [ii, V], [I, V]] }, // 4536251
    { weight: 2, bars: [[I], [V], [vi], [iii], [IV], [I], [IV], [V]] }, // 卡农
    { weight: 1, bars: [[I], [bVII], [IV], [I]] }, // 混合利底亚摇滚
    { weight: 1, bars: [[IV], [I], [V], [vi]] },
    { weight: 2, bars: [[I], [IV], [V], [IV]] }, // 经典摇滚
    { weight: 1, bars: [[I], [bIII], [IV], [I]] }, // 小调借用
    { weight: 2, bars: [[I], [V]] },
    { weight: 1, bars: [[vi], [IV]] },
    { weight: 1, bars: [[IV], [I]] }, // 变格进行
  ],
  cadences: [
    [[IV], [V], [I]],
    [[IV], [V]],
    [[bVII], [IV], [I]], // 摇滚式终止
  ],
  drums: [
    { weight: 3, pattern: { kick: [0, 2, 2.5], snare: [1, 3], hihat: eighthHats } },
    { weight: 2, pattern: { kick: [0, 1.5, 2.5], snare: [1, 3], hihat: eighthHats } },
    {
      weight: 2,
      pattern: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3], openHat: [3.5] },
    },
    {
      weight: 1,
      pattern: { kick: [0, 1.75], snare: [2], hihat: eighthHats, snareGhost: [1, 3, 3.5] }, // half-time
    },
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0, 2], snare: [1, 3, 3.25, 3.5, 3.75], hihat: [0] } },
    { weight: 1, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], openHat: [0] } },
  ],
  // 钢琴声部在摇滚里退居长音铺垫，律动交给吉他
  comp: [
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.9 }, { pos: 2, dur: 1.9 }] } },
    { weight: 1, pattern: { hits: [{ pos: 0, dur: 3.9 }] } },
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.9 }],
  },
  bass: [
    {
      weight: 3,
      pattern: {
        hits: [
          { pos: 0, dur: 1.45, note: 'root' },
          { pos: 1.5, dur: 0.45, note: 'fifth' },
          { pos: 2, dur: 1.45, note: 'root' },
          { pos: 3.5, dur: 0.45, note: 'fifth' },
        ],
      },
    },
    {
      weight: 2,
      pattern: {
        hits: [
          { pos: 0, dur: 1.45, note: 'root' },
          { pos: 1.5, dur: 0.45, note: 'root' },
          { pos: 2, dur: 1.45, note: 'root' },
          { pos: 3.5, dur: 0.45, note: 'octave' },
        ],
      },
    },
    {
      weight: 1,
      pattern: {
        hits: [
          { pos: 0, dur: 0.95, note: 'root' },
          { pos: 1, dur: 0.95, note: 'root' },
          { pos: 1.5, dur: 0.95, note: 'fifth' },
          { pos: 2.5, dur: 0.95, note: 'root' },
          { pos: 3, dur: 0.95, note: 'root' },
          { pos: 3.5, dur: 0.95, note: 'fifth' },
        ],
      },
    },
  ],
  bassHalf: {
    hits: [{ pos: 0, dur: 1.9, note: 'root' }],
  },
  guitar: {
    comp: [
      {
        weight: 3,
        // 8 分下拨强力和声
        pattern: { hits: eighthHats.map(pos => ({ pos, dur: 0.42 })) },
      },
      {
        weight: 2,
        // palm mute 短促音
        pattern: { hits: eighthHats.map(pos => ({ pos, dur: 0.2 })) },
      },
      {
        weight: 1,
        // 长音强力和声
        pattern: { hits: [{ pos: 0, dur: 1.9 }, { pos: 2, dur: 1.9 }] },
      },
    ],
    half: {
      hits: [0, 0.5, 1, 1.5].map(pos => ({ pos, dur: 0.42 })),
    },
  },
}
