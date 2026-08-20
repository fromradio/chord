import type { Bar, BarTemplate, ChordSlot, KeyDef, Progression, StyleDef } from '../types'
import { STYLES } from './styles'
import { blues12, blues8 } from './styles/blues'
import { buildSlot, scaleSpelling } from './theory'

function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const it of items) {
    r -= it.weight
    if (r <= 0) return it
  }
  return items[items.length - 1]
}

/** 布鲁斯：按 8/12 小节 form 对齐填满请求的小节数 */
function bluesBars(bars: number): BarTemplate[] {
  const forms: BarTemplate[][] = []
  let rem = bars
  while (rem >= 12) {
    forms.push(blues12(Math.random() < 0.5, Math.random() < 0.4))
    rem -= 12
  }
  if (rem >= 8) {
    forms.push(blues8())
    rem -= 8
  }
  if (rem > 0) forms.push(blues8())
  return forms.flat().slice(0, bars)
}

/** 通用：加权随机拼接模板，结尾落在一个随机终止式上 */
function genericBars(style: StyleDef, bars: number): BarTemplate[] {
  const out: BarTemplate[] = []
  const tail = style.cadences[Math.floor(Math.random() * style.cadences.length)]
  const headTarget = Math.max(0, bars - tail.length)
  let lastTpl: unknown = null
  while (out.length < headTarget) {
    const remaining = headTarget - out.length
    let pool = style.templates.filter(tp => tp.bars.length <= remaining)
    if (pool.length > 1 && lastTpl !== null) pool = pool.filter(tp => tp !== lastTpl)
    if (pool.length === 0) {
      out.push([{ degree: 1, quality: style.tonic }])
      continue
    }
    const tpl = weightedPick(pool)
    lastTpl = tpl
    out.push(...tpl.bars)
  }
  const tailTaken = Math.min(tail.length, bars - out.length)
  out.push(...tail.slice(tail.length - tailTaken))
  return out
}

export function generateProgression(styleId: keyof typeof STYLES, key: KeyDef, bars: number): Progression {
  const style = STYLES[styleId]
  const barTemplates = styleId === 'blues' ? bluesBars(bars) : genericBars(style, bars)
  const scale = scaleSpelling(key)

  const slots: ChordSlot[] = []
  const outBars: Bar[] = []
  let beat = 0
  barTemplates.forEach((bt, i) => {
    const len = 4 / bt.length
    const ids: number[] = []
    for (const spec of bt) {
      ids.push(slots.length)
      slots.push(buildSlot(key, spec, beat, len, scale, slots.length))
      beat += len
    }
    outBars.push({ index: i, slotIds: ids })
  })

  return { key, styleId, bars: outBars, slots }
}
