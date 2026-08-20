import type { Bar, BarTemplate, ChordSlot, ChordSpec, KeyDef, Progression, StyleDef } from '../types'
import { STYLES } from './styles'
import { blues12, blues8 } from './styles/blues'
import { buildSlot, scaleSpelling } from './theory'

export function weightedPick<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const it of items) {
    r -= it.weight
    if (r <= 0) return it
  }
  return items[items.length - 1]
}

function cloneBars(bars: BarTemplate[]): BarTemplate[] {
  return bars.map(b => b.map(s => ({ ...s })))
}

/**
 * 和声加料（原地修改，输入必须是克隆）：
 * - ii7 后接 V7 时有概率变成 II7（副属 V7/V）
 * - vi(m) 后接 ii/IV 时有概率变成 VI7（副属 V7/ii）
 * - maj7 偶尔换成 maj6 增加色彩
 */
function applySpice(bars: BarTemplate[]): void {
  const flat = bars.flat()
  flat.forEach((spec, i) => {
    const next = flat[i + 1]
    if (next) {
      if (spec.quality === 'min7' && spec.degree === 2 && next.degree === 5 && next.quality === 'dom7') {
        if (Math.random() < 0.3) spec.quality = 'dom7'
        return
      }
      if (
        (spec.quality === 'min7' || spec.quality === 'min') &&
        spec.degree === 6 &&
        (next.degree === 2 || next.degree === 4)
      ) {
        if (Math.random() < 0.2) spec.quality = 'dom7'
        return
      }
    }
    if (spec.quality === 'maj7' && Math.random() < 0.12) spec.quality = 'maj6'
  })
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
    out.push(...cloneBars(tpl.bars))
  }
  const tailTaken = Math.min(tail.length, bars - out.length)
  out.push(...cloneBars(tail.slice(tail.length - tailTaken)))
  applySpice(out)
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
