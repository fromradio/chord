import * as Tone from 'tone'
import type { ChordSlot, Progression, TrackId } from '../types'
import type { BassTarget, DrumKind } from '../types'
import type { InstrumentEngine } from './instruments'
import { SynthEngine } from './instruments'
import { STYLES } from './styles'
import { weightedPick } from './generator'
import { QUALITY_INTERVALS } from './theory'

export interface PlayerSettings {
  bpm: number
  metronome: boolean
  countIn: boolean
}

/** 小节内拍位 -> Bars:Beats:Sixteenths */
function bbs(bar: number, pos: number): string {
  const q = Math.floor(pos)
  const six = Math.round((pos - q) * 4)
  return `${bar}:${q}:${six}`
}

function bassTargetMidi(slot: ChordSlot, target: BassTarget, next: ChordSlot): number {
  switch (target) {
    case 'root':
      return slot.bassMidi
    case 'fifth':
      return slot.bassMidi + 7
    case 'sixth':
      return slot.bassMidi + 9
    case 'b7':
      return slot.bassMidi + 10
    case 'octave':
      return slot.bassMidi + 12
    case 'third':
      return slot.bassMidi + QUALITY_INTERVALS[slot.quality][1] // 3=b3, 4=3, 5=sus4
    case 'approach': {
      const below = next.bassMidi - 1
      const above = next.bassMidi + 1
      return Math.abs(below - slot.bassMidi) <= Math.abs(above - slot.bassMidi) ? below : above
    }
  }
}

/** 力度人性化抖动 */
function jitter(amount = 0.06): number {
  return (Math.random() - 0.5) * 2 * amount
}

export class ChordPlayer {
  private engine: InstrumentEngine = new SynthEngine()
  private transport = Tone.getTransport()
  playing = false
  metronome = false
  onSlot?: (i: number) => void
  onCountInBeat?: (b: number) => void

  /** 切换音源引擎（合成 <-> 采样），播放中会先停止 */
  setEngine(engine: InstrumentEngine): void {
    if (this.playing) this.stop()
    this.engine = engine
  }

  async start(prog: Progression, s: PlayerSettings): Promise<void> {
    await Tone.start()
    this.stop()
    this.metronome = s.metronome
    this.playing = true

    const t = this.transport
    const style = STYLES[prog.styleId]
    t.bpm.value = s.bpm
    t.swing = style.swing
    t.swingSubdivision = style.swingSubdivision
    t.timeSignature = [4, 4]

    const spb = 60 / s.bpm // 拍长（秒），用于把拍换算成音长
    const offset = s.countIn ? 1 : 0 // count-in 占用第 0 小节

    if (s.countIn) this.scheduleCountIn()
    this.scheduleMetronome(offset, prog.bars.length)
    this.scheduleDrums(prog, offset)
    this.scheduleSlots(prog, offset, spb)

    // count-in 小节只播一次，之后在小节 1..N 间循环
    t.loopStart = offset === 1 ? '1m' : 0
    t.loopEnd = `${offset + prog.bars.length}m`
    t.loop = true
    t.start()
  }

  stop(): void {
    this.playing = false
    const t = this.transport
    t.stop()
    t.cancel(0)
    t.position = 0
    this.onSlot?.(-1)
    this.onCountInBeat?.(-1)
  }

  setBpm(v: number): void {
    this.transport.bpm.rampTo(v, 0.08)
  }

  setMetronome(on: boolean): void {
    this.metronome = on
  }

  setTrack(id: TrackId, on: boolean, db: number): void {
    this.engine.setTrack(id, on, db)
  }

  setMaster(db: number): void {
    this.engine.setMaster(db)
  }

  /** 点击谱面上的和弦试听 */
  async previewChord(slot: ChordSlot): Promise<void> {
    await Tone.start()
    const now = Tone.now()
    this.engine.compChord(slot.midi, now, 0.8, 0.7)
    this.engine.bassNote(slot.bassMidi, now, 0.8, 0.7)
  }

  private scheduleCountIn(): void {
    const t = this.transport
    for (let q = 0; q < 4; q++) {
      t.schedule(time => {
        this.engine.clickTick(time, q === 0)
        Tone.Draw.schedule(() => this.onCountInBeat?.(q), time)
      }, `0:${q}:0`)
    }
    t.schedule(time => Tone.Draw.schedule(() => this.onCountInBeat?.(-1), time), '1:0:0')
  }

  private scheduleMetronome(offset: number, bars: number): void {
    const t = this.transport
    for (let b = 0; b < bars * 4; b++) {
      const bar = offset + Math.floor(b / 4)
      const q = b % 4
      t.schedule(time => {
        if (this.metronome) this.engine.clickTick(time, q === 0)
      }, `${bar}:${q}:0`)
    }
  }

  private scheduleDrums(prog: Progression, offset: number): void {
    const t = this.transport
    const style = STYLES[prog.styleId]
    prog.bars.forEach((_, i) => {
      const bar = offset + i
      // 每 4 小节乐句末随机使用鼓填充
      const phraseEnd = (i + 1) % 4 === 0 && prog.bars.length >= 8
      const useFill = !!style.drumFills?.length && phraseEnd && Math.random() < 0.65
      const d = weightedPick(useFill ? style.drumFills! : style.drums).pattern

      const add = (pos: number, cb: (time: number) => void) => t.schedule(cb, bbs(bar, pos))
      d.kick?.forEach(pos => add(pos, time => this.engine.drum('kick', time, 0.95 + jitter())))
      d.snare?.forEach(pos => add(pos, time => this.engine.drum('snare', time, 0.8 + jitter())))
      d.snareGhost?.forEach(pos => add(pos, time => this.engine.drum('snareGhost', time, 0.18 + jitter(0.04))))
      d.hihat?.forEach(pos =>
        add(pos, time =>
          this.engine.drum('hihat', time, (pos % 1 === 0 ? 0.42 : 0.28) + jitter(0.05)),
        ),
      )
      d.openHat?.forEach(pos => add(pos, time => this.engine.drum('openHat', time, 0.45 + jitter())))
      d.ride?.forEach(pos =>
        add(pos, time =>
          this.engine.drum('ride', time, (pos % 1 === 0 ? 0.36 : 0.24) + jitter(0.05)),
        ),
      )
      d.rim?.forEach(pos => add(pos, time => this.engine.drum('rim', time, 0.55 + jitter(0.04))))
    })
  }

  private scheduleSlots(prog: Progression, offset: number, spb: number): void {
    const t = this.transport
    const style = STYLES[prog.styleId]
    prog.slots.forEach((slot, i) => {
      const absBar = offset + Math.floor(slot.startBeat / 4)
      const posInBar = slot.startBeat % 4
      const isFull = slot.lenBeats >= 4

      // 当前和弦高亮（Draw 保证与音频对齐且不阻塞音频线程）
      t.schedule(time => Tone.Draw.schedule(() => this.onSlot?.(i), time), bbs(absBar, posInBar))

      // 和声 comping：逐槽随机节奏型
      const compPat = isFull ? weightedPick(style.comp).pattern : style.compHalf
      compPat.hits.forEach(h => {
        t.schedule(time => {
          const vel = (h.pos % 1 === 0 ? 0.85 : 0.6) + jitter(0.05)
          this.engine.compChord(slot.midi, time, h.dur * spb, vel)
        }, bbs(absBar, posInBar + h.pos))
      })

      // 电吉他：强力和声节奏型
      if (style.guitar) {
        const gPat = isFull ? weightedPick(style.guitar.comp).pattern : style.guitar.half
        gPat.hits.forEach(h => {
          t.schedule(time => {
            const vel = (h.pos % 1 === 0 ? 0.8 : 0.55) + jitter(0.05)
            this.engine.guitarChord(slot.powerMidi, time, h.dur * spb, vel)
          }, bbs(absBar, posInBar + h.pos))
        })
      }

      // 贝斯：逐槽随机节奏型
      const bassPat = isFull ? weightedPick(style.bass).pattern : style.bassHalf
      const next = prog.slots[(i + 1) % prog.slots.length]
      bassPat.hits.forEach(h => {
        const midi = bassTargetMidi(slot, h.note, next)
        t.schedule(
          time => this.engine.bassNote(midi, time, h.dur * spb * 0.92, 0.85 + jitter(0.04)),
          bbs(absBar, posInBar + h.pos),
        )
      })
    })
  }
}
