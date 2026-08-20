import { reactive, shallowRef, watch } from 'vue'
import type { Progression, StyleId, TrackId } from '../types'
import { STYLES } from '../core/styles'
import { generateProgression } from '../core/generator'
import { ChordPlayer } from '../core/player'
import { KEYS } from '../core/theory'

export const TRACK_IDS: TrackId[] = ['drums', 'bass', 'comp']
export const TRACK_NAMES: Record<TrackId, string> = {
  drums: '鼓组',
  bass: '贝斯',
  comp: '和声 Comping',
}
export const BAR_OPTIONS = [4, 8, 12, 16, 32]

export const state = reactive({
  keyPc: 0,
  styleId: 'jazz' as StyleId,
  bars: 8,
  bpm: STYLES.jazz.bpm.default,
  display: 'name' as 'name' | 'roman',
  tracks: {
    drums: { on: true, db: -6 },
    bass: { on: true, db: -8 },
    comp: { on: true, db: -10 },
  } as Record<TrackId, { on: boolean; db: number }>,
  metronome: false,
  countIn: true,
  masterDb: -6,
})

export const ui = reactive({
  playing: false,
  countInBeat: -1,
  slotIdx: -1,
})

export const progression = shallowRef<Progression | null>(null)

export const player = new ChordPlayer()
player.onSlot = i => {
  ui.slotIdx = i
}
player.onCountInBeat = b => {
  ui.countInBeat = b
}

function snapshot() {
  return { bpm: state.bpm, metronome: state.metronome, countIn: state.countIn }
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

// 初始生成一份
generate()
