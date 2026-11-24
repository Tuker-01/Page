---
title: '基于深度与法线的屏幕空间风格化描边'
summary: '通过 Unity URP ScriptableRenderFeature 实现的屏幕空间 Roberts Cross 边缘检测描边，解决传统背面扩边在硬边处断裂的问题。'
category: 'Shader & 渲染'
engine: 'Unity URP'
year: '2025'
date: 2025-12-10
featured: true
cover: '/images/works/npr-outline.svg'
role: '渲染管线 / 后处理 Shader'
tags: ['URP', 'Post-Processing', 'NPR', 'Outline']
order: 4
---

## 为什么选择屏幕空间描边

传统的背面外扩法（Inverted Hull）在角色身上表现良好，但在建筑、机械和低面数硬表面资产上，平滑法线难以覆盖所有锐利折角，且会额外增加一倍几何绘制开销。屏幕空间描边则在单次全屏 Pass 中综合 **Depth Buffer** 与 **View-Space Normal Buffer** 提取轮廓线。

## 核心算法要点

### 1. Roberts Cross 算子

相比 9 次采样的 Sobel 算子，Roberts Cross 只需要 4 个对角像素采样，在移动端带宽更友好，且线宽表现干净：

- **深度梯度**：捕捉物体外轮廓及前后遮挡边界
- **法线梯度**：捕捉物体内部结构折痕
- **视角 Grazing Angle 补偿**：当视线与表面接近平行时，自动放宽深度阈值，防止地面或斜坡大面积发黑

### 2. 距离衰减与线条风格化

根据像素线性深度动态收缩描边强度与线宽，避免远景建筑被粗黑线条糊成一团；同时可叠乘一张低频噪声 UV 偏移，模拟手绘铅笔或水墨线条的轻微抖动感。
