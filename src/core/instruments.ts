import * as Tone from 'tone'
import type { CompVoice, DrumKind, TrackId } from '../types'
import { midiToNote } from './theory'

/** 引擎统一接口：合成 / 采样实现可互换 */
export interface InstrumentEngine {
  drum(kind: DrumKind, time: number, vel?: number): void
  bassNote(midi: number, time: number, dur: number, vel?: number): void
  compChord(midis: number[], time: number, dur: number, vel?: number, voice?: CompVoice): void
  guitarChord(midis: number[], time: number, dur: number, vel?: number): void
  clickTick(time: number, accent: boolean): void
  setTrack(id: TrackId, on: boolean, db: number): void
  setMaster(db: number): void
  dispose(): void
}

/**
 * 合成音源：鼓组 / 贝斯 / 和声 / 电吉他全部用 Tone.js 合成器实现，无外部采样。
 */
export class SynthEngine implements InstrumentEngine {
  // 总限幅器：多轨叠加超 0dB 时软限幅，避免硬削波的「滋滋」杂音
  protected limiter = new Tone.Limiter(-1).toDestination()
  protected drumsBus = new Tone.Volume(0).connect(this.limiter)
  protected bassBus = new Tone.Volume(0).connect(this.limiter)
  protected compBus = new Tone.Volume(0).connect(this.limiter)
  protected guitarBus = new Tone.Volume(0).connect(this.limiter)
  protected clickBus = new Tone.Volume(-6).connect(this.limiter)

  protected kick = new Tone.MembraneSynth({
    pitchDecay: 0.045,
    octaves: 7,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.42, sustain: 0 },
  })
  protected snare = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.16, sustain: 0 },
  })
  protected snareTone = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.09, sustain: 0 },
  })
  protected snareFilter = new Tone.Filter(1600, 'bandpass')
  protected hihat = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.03, sustain: 0 },
  })
  protected hihatFilter = new Tone.Filter(8200, 'highpass')
  protected openHat = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0 },
  })
  protected ride = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.002, decay: 0.4, sustain: 0 },
  })
  protected rideFilter = new Tone.Filter(6000, 'bandpass')
  protected rim = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.028, sustain: 0 },
  })
  protected click = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.024, sustain: 0 },
  })

  protected bass = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    filter: { Q: 1, type: 'lowpass', rolloff: -12 },
    filterEnvelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.6,
      release: 0.2,
      baseFrequency: 90,
      octaves: 2.5,
    },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.9, release: 0.3 },
    volume: -4,
  })

  protected comp = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.004, decay: 0.25, sustain: 0.25, release: 0.6 },
    volume: -10,
  })

  // 风琴：加法合成drawbar音色（Gospel / Afro 的 comp 音色）
  protected organ = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'custom', partials: [1, 0.55, 0.35, 0.22, 0.14, 0.09, 0.06, 0.04] },
    envelope: { attack: 0.015, decay: 0.2, sustain: 0.8, release: 0.2 },
    volume: -18,
  })

  // 电吉他：锯波 -> 预滤波 -> 失真（4x 过采样抑制混叠毛刺）-> 低通，走强力和声
  protected guitar = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.002, decay: 0.08, sustain: 0.35, release: 0.06 },
    volume: -14,
  })
  protected guitarPre = new Tone.Filter(3800, 'lowpass')
  protected guitarDist = new Tone.Distortion({ distortion: 0.35, oversample: '4x' })
  protected guitarFilter = new Tone.Filter(2800, 'lowpass')

  constructor() {
    this.guitarDist.wet.value = 0.7
    this.kick.connect(this.drumsBus)
    this.snare.connect(this.snareFilter)
    this.snareFilter.connect(this.drumsBus)
    this.snareTone.connect(this.drumsBus)
    this.hihat.connect(this.hihatFilter)
    this.hihatFilter.connect(this.drumsBus)
    this.openHat.connect(this.hihatFilter)
    this.ride.connect(this.rideFilter)
    this.rideFilter.connect(this.drumsBus)
    this.rim.connect(this.drumsBus)
    this.click.connect(this.clickBus)
    this.bass.connect(this.bassBus)
    this.comp.connect(this.compBus)
    this.organ.connect(this.compBus)
    this.guitar.chain(this.guitarPre, this.guitarDist, this.guitarFilter, this.guitarBus)
  }

  drum(kind: DrumKind, time: number, vel = 0.8): void {
    switch (kind) {
      case 'kick':
        this.kick.triggerAttackRelease('C1', 0.08, time, vel)
        break
      case 'snare':
      case 'snareGhost':
        this.snare.triggerAttackRelease(0.14, time, vel)
        this.snareTone.triggerAttackRelease(190, 0.05, time, vel * 0.5)
        break
      case 'hihat':
        this.hihat.triggerAttackRelease(0.03, time, vel)
        break
      case 'openHat':
        this.openHat.triggerAttackRelease(0.16, time, vel)
        break
      case 'ride':
        this.ride.triggerAttackRelease(0.4, time, vel)
        break
      case 'rim':
        this.rim.triggerAttackRelease('Eb6', 0.03, time, vel)
        break
    }
  }

  bassNote(midi: number, time: number, dur: number, vel = 0.85): void {
    this.bass.triggerAttackRelease(midiToNote(midi), Math.max(dur, 0.05), time, vel)
  }

  compChord(midis: number[], time: number, dur: number, vel = 0.7, voice: CompVoice = 'piano'): void {
    const notes = midis.map(midiToNote)
    if (voice === 'organ') {
      this.organ.triggerAttackRelease(notes, Math.max(dur, 0.12), time, vel)
    } else {
      this.comp.triggerAttackRelease(notes, Math.max(dur, 0.06), time, vel)
    }
  }

  guitarChord(midis: number[], time: number, dur: number, vel = 0.7): void {
    this.guitar.triggerAttackRelease(midis.map(midiToNote), Math.max(dur, 0.04), time, vel)
  }

  clickTick(time: number, accent: boolean): void {
    this.click.triggerAttackRelease(accent ? 1860 : 1245, 0.03, time, accent ? 0.9 : 0.45)
  }

  setTrack(id: TrackId, on: boolean, db: number): void {
    const bus = {
      drums: this.drumsBus,
      bass: this.bassBus,
      comp: this.compBus,
      guitar: this.guitarBus,
    }[id]
    bus.mute = !on
    bus.volume.rampTo(db, 0.05)
  }

  setMaster(db: number): void {
    Tone.getDestination().volume.rampTo(db, 0.05)
  }

  dispose(): void {
    const nodes = [
      this.kick, this.snare, this.snareTone, this.snareFilter, this.hihat, this.hihatFilter,
      this.openHat, this.ride, this.rideFilter, this.rim, this.click, this.bass, this.comp,
      this.organ, this.guitar, this.guitarPre, this.guitarDist, this.guitarFilter,
      this.drumsBus, this.bassBus, this.compBus, this.guitarBus, this.clickBus, this.limiter,
    ]
    nodes.forEach(n => n.dispose())
  }
}

// Salamander 三角钢琴采样与 Techno 鼓组采样（Tone.js 官方示例音源，jsDelivr CDN）
const PIANO_BASE = 'https://cdn.jsdelivr.net/gh/Tonejs/audio@master/salamander/'
const DRUMS_BASE = 'https://cdn.jsdelivr.net/gh/Tonejs/audio@master/drum-samples/Techno/'

/**
 * 采样音源：钢琴与底鼓/军鼓/踩镲使用采样，ride/rim/贝斯/吉他沿用合成。
 * 覆写 SynthEngine，未加载完成前自动回退到合成音色。
 */
export class SamplerEngine extends SynthEngine {
  private piano = new Tone.Sampler({
    urls: {
      C3: 'C3.mp3',
      'D#3': 'Ds3.mp3',
      'F#3': 'Fs3.mp3',
      A3: 'A3.mp3',
      C4: 'C4.mp3',
      'D#4': 'Ds4.mp3',
      'F#4': 'Fs4.mp3',
      A4: 'A4.mp3',
      C5: 'C5.mp3',
    },
    baseUrl: PIANO_BASE,
    release: 1,
    onload: () => this.markLoaded(),
  })
  private drumSamples = new Tone.Players({
    urls: { kick: 'kick.mp3', snare: 'snare.mp3', hihat: 'hihat.mp3' },
    baseUrl: DRUMS_BASE,
    onload: () => this.markLoaded(),
  })
  private loadedCount = 0
  private onReady?: () => void

  constructor(onReady?: () => void) {
    super()
    this.onReady = onReady
    this.piano.connect(this.compBus)
    this.drumSamples.connect(this.drumsBus)
    // 已在缓存中加载完成的情况（理论上新实例不会发生，兜底）
    if (this.piano.loaded) this.markLoaded()
    if (this.drumSamples.loaded) this.markLoaded()
  }

  private markLoaded(): void {
    if (++this.loadedCount >= 2) this.onReady?.()
  }

  override drum(kind: DrumKind, time: number, vel = 0.8): void {
    if (this.drumSamples.loaded && (kind === 'kick' || kind === 'snare' || kind === 'hihat')) {
      const p = this.drumSamples.player(kind)
      p.volume.value = Tone.gainToDb(vel)
      p.start(time)
      return
    }
    super.drum(kind, time, vel)
  }

  override compChord(midis: number[], time: number, dur: number, vel = 0.7, voice: CompVoice = 'piano'): void {
    if (voice === 'piano' && this.piano.loaded) {
      this.piano.triggerAttackRelease(midis.map(midiToNote), Math.max(dur, 0.1), time, vel)
      return
    }
    super.compChord(midis, time, dur, vel, voice)
  }

  override dispose(): void {
    this.piano.dispose()
    this.drumSamples.dispose()
    super.dispose()
  }
}
