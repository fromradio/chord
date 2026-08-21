import { ch } from '../theory'
import type { StyleDef } from '../../types'

const Imaj7 = ch(1, 'maj7')
const Imaj3 = ch(1, 'maj7', undefined, 3) // Cmaj7/E
const II7 = ch(2, 'dom7') // V7/V
const ii7 = ch(2, 'min7')
const iii7 = ch(3, 'min7')
const IVmaj7 = ch(4, 'maj7')
const V7 = ch(5, 'dom7')
const V73 = ch(5, 'dom7', undefined, 3) // G7/B
const vi7 = ch(6, 'min7')
const VI7 = ch(6, 'dom7')
const bVII7 = ch(7, 'dom7', -1) // backdoor

const eighthHats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]

export const bossa: StyleDef = {
  id: 'bossa',
  name: 'Bossa Nova',
  bpm: { min: 60, max: 180, default: 132 },
  swing: 0,
  swingSubdivision: '8n',
  tonic: 'maj7',
  templates: [
    { weight: 3, bars: [[Imaj7], [II7], [ii7], [V7]] }, // Ipanema A 段气息
    { weight: 2, bars: [[Imaj7], [vi7], [ii7], [V7]] },
    { weight: 2, bars: [[Imaj7], [ii7, V7], [Imaj7], [IVmaj7]] },
    { weight: 1, bars: [[iii7], [VI7], [ii7], [V7]] },
    { weight: 2, bars: [[ii7, V7]] }, // 单小节 ii-V 回转，减少主和弦静态填充
    { weight: 1, bars: [[Imaj7], [VI7]] },
    { weight: 1, bars: [[vi7], [ii7], [V7], [Imaj7]] },
    { weight: 1, bars: [[Imaj7], [Imaj3], [vi7], [V73]] }, // 级进低音
  ],
  cadences: [
    [[ii7, V7], [Imaj7]],
    [[ii7], [V7]],
    [[bVII7], [Imaj7]], // backdoor 终止
  ],
  drums: [
    {
      weight: 3,
      pattern: { kick: [1, 3], rim: [0, 0.75, 2.5, 3.5], hihat: eighthHats }, // surdo 2/4 + clave
    },
    {
      weight: 2,
      pattern: { kick: [1, 3], rim: [0.5, 1.5, 2.25, 3.25], hihat: eighthHats }, // clave 变体
    },
    {
      weight: 1,
      pattern: { kick: [1, 3], hihat: eighthHats }, // 只有 surdo + shaker，更空
    },
  ],
  comp: [
    {
      // 反拍吉他律动
      weight: 3,
      pattern: {
        hits: [0.5, 1.5, 2.5, 3.5].map(pos => ({ pos, dur: 0.4 })),
      },
    },
    {
      // partido alto 气息
      weight: 2,
      pattern: {
        hits: [0.5, 1, 2, 2.5, 3.5].map(pos => ({ pos, dur: 0.4 })),
      },
    },
  ],
  compHalf: {
    hits: [0.5, 1.5].map(pos => ({ pos, dur: 0.4 })),
  },
  bass: [
    {
      // 附点律动：根（1.5 拍）+ 五（0.5 拍）
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
          { pos: 1.5, dur: 0.45, note: 'fifth' },
          { pos: 2, dur: 0.95, note: 'root' },
          { pos: 3, dur: 0.95, note: 'fifth' },
        ],
      },
    },
  ],
  bassHalf: {
    hits: [
      { pos: 0, dur: 1.45, note: 'root' },
      { pos: 1.5, dur: 0.45, note: 'fifth' },
    ],
  },
}
