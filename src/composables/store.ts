import { reactive, shallowRef, watch } from 'vue'
import type { Progression, StyleId, TrackId } from '../types'
import type { FillLevel } from '../types'
import { STYLES } from '../core/styles'
import { generateProgression } from '../core/generator'
import { ChordPlayer } from '../core/player'
import { SamplerEngine, SynthEngine } from '../core/instruments'
import { KEYS } from '../core/theory'

export const TRACK_IDS: TrackId[] = ['drums', 'bass', 'comp', 'guitar']
export const TRACK_NAMES: Record<TrackId, string> = {
  drums: '鼓组',
  bass: '贝斯',
  comp: '和声 Comping',
  guitar: '电吉他',
}
export const BAR_OPTIONS = [4, 8, 12, 16, 32]

export const state = reactive({
  keyPc: 0,
  styleId: 'jazz' as StyleId,
  bars: 8,
  bpm: STYLES.jazz.bpm.default,
  display: 'name' as 'name' | 'roman',
  engine: 'synth' as 'synth' | 'sampler',
  tracks: {
    drums: { on: true, db: -6 },
    bass: { on: true, db: -8 },
    comp: { on: true, db: -10 },
    guitar: { on: true, db: -8 },
  } as Record<TrackId, { on: boolean; db: number }>,
  metronome: false,
  countIn: true,
  masterDb: -6,
  fillLevel: 'medium' as FillLevel,
})

export const ui = reactive({
  playing: false,
  countInBeat: -1,
  slotIdx: -1,
  samplerLoading: false,
})

export const progression = shallowRef<Progression | null>(null)

export const player = new ChordPlayer()
player.onSlot = i => {
  ui.slotIdx = i
}
player.onCountInBeat = b => {
  ui.countInBeat = b
}

const synthEngine = new SynthEngine()
let samplerEngine: SamplerEngine | null = null
let samplerReady = false

function snapshot() {
  return {
    bpm: state.bpm,
    metronome: state.metronome,
    countIn: state.countIn,
    fillLevel: state.fillLevel,
  }
}

function applyAudioSettings(): void {
  player.setMaster(state.masterDb)
  for (const id of TRACK_IDS) player.setTrack(id, state.tracks[id].on, state.tracks[id].db)
}

export function generate(): void {
  const key = KEYS.find(k => k.pc === state.keyPc) ?? KEYS[0]
  progression.value = generateProgression(state.styleId, key, state.bars)
  if (ui.playing) void player.start(progression.value, snapshot())
}

export async function togglePlay(): Promise<void> {
  if (ui.playing) {
    player.stop()
    ui.playing = false
  } else {
    if (!progression.value) generate()
    await player.start(progression.value!, snapshot())
    ui.playing = true
  }
}

watch(() => state.bpm, v => player.setBpm(v))
watch(() => state.metronome, v => player.setMetronome(v))
watch(() => state.masterDb, v => player.setMaster(v))
for (const id of TRACK_IDS) {
  watch(
    () => state.tracks[id],
    t => player.setTrack(id, t.on, t.db),
    { deep: true },
  )
}
watch(() => state.styleId, id => {
  state.bpm = STYLES[id].bpm.default
  generate()
})
watch(() => [state.keyPc, state.bars], () => generate())
// 播放中切换加花挡位：重新调度使其立即生效
watch(
  () => state.fillLevel,
  () => {
    player.fillLevel = state.fillLevel
    if (ui.playing && progression.value) void player.start(progression.value, snapshot())
  },
)
watch(
  () => state.engine,
  mode => {
    if (mode === 'sampler') {
      if (!samplerEngine) {
        ui.samplerLoading = true
        samplerEngine = new SamplerEngine(() => {
          samplerReady = true
          ui.samplerLoading = false
        })
      }
      player.setEngine(samplerEngine)
    } else {
      player.setEngine(synthEngine)
    }
    applyAudioSettings()
    // 换引擎后重新调度（若正在播放已在 setEngine 中停止）
    if (ui.playing) ui.playing = false
  },
)

// 初始：生成一份走向，并把音量/开关设置应用到引擎
applyAudioSettings()
generate()
