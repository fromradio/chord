<script setup lang="ts">
import { progression, state, ui, player } from '../composables/store'
import type { ChordSlot } from '../types'

function mainLabel(s: ChordSlot): string {
  return state.display === 'name' ? s.name : s.roman
}
function subLabel(s: ChordSlot): string {
  return state.display === 'name' ? s.roman : s.name
}
function isBarCurrent(slotIds: number[]): boolean {
  return ui.slotIdx >= 0 && slotIds.includes(ui.slotIdx)
}
</script>

<template>
  <div class="sheet-wrap">
    <div v-if="progression" class="grid">
      <div
        v-for="bar in progression.bars"
        :key="bar.index"
        class="bar"
        :class="{ current: isBarCurrent(bar.slotIds) }"
      >
        <span class="num">{{ bar.index + 1 }}</span>
        <div class="chords" :data-split="bar.slotIds.length > 1">
          <span
            v-for="id in bar.slotIds"
            :key="id"
            class="chord"
            :class="{ current: ui.slotIdx === id }"
            :title="'点击试听 ' + progression.slots[id].name"
            @click="player.previewChord(progression.slots[id])"
          >
            <span class="main">{{ mainLabel(progression.slots[id]) }}</span>
            <span class="sub">{{ subLabel(progression.slots[id]) }}</span>
          </span>
        </div>
      </div>
    </div>
    <div v-else class="empty">点击「随机生成」开始</div>

    <Transition name="fade">
      <div v-if="ui.countInBeat >= 0" class="countin" :key="ui.countInBeat">
        {{ ui.countInBeat + 1 }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.sheet-wrap {
  position: relative;
  min-height: 220px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 10px;
}
.bar {
  position: relative;
  background: var(--card-deep);
  border: 1px solid var(--border);
  border-radius: 10px;
  min-height: 86px;
  padding: 18px 8px 8px;
  transition: border-color 0.12s, box-shadow 0.12s, background 0.12s;
}
.bar.current {
  border-color: var(--accent);
  background: #1a2233;
}
.num {
  position: absolute;
  top: 5px;
  left: 9px;
  font-size: 11px;
  color: var(--text-faint);
  font-variant-numeric: tabular-nums;
}
.chords {
  display: flex;
  height: 100%;
}
.chords[data-split='true'] .chord + .chord {
  border-left: 1px dashed var(--border);
}
.chord {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  border-radius: 8px;
  min-width: 0;
}
.chord:hover {
  background: rgba(122, 162, 255, 0.08);
}
.chord.current {
  background: rgba(122, 162, 255, 0.16);
  box-shadow: inset 0 0 0 1px var(--accent);
}
.main {
  font-size: clamp(17px, 2.2vw, 24px);
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}
.chord.current .main {
  color: var(--accent-light);
}
.sub {
  font-size: 12px;
  color: var(--text-faint);
  white-space: nowrap;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  color: var(--text-faint);
}
.countin {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 110px;
  font-weight: 800;
  color: var(--accent-light);
  background: rgba(10, 12, 18, 0.72);
  border-radius: 14px;
  pointer-events: none;
  animation: pulse 0.4s ease-out;
}
@keyframes pulse {
  from {
    transform: scale(1.35);
    opacity: 0.4;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
