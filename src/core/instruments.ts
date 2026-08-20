import * as Tone from 'tone'
import type { TrackId } from '../types'
import { midiToNote } from './theory'

type DrumKind = 'kick' | 'snare' | 'hihat' | 'ride' | 'rim'

/**
 * 合成音源：鼓组 / 贝斯 / 和声全部用 Tone.js 合成器实现，无外部采样。
 * 通过 InstrumentEngine 风格的窄接口被 player 使用，未来可换成 Sampler 采样实现。
 */
export class SynthEngine {
  private drumsBus = new Tone.Volume(0).toDestination()
  private bassBus = new Tone.Volume(0).toDestination()
  private compBus = new Tone.Volume(0).toDestination()
  private clickBus = new Tone.Volume(-6).toDestination()

  private kick = new Tone.MembraneSynth({
    pitchDecay: 0.045,
    octaves: 7,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.42, sustain: 0 },
  })
  private snare = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.16, sustain: 0 },
  })
  private snareTone = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.09, sustain: 0 },
  })
  private snareFilter = new Tone.Filter(1600, 'bandpass')
  private hihat = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.03, sustain: 0 },
  })
  private hihatFilter = new Tone.Filter(8200, 'highpass')
  private ride = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.002, decay: 0.5, sustain: 0 },
  })
  private rideFilter = new Tone.Filter(6000, 'bandpass')
  private rim = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.028, sustain: 0 },
  })
  private click = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.024, sustain: 0 },
  })

  private bass = new Tone.MonoSynth({
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

  private comp = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.004, decay: 0.25, sustain: 0.25, release: 0.6 },
    volume: -10,
  })

  constructor() {
    this.kick.connect(this.drumsBus)
    this.snare.connect(this.snareFilter)
    this.snareFilter.connect(this.drumsBus)
    this.snareTone.connect(this.drumsBus)
    this.hihat.connect(this.hihatFilter)
    this.hihatFilter.connect(this.drumsBus)
    this.ride.connect(this.rideFilter)
    this.rideFilter.connect(this.drumsBus)
    this.rim.connect(this.drumsBus)
    this.click.connect(this.clickBus)
    this.bass.connect(this.bassBus)
    this.comp.connect(this.compBus)
  }

  drum(kind: DrumKind, time: number, vel = 0.8): void {
    switch (kind) {
      case 'kick':
        this.kick.triggerAttackRelease('C1', 0.08, time, vel)
        break
      case 'snare':
        this.snare.triggerAttackRelease(0.14, time, vel)
        this.snareTone.triggerAttackRelease(190, 0.05, time, vel * 0.5)
        break
      case 'hihat':
        this.hihat.triggerAttackRelease(0.03, time, vel)
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

  compChord(midis: number[], time: number, dur: number, vel = 0.7): void {
    this.comp.triggerAttackRelease(midis.map(midiToNote), Math.max(dur, 0.06), time, vel)
  }

  clickTick(time: number, accent: boolean): void {
    this.click.triggerAttackRelease(accent ? 1860 : 1245, 0.03, time, accent ? 0.9 : 0.45)
  }

  setTrack(id: TrackId, on: boolean, db: number): void {
    const bus = { drums: this.drumsBus, bass: this.bassBus, comp: this.compBus }[id]
    bus.mute = !on
    bus.volume.rampTo(db, 0.05)
  }

  setMaster(db: number): void {
    Tone.getDestination().volume.rampTo(db, 0.05)
  }
}
