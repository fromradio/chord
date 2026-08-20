import { ch } from '../theory'
import type { StyleDef } from '../../types'

const I = ch(1, 'maj7')
const ii = ch(2, 'min7')
const iii = ch(3, 'min7')
const IV = ch(4, 'maj7')
const V = ch(5, 'dom7')
const vi = ch(6, 'min7')
const VI7 = ch(6, 'dom7') // V7/ii

export const jazz: StyleDef = {
  id: 'jazz',
  name: 'Jazz 爵士',
  bpm: { min: 60, max: 220, default: 130 },
  swing: 0.55,
  swingSubdivision: '8n',
  tonic: 'maj7',
  templates: [
    { weight: 3, bars: [[ii], [V], [I]] },
    { weight: 3, bars: [[I], [VI7], [ii], [V]] },
    { weight: 1, bars: [[iii], [VI7], [ii], [V]] },
    { weight: 2, bars: [[I, VI7], [ii, V], [ii, V], [ii, V]] }, // Rhythm Changes A 段气息
    { weight: 1, bars: [[I], [vi], [ii], [V]] },
    { weight: 1, bars: [[I], [iii], [vi], [ii]] }, // 下行四度圈
    { weight: 1, bars: [[I], [IV], [iii, vi], [ii, V]] },
    { weight: 2, bars: [[ii, V]] }, // 单小节 ii-V，减少主和弦静态填充
    { weight: 1, bars: [[iii, VI7]] },
  ],
  cadences: [
    [[ii], [V], [I]],
    [[ii], [V]], // turnaround 结尾，循环时回到开头更顺
    [[I, VI7], [ii, V]],
  ],
  drums: {
    kick: [],
    snare: [],
    hihat: [1, 3], // 踩镲脚拍 2、4
    ride: [0, 1, 1.5, 2, 3, 3.5], // swing ride：1 2& 3 4&
  },
  comp: {
    // Charleston 律动
    hits: [
      { pos: 0, dur: 1.6 },
      { pos: 1.5, dur: 0.45 },
    ],
  },
  compHalf: {
    hits: [{ pos: 0, dur: 1.6 }],
  },
  bass: {
    // 行走贝斯：根 - 三 - 五 - 半音导入下一和弦
    hits: [
      { pos: 0, dur: 1, note: 'root' },
      { pos: 1, dur: 1, note: 'third' },
      { pos: 2, dur: 1, note: 'fifth' },
      { pos: 3, dur: 1, note: 'approach' },
    ],
  },
  bassHalf: {
    hits: [{ pos: 0, dur: 2, note: 'root' }],
  },
}
