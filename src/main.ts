import { createApp } from 'vue'
// 注意：audio-setup 必须最先导入（在任何 Tone 节点创建前设置音频上下文）
import './audio-setup'
import './style.css'
import App from './App.vue'

const app = createApp(App)
// 开发环境下把运行时错误显示在页面底部，方便定位
if (import.meta.env.DEV) {
  app.config.errorHandler = (err, _inst, info) => {
    const d = document.createElement('pre')
    d.style.cssText =
      'position:fixed;left:0;bottom:0;z-index:9999;color:#f66;background:#000c;padding:8px;font-size:12px;max-width:100%;white-space:pre-wrap;margin:0'
    d.textContent = `VUE ERROR [${info}]: ${(err as Error)?.stack ?? err}`
    document.body.appendChild(d)
  }
}
app.mount('#app')
