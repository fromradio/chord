<script setup lang="ts">
import { computed } from 'vue'
import { BAR_OPTIONS, TRACK_IDS, TRACK_NAMES, generate, state, ui } from '../composables/store'
import { KEYS } from '../core/theory'
import { STYLE_LIST, STYLES } from '../core/styles'

const styleDef = computed(() => STYLES[state.styleId])
function hasTrack(id: string): boolean {
  return id !== 'guitar' || !!styleDef.value.guitar
}
</script>

<template>
  <div class="panel">
    <section>
      <h3>基本设置</h3>
      <label class="field">
        <span>主调</span>
        <select v-model.number="state.keyPc">
          <option v-for="k in KEYS" :key="k.pc" :value="k.pc">{{ k.name }} 大调</option>
        </select>
      </label>
      <label class="field">
        <span>风格</span>
        <select v-model="state.styleId">
          <option v-for="s in STYLE_LIST" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </label>
      <label class="field">
        <span>小节数</span>
        <select v-model.number="state.bars">
          <option v-for="b in BAR_OPTIONS" :key="b" :value="b">{{ b }} 小节</option>
        </select>
      </label>
      <p v-if="state.styleId === 'blues' || state.styleId === 'jazzBlues'" class="hint">
        布鲁斯 / 爵士布鲁斯按 8 / 12 小节 form 对齐，实际小节数可能微调
      </p>
    </section>

    <section>
      <h3>速度</h3>
      <div class="field">
        <span>BPM</span>
        <span class="value">{{ state.bpm }}</span>
      </div>
      <input
        type="range"
        class="range"
        :min="styleDef.bpm.min"
        :max="styleDef.bpm.max"
        step="1"
        v-model.number="state.bpm"
      />
      <p class="hint">播放中可实时调速（{{ styleDef.bpm.min }}–{{ styleDef.bpm.max }}）</p>
    </section>

    <section>
      <h3>乐器组</h3>
      <div v-for="id in TRACK_IDS" :key="id" class="track" :class="{ unused: !hasTrack(id) }">
        <label class="check">
          <input type="checkbox" v-model="state.tracks[id].on" :disabled="!hasTrack(id)" />
          <span>{{ TRACK_NAMES[id] }}</span>
          <span v-if="!hasTrack(id)" class="unused-tag">当前风格未使用</span>
        </label>
        <div class="track-vol">
          <input
            type="range"
            class="range"
            min="-24"
            max="0"
            step="1"
            v-model.number="state.tracks[id].db"
            :disabled="!state.tracks[id].on || !hasTrack(id)"
          />
          <span class="db">{{ state.tracks[id].db }} dB</span>
        </div>
      </div>
      <div class="track master">
        <span class="check static">总音量</span>
        <div class="track-vol">
          <input type="range" class="range" min="-30" max="0" step="1" v-model.number="state.masterDb" />
          <span class="db">{{ state.masterDb }} dB</span>
        </div>
      </div>
    </section>

    <section>
      <h3>音源</h3>
      <div class="seg engine-seg">
        <button :class="{ active: state.engine === 'synth' }" @click="state.engine = 'synth'">合成</button>
        <button :class="{ active: state.engine === 'sampler' }" @click="state.engine = 'sampler'">
          采样{{ ui.samplerLoading ? '（加载中…）' : '' }}
        </button>
      </div>
      <p class="hint">采样模式：钢琴与鼓组使用真实采样（Salamander 钢琴 + 鼓机），首次需联网加载，其余声部仍为合成</p>
    </section>

    <section>
      <h3>辅助</h3>
      <label class="check">
        <input type="checkbox" v-model="state.metronome" />
        <span>节拍器</span>
      </label>
      <label class="check">
        <input type="checkbox" v-model="state.countIn" />
        <span>播放前预备拍（1 小节）</span>
      </label>
      <div class="field seg-field">
        <span>和弦显示</span>
        <div class="seg">
          <button :class="{ active: state.display === 'name' }" @click="state.display = 'name'">和弦名</button>
          <button :class="{ active: state.display === 'roman' }" @click="state.display = 'roman'">级数</button>
        </div>
      </div>
      <div class="field seg-field">
        <span>鼓加花</span>
        <div class="seg fill-seg">
          <button :class="{ active: state.fillLevel === 'off' }" @click="state.fillLevel = 'off'">关</button>
          <button :class="{ active: state.fillLevel === 'low' }" @click="state.fillLevel = 'low'">低</button>
          <button :class="{ active: state.fillLevel === 'medium' }" @click="state.fillLevel = 'medium'">中</button>
          <button :class="{ active: state.fillLevel === 'high' }" @click="state.fillLevel = 'high'">高</button>
          <button :class="{ active: state.fillLevel === 'crazy' }" @click="state.fillLevel = 'crazy'">疯</button>
        </div>
      </div>
      <p class="hint">「疯」档每小节都可能触发鼓填充，长谱（16 小节起）可能随机出现 B 段整体升调</p>
    </section>

    <button class="generate" @click="generate()">🎲 随机生成</button>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
h3 {
  margin: 0 0 2px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}
.field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.field > span:first-child {
  font-size: 14px;
  color: var(--text);
}
.value {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--accent);
}
select {
  background: var(--input-bg);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 14px;
  min-width: 130px;
  outline: none;
}
select:focus {
  border-color: var(--accent);
}
.hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-faint);
  line-height: 1.5;
}
.track {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
  border-top: 1px dashed var(--border);
}
.track:first-of-type {
  border-top: none;
}
.check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text);
  cursor: pointer;
}
.check.static {
  cursor: default;
}
.track-vol {
  display: flex;
  align-items: center;
  gap: 8px;
}
.track-vol .range {
  flex: 1;
}
.db {
  font-size: 12px;
  color: var(--text-dim);
  width: 52px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.range {
  width: 100%;
  accent-color: var(--accent);
}
.track.unused {
  opacity: 0.45;
}
.unused-tag {
  font-size: 11px;
  color: var(--text-faint);
}
.seg-field {
  margin-top: 2px;
}
.engine-seg button {
  flex: 1;
}
.fill-seg button {
  padding: 6px 8px;
  font-size: 12px;
}
.seg {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.seg button {
  background: var(--input-bg);
  color: var(--text-dim);
  border: none;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}
.seg button.active {
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}
.generate {
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), #8f6cff);
  cursor: pointer;
  transition: transform 0.1s, filter 0.15s;
}
.generate:hover {
  filter: brightness(1.1);
}
.generate:active {
  transform: scale(0.98);
}
</style>
