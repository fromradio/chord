import { createApp } from 'vue'
// 注意：audio-setup 必须最先导入（在任何 Tone 节点创建前设置音频上下文）
import './audio-setup'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
