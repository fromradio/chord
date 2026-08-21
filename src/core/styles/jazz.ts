import { ch } from '../theory'
import type { StyleDef } from '../../types'

const I = ch(1, 'maj7')
const I3 = ch(1, 'maj7', undefined, 3) // Cmaj7/E
const ii = ch(2, 'min7')
const iii = ch(3, 'min7')
const IV = ch(4, 'maj7')
const V = ch(5, 'dom7')
const V7b = ch(5, 'dom7', undefined, 7) // G7/F
const vi = ch(6, 'min7')
const VI7 = ch(6, 'dom7') // V7/ii
const bVII7 = ch(7, 'dom7', -1) // backdoor

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
    { weight: 1, bars: [[I], [I3], [IV], [V7b]] }, // 级进低音线
  ],
  cadences: [
    [[ii], [V], [I]],
    [[ii], [V]], // turnaround 结尾，循环时回到开头更顺
    [[I, VI7], [ii, V]],
    [[bVII7], [I]], // backdoor 终止
  ],
  drums: [
    {
      weight: 4,
      pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3] }, // 经典 swing ride + 踩镲脚拍
    },
    {
      weight: 2,
      pattern: { ride: [0, 1, 2, 3], hihat: [1, 3] }, // 四分 ride，更松弛
    },
    {
      weight: 2,
      pattern: { ride: [0, 1, 1.5, 2, 3, 3.5], hihat: [1, 3], snareGhost: [1.75, 3.25] },
    },
    {
      weight: 1,
      pattern: { ride: [0, 1, 2, 3], openHat: [3.5], hihat: [1, 3] },
    },
  ],
  drumFills: [
    { weight: 2, pattern: { kick: [0], snare: [1, 1.5, 2, 2.5, 3, 3.5], ride: [0, 2] } },
    { weight: 1, pattern: { kick: [0, 2], snare: [3, 3.25, 3.5, 3.75], ride: [0, 1] } },
    { weight: 1, pattern: { ride: [0, 1], snare: [1.5, 2, 2.5, 3, 3.25, 3.5, 3.75], kick: [0] } },
  ],
  comp: [
    { weight: 3, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }] } }, // Charleston
    { weight: 2, pattern: { hits: [{ pos: 0, dur: 1.6 }, { pos: 1.5, dur: 0.45 }, { pos: 2.5, dur: 0.45 }] } },
    { weight: 1, pattern: { hits: [{ pos: 0.5, dur: 0.45 }, { pos: 1.5, dur: 0.45 }, { pos: 2.5, dur: 0.45 }] } }, // 反拍
  ],
  compHalf: {
    hits: [{ pos: 0, dur: 1.6 }],
  },
  bass: [
    {
      // 行走贝斯：根 - 三 - 五 - 半音导入
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
      // 根 - 五 - 六 - 半音导入
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
      // 根 - 三 - 八度 - 半音导入
      weight: 1,
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
}
