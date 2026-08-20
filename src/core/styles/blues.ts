import { ch } from '../theory'
import type { StyleDef } from '../../types'

export const blues: StyleDef = {
  id: 'blues',
  name: 'Blues 布鲁斯',
  bpm: { min: 50, max: 180, default: 88 },
  swing: 0.6,
  swingSubdivision: '8n',
  tonic: 'dom7',
  // 布鲁斯走固定的 12/8 小节 form，templates 不参与
  templates: [],
  cadences: [],
  drums: {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  },
  comp: {
    // shuffle 律动：1 2& 3 4&
    hits: [
      { pos: 0, dur: 0.95 },
      { pos: 1.5, dur: 0.45 },
      { pos: 2, dur: 0.95 },
      { pos: 3.5, dur: 0.45 },
    ],
  },
  compHalf: {
    hits: [
      { pos: 0, dur: 0.95 },
      { pos: 1.5, dur: 0.45 },
    ],
  },
  bass: {
    hits: [
      { pos: 0, dur: 1, note: 'root' },
      { pos: 1, dur: 1, note: 'fifth' },
      { pos: 2, dur: 1, note: 'root' },
      { pos: 3, dur: 1, note: 'fifth' },
    ],
  },
  bassHalf: {
    hits: [{ pos: 0, dur: 1.9, note: 'root' }],
  },
}

/** 标准 12 小节 form（quickChange / turnaround 随机变化） */
export function blues12(quickChange: boolean, turnaround: boolean) {
  const I7 = ch(1, 'dom7')
  const IV7 = ch(4, 'dom7')
  const V7 = ch(5, 'dom7')
  return [
    [I7],
    [quickChange ? IV7 : I7],
    [I7],
    [I7],
    [IV7],
    [IV7],
    [I7],
    [I7],
    [V7],
    [IV7],
    [I7],
    [turnaround ? V7 : I7],
  ]
}

/** 8 小节 form */
export function blues8() {
  const I7 = ch(1, 'dom7')
  const IV7 = ch(4, 'dom7')
  const V7 = ch(5, 'dom7')
  return [[I7], [IV7], [I7], [I7], [IV7], [IV7], [I7], [V7]]
}
