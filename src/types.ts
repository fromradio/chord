export type StyleId = 'jazz' | 'popRock' | 'blues' | 'bossa'
export type TrackId = 'drums' | 'bass' | 'comp' | 'guitar'

export type ChordQuality =
  | 'maj' | 'min' | 'dim' | 'aug'
  | 'maj6' | 'min6'
  | 'maj7' | 'min7' | 'dom7' | 'm7b5' | 'dim7'
  | 'maj9' | 'min9' | 'dom9'
  | 'sus4' | 'dom7sus4'

/** 调定义：pitch class + 拼写偏好 */
export interface KeyDef {
  pc: number
  name: string
  flats: boolean
}

/** 级数表示的和弦：degree 为大调音阶级数 1-7，alter 为半音偏移（如 bVII） */
export interface ChordSpec {
  degree: number
  alter?: number
  quality: ChordQuality
}

/** 一个小节模板：1 个和弦（整小节）或 2 个和弦（各半小节） */
export type BarTemplate = ChordSpec[]

/** 生成后的和弦槽：已在全曲中定位并完成移调与 voicing */
export interface ChordSlot {
  id: number
  name: string
  roman: string
  quality: ChordQuality
  rootPc: number
  startBeat: number
  lenBeats: number
  /** comping 用 voicing（MIDI 音符，含低音根音） */
  midi: number[]
  /** 电吉他强力和声（MIDI 音符） */
  powerMidi: number[]
  /** 贝斯根音（MIDI） */
  bassMidi: number
}

export interface Bar {
  index: number
  slotIds: number[]
}

export interface Progression {
  key: KeyDef
  styleId: StyleId
  bars: Bar[]
  slots: ChordSlot[]
}

export type BassTarget =
  | 'root' | 'third' | 'fifth' | 'sixth' | 'b7' | 'octave' | 'approach'

export interface RhythmHit {
  /** 槽内拍位（0 起，4/4 一小节 4 拍） */
  pos: number
  /** 时值（拍） */
  dur: number
}

export interface BassHit extends RhythmHit {
  note: BassTarget
}

export type DrumKind = 'kick' | 'snare' | 'snareGhost' | 'hihat' | 'openHat' | 'ride' | 'rim'

export interface DrumPattern {
  kick?: number[]
  snare?: number[]
  /** 弱音小军鼓（ghost note） */
  snareGhost?: number[]
  hihat?: number[]
  openHat?: number[]
  ride?: number[]
  rim?: number[]
}

export interface RhythmPattern {
  hits: RhythmHit[]
}
export interface BassPattern {
  hits: BassHit[]
}

/** 带权重的节奏型，运行时随机抽取实现「每次生成都不一样」 */
export interface Weighted<T> {
  weight: number
  pattern: T
}

export interface TemplateDef {
  weight: number
  bars: BarTemplate[]
}

export interface StyleDef {
  id: StyleId
  name: string
  bpm: { min: number; max: number; default: number }
  swing: number
  swingSubdivision: '8n' | '16n'
  /** 落在主和弦上的填充和弦质量 */
  tonic: ChordQuality
  templates: TemplateDef[]
  cadences: BarTemplate[][]
  /** 鼓组主节奏型（逐小节随机抽取） */
  drums: Weighted<DrumPattern>[]
  /** 乐句末（每 4 小节）随机使用的鼓填充 */
  drumFills?: Weighted<DrumPattern>[]
  comp: Weighted<RhythmPattern>[]
  compHalf: RhythmPattern
  bass: Weighted<BassPattern>[]
  bassHalf: BassPattern
  /** 电吉他节奏型（目前用于 Pop/Rock） */
  guitar?: {
    comp: Weighted<RhythmPattern>[]
    half: RhythmPattern
  }
}
