import { ch } from '../theory'
import type { StyleDef } from '../../types'

const Imaj7 = ch(1, 'maj7')
const II7 = ch(2, 'dom7') // V7/V
const ii7 = ch(2, 'min7')
const iii7 = ch(3, 'min7')
const IVmaj7 = ch(4, 'maj7')
const V7 = ch(5, 'dom7')
const vi7 = ch(6, 'min7')
const VI7 = ch(6, 'dom7')

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
  ],
  cadences: [
    [[ii7, V7], [Imaj7]],
    [[ii7], [V7]],
  ],
  drums: {
    kick: [1, 3], // surdo：2、4 拍
    snare: [],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    rim: [0, 0.75, 2.5, 3.5], // bossa clave 气息
  },
  comp: {
    // 反拍吉他律动
    hits: [
      { pos: 0.5, dur: 0.4 },
      { pos: 1.5, dur: 0.4 },
      { pos: 2.5, dur: 0.4 },
      { pos: 3.5, dur: 0.4 },
    ],
  },
  compHalf: {
    hits: [
      { pos: 0.5, dur: 0.4 },
      { pos: 1.5, dur: 0.4 },
    ],
  },
  bass: {
    // 附点律动：根（1.5 拍）+ 五（0.5 拍）
    hits: [
      { pos: 0, dur: 1.45, note: 'root' },
      { pos: 1.5, dur: 0.45, note: 'fifth' },
      { pos: 2, dur: 1.45, note: 'root' },
      { pos: 3.5, dur: 0.45, note: 'fifth' },
    ],
  },
  bassHalf: {
    hits: [
      { pos: 0, dur: 1.45, note: 'root' },
      { pos: 1.5, dur: 0.45, note: 'fifth' },
    ],
  },
}
