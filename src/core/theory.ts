import type { ChordQuality, ChordSlot, ChordSpec, KeyDef } from '../types'

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11]

export const KEYS: KeyDef[] = [
  { pc: 0, name: 'C', flats: false },
  { pc: 1, name: 'Db', flats: true },
  { pc: 2, name: 'D', flats: false },
  { pc: 3, name: 'Eb', flats: true },
  { pc: 4, name: 'E', flats: false },
  { pc: 5, name: 'F', flats: true },
  { pc: 6, name: 'Gb', flats: true },
  { pc: 7, name: 'G', flats: false },
  { pc: 8, name: 'Ab', flats: true },
  { pc: 9, name: 'A', flats: false },
  { pc: 10, name: 'Bb', flats: true },
  { pc: 11, name: 'B', flats: false },
]

export function mod12(n: number): number {
  return ((n % 12) + 12) % 12
}

const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

export function pcToName(pc: number, flats: boolean): string {
  return (flats ? FLAT_NAMES : SHARP_NAMES)[mod12(pc)]
}

/** 该大调音阶的规范拼写，如 Eb 调 -> [Eb, F, G, Ab, Bb, C, D] */
export function scaleSpelling(key: KeyDef): string[] {
  const startLetter = LETTERS.indexOf(key.name[0] as (typeof LETTERS)[number])
  return MAJOR_STEPS.map((step, i) => {
    const letter = LETTERS[(startLetter + i) % 7]
    let acc = mod12(key.pc + step) - LETTER_PC[letter]
    if (acc > 6) acc -= 12
    if (acc < -6) acc += 12
    return letter + (acc === 0 ? '' : acc > 0 ? '#'.repeat(acc) : 'b'.repeat(-acc))
  })
}

export const QUALITY_INTERVALS: Record<ChordQuality, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  maj6: [0, 4, 7, 9],
  min6: [0, 3, 7, 9],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  m7b5: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9],
  maj9: [0, 4, 7, 11, 14],
  min9: [0, 3, 7, 10, 14],
  dom9: [0, 4, 7, 10, 14],
  sus4: [0, 5, 7],
  dom7sus4: [0, 5, 7, 10],
}

const QUALITY_SUFFIX: Record<ChordQuality, string> = {
  maj: '',
  min: 'm',
  dim: 'dim',
  aug: 'aug',
  maj6: '6',
  min6: 'm6',
  maj7: 'maj7',
  min7: 'm7',
  dom7: '7',
  m7b5: 'm7b5',
  dim7: 'dim7',
  maj9: 'maj9',
  min9: 'm9',
  dom9: '9',
  sus4: 'sus4',
  dom7sus4: '7sus4',
}

const ROMAN_SUFFIX: Record<ChordQuality, string> = {
  maj: '',
  min: '',
  dim: '°',
  aug: '+',
  maj6: '6',
  min6: '6',
  maj7: 'maj7',
  min7: '7',
  dom7: '7',
  m7b5: 'ø7',
  dim7: '°7',
  maj9: 'maj9',
  min9: '9',
  dom9: '9',
  sus4: 'sus4',
  dom7sus4: '7sus4',
}

const MINORISH = new Set<ChordQuality>(['min', 'min6', 'min7', 'min9', 'm7b5', 'dim', 'dim7'])
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

export function midiToNote(m: number): string {
  return SHARP_NAMES[mod12(m)] + (Math.floor(m / 12) - 1)
}

/** ChordSpec 构造简写 */
export function ch(degree: number, quality: ChordQuality, alter?: number): ChordSpec {
  return { degree, quality, alter }
}

export function buildSlot(
  key: KeyDef,
  spec: ChordSpec,
  startBeat: number,
  lenBeats: number,
  scale: string[],
  id: number,
): ChordSlot {
  const rootPc = mod12(key.pc + MAJOR_STEPS[spec.degree - 1] + (spec.alter ?? 0))
  // 变化级数（如 bVII）按降号拼写，保持与常见记谱一致
  const rootName = spec.alter ? pcToName(rootPc, true) : scale[spec.degree - 1]
  const q = spec.quality
  const name = rootName + QUALITY_SUFFIX[q]
  const numeralBase = NUMERALS[spec.degree - 1]
  const numeral = MINORISH.has(q) ? numeralBase.toLowerCase() : numeralBase
  const roman =
    (spec.alter === -1 ? 'b' : spec.alter === 1 ? '#' : '') + numeral + ROMAN_SUFFIX[q]

  const ivs = QUALITY_INTERVALS[q]
  let upper = ivs.filter(iv => iv > 0)
  // 和弦音过多时优先省略纯五音，保留色彩音（3/7/9/6）
  if (upper.length > 3) upper = upper.filter(iv => mod12(iv) !== 7)
  const midi = [48 + rootPc, ...upper.slice(0, 3).map(iv => 60 + mod12(rootPc + iv))]

  return {
    id,
    name,
    roman,
    quality: q,
    rootPc,
    startBeat,
    lenBeats,
    midi,
    bassMidi: 36 + rootPc,
  }
}
