<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import ChordSheet from './components/ChordSheet.vue'
import TransportBar from './components/TransportBar.vue'
import { togglePlay } from './composables/store'

function onKey(e: KeyboardEvent) {
  if (e.code !== 'Space') return
  const t = e.target as HTMLElement | null
  if (t && t.closest('input, select, textarea, button')) return
  e.preventDefault()
  void togglePlay()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="app">
    <header>
      <h1>和弦 Shuffle 练习室</h1>
      <p>随机和弦走向 × 风格化伴奏 · 即兴伴奏 / Solo 练习工具</p>
    </header>
    <div class="layout">
      <aside>
        <ControlPanel />
      </aside>
      <main>
        <TransportBar />
        <ChordSheet />
      </main>
    </div>
    <footer>和弦可点击试听 · 建议佩戴耳机 · Web Audio 合成，无需任何音频文件</footer>
  </div>
</template>

<style scoped>
.app {
  max-width: 1240px;
  margin: 0 auto;
  padding: 22px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
header h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(120deg, #9db8ff, #c39bff 55%, #7ce8d0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
header p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-dim);
}
.layout {
  display: grid;
  grid-template-columns: 310px 1fr;
  gap: 18px;
  align-items: start;
}
main {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}
footer {
  text-align: center;
  font-size: 12px;
  color: var(--text-faint);
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
