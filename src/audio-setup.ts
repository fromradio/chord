import * as Tone from 'tone'

// 使用更大的输出缓冲（playback 提示），降低 Windows 共享音频模式下
// 语音数较多时音频线程欠载导致的爆音/杂音概率。必须在任何 Tone 节点创建前执行。
Tone.setContext(new Tone.Context({ latencyHint: 'playback' }))
