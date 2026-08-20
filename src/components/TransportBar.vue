<script setup lang="ts">
import { computed } from 'vue'
import { progression, state, togglePlay, ui } from '../composables/store'
import { STYLES } from '../core/styles'

const currentBar = computed(() => {
  if (!progression.value || ui.slotIdx < 0) return -1
  return progression.value.bars.find(b => b.slotIds.includes(ui.slotIdx))?.index ?? -1
})
const totalBars = computed(() => progression.value?.bars.length ?? 0)
const styleName = computed(() => STYLES[state.styleId].name)
</script>

<template>
  <div class="transport">
    <button class="play" :class="{ playing: ui.playing }" @click="togglePlay">
      {{ ui.playing ? '■ 停止' : '▶ 播放' }}
    </button>
    <div class="status">
      <template v-if="ui.countInBeat >= 0">预备拍 {{ ui.countInBeat + 1 }} · 即将开始</template>
      <template v-else-if="ui.playing && currentBar >= 0">
        第 {{ currentBar + 1 }} / {{ totalBars }} 小节 · 循环中
      </template>
      <template v-else-if="ui.playing">播放中…</template>
      <template v-else>已停止</template>
    </div>
    <div class="meta">
      <span class="bpm">{{ state.bpm }} BPM</span>
      <span class="sep">·</span>
      <span>{{ styleName }}</span>
      <span class="sep">·</span>
      <span>{{ state.display === 'name' ? '和弦名' : '级数' }}</span>
    </div>
    <span class="kbd-hint">空格 播放 / 停止</span>
  </div>
</template>

<style scoped>
.transport {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 16px;
  flex-wrap: wrap;
}
.play {
  border: none;
  border-radius: 999px;
  padding: 12px 26px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #29d3a2, #1fa8d8);
  cursor: pointer;
  transition: filter 0.15s, transform 0.1s;
  min-width: 108px;
}
.play:hover {
  filter: brightness(1.1);
}
.play:active {
  transform: scale(0.97);
}
.play.playing {
  background: linear-gradient(135deg, #ff7a7a, #e8536f);
}
.status {
  font-size: 15px;
  color: var(--text);
  font-weight: 600;
  min-width: 180px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-dim);
}
.meta .bpm {
  color: var(--accent);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.sep {
  color: var(--text-faint);
}
.kbd-hint {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-faint);
}
</style>
