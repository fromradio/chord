import type { Bar, BarTemplate, ChordQuality, ChordSlot, ChordSpec, KeyDef, Progression, StyleDef, StyleId, TemplateDef } from '../types'
import { STYLES } from './styles'
import { blues12, blues8 } from './styles/blues'
import { jazzBlues12, jazzBlues8 } from './styles/jazzBlues'
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

const MAJORISH = new Set<ChordQuality>(['maj', 'maj6', 'maj7', 'maj9'])

function isDominant(q: ChordQuality): boolean {
  return q === 'dom7' || q === 'dom9'
}

function entrySpec(t: TemplateDef): ChordSpec {
  return t.bars[0][0]
}
function exitSpec(t: TemplateDef): ChordSpec {
  const last = t.bars[t.bars.length - 1]
  return last[last.length - 1]
}
/** 模板是否以主功能和弦开头（I 系大和弦） */
function entryIsTonic(t: TemplateDef): boolean {
  const e = entrySpec(t)
  return e.degree === 1 && MAJORISH.has(e.quality)
}

/** 模板衔接规则：避免明显的逆功能连接 */
function canFollow(exit: ChordSpec, entry: ChordSpec): boolean {
  // V7 系结尾不直接接下属开头（V7 -> IV / bVII 逆行）
  if (exit.degree === 5 && isDominant(exit.quality)) {
    if ((entry.degree === 4 || entry.degree === 7) && MAJORISH.has(entry.quality)) return false
  }
  // ii 系结尾不直接回主和弦开头
  if (exit.degree === 2 && (exit.quality === 'min7' || exit.quality === 'min9')) {
    if (entry.degree === 1 && MAJORISH.has(entry.quality)) return false
  }
  return true
}

/** 三全音替代适用的风格 */
const TRITONE_STYLES = new Set<string>(['jazz', 'bebop', 'bossa'])

/**
 * 和声加料（原地修改，输入必须是克隆）：
 * - ii7 后接 V 系时 → II7（副属 V7/V）
 * - vi(m) 后接 ii/IV 时 → VI7（副属 V7/ii）
 * - V 系解决到 I 时 → bII7（三全音替代，爵士系）
 * - IV 后接 I 时 → ivm（小四度借用，流行/福音）
 * - V7 → V7sus4 挂留色彩（爵士系）
 * - maj7 → maj6 色彩变化
 */
function applySpice(bars: BarTemplate[], styleId: StyleId): void {
  const flat = bars.flat()
  flat.forEach((spec, i) => {
    const next = flat[i + 1]
    const nextIsTonic = !!next && next.degree === 1 && MAJORISH.has(next.quality)
    if (next) {
      if (spec.quality === 'min7' && spec.degree === 2 && next.degree === 5 && isDominant(next.quality)) {
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
      if (
        nextIsTonic &&
        spec.degree === 5 &&
        isDominant(spec.quality) &&
        TRITONE_STYLES.has(styleId) &&
        Math.random() < 0.15
      ) {
        spec.degree = 2
        spec.alter = -1
        spec.quality = 'dom7' // bII7 subV7
        return
      }
      if (
        nextIsTonic &&
        spec.degree === 4 &&
        spec.quality === 'maj' &&
        (styleId === 'popRock' || styleId === 'gospel') &&
        Math.random() < 0.08
      ) {
        spec.quality = 'min' // ivm 借用
        return
      }
    }
    if (
      spec.degree === 5 &&
      spec.quality === 'dom7' &&
      TRITONE_STYLES.has(styleId) &&
      Math.random() < 0.07
    ) {
      spec.quality = 'dom7sus4'
      return
    }
    if (spec.quality === 'maj7' && Math.random() < 0.12) spec.quality = 'maj6'
  })
}

/** 固定 form 风格（Blues / Jazz Blues）：按 8/12 小节 form 对齐填满请求的小节数 */
function formBars(styleId: 'blues' | 'jazzBlues', bars: number): BarTemplate[] {
  const mk12 = () =>
    styleId === 'blues' ? blues12(Math.random() < 0.5, Math.random() < 0.4) : jazzBlues12()
  const mk8 = () => (styleId === 'blues' ? blues8() : jazzBlues8())
  const forms: BarTemplate[][] = []
  let rem = bars
  while (rem >= 12) {
    forms.push(mk12())
    rem -= 12
  }
  if (rem >= 8) {
    forms.push(mk8())
    rem -= 8
  }
  if (rem > 0) forms.push(mk8())
  return forms.flat().slice(0, bars)
}

/**
 * 通用生成：按 4 小节乐句组织，句首在「主功能开头 / 色彩开头」间交替形成问答句；
 * 模板间按功能衔接规则过滤，同一模板最多出现 2 次，结尾落在随机终止式上。
 */
function genericBars(style: StyleDef, styleId: StyleId, bars: number): BarTemplate[] {
  const out: BarTemplate[] = []
  const tail = style.cadences[Math.floor(Math.random() * style.cadences.length)]
  const headTarget = Math.max(0, bars - tail.length)
  const usedCount = new Map<TemplateDef, number>()
  let lastTpl: TemplateDef | null = null
  let lastOpenedOnTonic = true

  while (out.length < headTarget) {
    const remaining = headTarget - out.length
    let pool = style.templates.filter(tp => tp.bars.length <= remaining)
    if (pool.length === 0) {
      out.push([{ degree: 1, quality: style.tonic }])
      continue
    }
    // 同一模板最多出现 2 次（池足够时）
    const fresh = pool.filter(tp => (usedCount.get(tp) ?? 0) < 2)
    if (fresh.length > 0) pool = fresh
    // 相邻不重复 + 功能衔接规则（无合规候选时放宽规则）
    if (lastTpl && pool.length > 1) {
      const prev = lastTpl
      const exit = exitSpec(prev)
      const noRepeat = pool.filter(tp => tp !== prev)
      const linked = noRepeat.filter(tp => canFollow(exit, entrySpec(tp)))
      if (linked.length > 0) pool = linked
      else if (noRepeat.length > 0) pool = noRepeat
    }
    // 乐句开头（每 4 小节）交替主功能/色彩开头
    if (out.length % 4 === 0 && pool.length > 1) {
      const preferTonic = !lastOpenedOnTonic
      const shaped = pool.filter(tp => entryIsTonic(tp) === preferTonic)
      if (shaped.length > 0) pool = shaped
    }
    const tpl = weightedPick(pool)
    lastTpl = tpl
    lastOpenedOnTonic = entryIsTonic(tpl)
    usedCount.set(tpl, (usedCount.get(tpl) ?? 0) + 1)
    out.push(...cloneBars(tpl.bars))
  }
  const tailTaken = Math.min(tail.length, bars - out.length)
  out.push(...cloneBars(tail.slice(tail.length - tailTaken)))
  applySpice(out, styleId)
  return out
}

export function generateProgression(styleId: keyof typeof STYLES, key: KeyDef, bars: number): Progression {
  const style = STYLES[styleId]
  const isForm = styleId === 'blues' || styleId === 'jazzBlues'
  const barTemplates = isForm ? formBars(styleId, bars) : genericBars(style, styleId, bars)
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
