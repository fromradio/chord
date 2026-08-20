# 和弦 Shuffle 练习室 (Chord Shuffle Trainer)

浏览器里的随机和弦走向伴奏工具：选好主调、风格、小节数和 BPM，随机生成一条功能和声走向并循环播放鼓 / 贝斯 / 和声伴奏，用于即兴伴奏（comping）与 solo 练习。纯前端实现，无需后端与音频文件。

## 功能

- **主调**：12 个大调（含等音拼写偏好，如 Db / Gb）
- **风格**：Jazz（swing ride + 行走贝斯 + Charleston comping）、Pop/Rock（8 分吉他强力和声 + 驱动鼓组）、Blues（12/8 小节 form、shuffle、boogie 贝斯）、Bossa Nova（surdo 鼓 + clave + 反拍吉他）
- **小节数**：4 / 8 / 12 / 16 / 32（布鲁斯按 8/12 小节 form 对齐）
- **BPM**：随风格设定范围，播放中可实时调速
- **乐器组**：鼓 / 贝斯 / 和声 / 电吉他四轨独立开关与音量，另有总音量
- **伴奏随机化**：鼓组 / 贝斯 / comping 均为多套节奏型逐小节加权随机，每 4 小节乐句末随机触发鼓填充，全部带力度人性化
- **和声随机化**：模板加权拼接 + 随机副属和弦替换（ii7→II7、vi→VI7）与 maj7→maj6 色彩变化，结尾落在终止式
- **双音源**：合成（Web Audio 实时合成，离线可用）与采样（Salamander 钢琴 + 鼓机采样，CDN 加载）一键切换
- **播放**：循环播放、当前小节与和弦高亮、1 小节预备拍（count-in）、可开关节拍器、空格键播放/停止
- **和弦显示**：实际和弦名 ↔ 罗马级数（Roman Numeral）切换；点击谱面和弦可试听

## 开发

```bash
npm install
npm run dev      # 本地开发
npm run build    # 产出 dist/
npm run preview  # 本地预览构建产物
```

技术栈：Vite + Vue 3 (TS) + Tone.js。音色为 Web Audio 实时合成；音源通过 `SynthEngine` 抽象，未来可在 `src/core/instruments.ts` 中增加采样（Tone.Sampler）实现直接替换。

## 部署到 Vercel

项目已含 `vercel.json`（framework: vite，输出目录 `dist`），两种方式任选：

1. **Dashboard**：把仓库推到 GitHub → vercel.com → Add New Project → Import，框架会自动识别为 Vite，直接 Deploy。
2. **CLI**：
   ```bash
   npm i -g vercel
   vercel          # 预览部署
   vercel --prod   # 生产部署
   ```
