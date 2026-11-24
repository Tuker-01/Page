---
title: 'Unity URP 风格化实时水体与焦散系统'
summary: '基于深度重建与双层 Voronoi 焦散的轻量化风格化水体方案，支持岸边交互泡沫、折射畸变与移动端性能分级。'
category: 'Shader & 渲染'
engine: 'Unity URP'
year: '2026'
date: 2026-10-18
featured: true
cover: '/images/works/stylized-water.svg'
role: 'Shader 编写 / 效果设计与优化'
tags: ['HLSL', 'URP', 'Stylized Water', 'Caustics']
order: 1
---

> **示例作品说明**：这是一篇作品拆解模板。你可以把 `public/images/works/` 替换成自己的渲染截图或录屏 MP4，并直接修改本 Markdown 文件内容。

## 项目目标

在风格化场景中，水体往往需要同时兼顾**清澈透亮的色彩层次**与**可控的美术手绘感**。本方案在 Unity URP 前向管线下实现了一套单 Pass 水体着色器，具备以下能力：

- 按真实水深平滑过渡浅水青绿到深水靛蓝（Beer-Lambert 指数吸收近似）
- 利用深度图重建水下世界坐标，将焦散贴花投影到水底地形和物体表面
- 支持基于深度差 + 噪声扰动的岸边交互泡沫
- 通过静态 Shader Keyword 区分 PC 与移动端特性开关

## 核心实现拆解

### 1. 深度差与水体吸收

利用 `_CameraDepthTexture` 采样水底场景深度，与当前水面的线性视空间深度相减得到水深 `waterDepth`：

```hlsl
float rawDepth = SampleSceneDepth(screenUV);
float sceneEyeDepth = LinearEyeDepth(rawDepth, _ZBufferParams);
float surfaceEyeDepth = input.screenPos.w;
float waterDepth = max(0.0, sceneEyeDepth - surfaceEyeDepth);

// 指数衰减模拟深浅渐变
float depthFactor = 1.0 - exp(-waterDepth * _DepthDensity);
half3 waterColor = lerp(_ShallowColor.rgb, _DeepColor.rgb, depthFactor);
```

### 2. 水底世界坐标重建与双层焦散

如果直接用平面 UV 叠焦散，在有起伏的河床和石块上会出现拉伸。通过深度重建水底世界坐标 `worldPosUnderWater`，再取其 `xz`（结合主光方向偏移）采样两层反向流动的焦散贴图并取 `min`，即可得到自然贴合地形的光斑。

### 3. 岸边泡沫与折射防穿帮

在进行屏幕空间折射偏移时，需要先检查偏移后采样点的水深是否大于 0，避免水面以上的岩石轮廓被错误折射进水中。

## 性能评估

| 指标 | PC (1440p) | 移动端中端机 (1080p) |
| :--- | :--- | :--- |
| Fragment 指令数 | ~112 ALU | ~68 ALU (关闭折射色散) |
| 纹理采样次数 | 6 次 | 3 次 |
| 单屏水体耗时 | ~0.28 ms | ~0.65 ms |

## 后续改进方向

- 引入 Planar Reflection 降分辨率渲染，提升大面积平静湖面的倒影表现。
- 接入 Vertex Color 通道，允许美术在场景中直接手刷水流方向与湍急区域。
