import { ch } from '../theory'
import type { StyleDef } from '../../types'

const I = ch(1, 'maj')
const ii = ch(2, 'min7')
const iii = ch(3, 'min')
const IV = ch(4, 'maj')
const V = ch(5, 'maj')
const vi = ch(6, 'min')
const bVII = ch(7, 'maj', -1)

export const popRock: StyleDef = {
  id: 'popRock',
  name: 'Pop / Rock 流行摇滚',
  bpm: { min: 60, max: 200, default: 96 },
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
    { weight: 2, bars: [[I], [V]] }, // 短模板，减少主和弦静态填充
    { weight: 1, bars: [[vi], [IV]] },
    { weight: 1, bars: [[IV], [I]] }, // 变格进行
  ],
  cadences: [
    [[IV], [V], [I]],
    [[IV], [V]],
  ],
  drums: {
    kick: [0, 2, 2.5],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  },
  comp: {
    hits: [
      { pos: 0, dur: 1.9 },
      { pos: 2, dur: 1.9 },
    ],
  },
  compHalf: {
    hits: [{ pos: 0, dur: 1.9 }],
  },
  bass: {
    hits: [
      { pos: 0, dur: 1.45, note: 'root' },
      { pos: 1.5, dur: 0.45, note: 'fifth' },
      { pos: 2, dur: 1.45, note: 'root' },
      { pos: 3.5, dur: 0.45, note: 'fifth' },
    ],
  },
  bassHalf: {
    hits: [{ pos: 0, dur: 1.9, note: 'root' }],
  },
}
