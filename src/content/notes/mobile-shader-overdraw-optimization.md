---
title: '移动端半透明 Overdraw 与带宽优化排查清单'
summary: '结合 RenderDoc 与移动端真机 Profiler，整理粒子特效、植被与透明水体的常见 GPU 瓶颈排查步骤。'
category: '性能优化'
date: 2026-08-29
tags: ['Optimization', 'Mobile', 'RenderDoc', 'VFX']
---

## 为什么移动端特别怕 Overdraw

移动 GPU 普遍采用 **TBDR（Tile-Based Deferred Rendering）** 架构。对于不透明物体，芯片能借助 Early-Z / HSR 剔除被遮挡的片元；但**半透明物体关闭了深度写入**，多层叠加时每一层都必须执行完整的片元着色并读写帧缓冲，极易瞬间打满显存带宽。

## 排查清单

### 1. 特效粒子（VFX）
- 检查贴图四周是否存在大面积 `Alpha = 0` 的透明空白区域，使用 **Tight Mesh（紧致多边形裁切）** 替代默认四边形（Quad）。
- 限制屏幕近景大面积全屏烟雾/光晕的粒子发射上限，随相机距离做柔和淡出。
- 避免在普通粒子 Shader 中开启耗时的屏幕抓取（GrabPass / CameraOpaqueTexture）。

### 2. 植被与 AlphaTest（Clip）
- 在移动端，`discard / clip` 会破坏 TBDR 的隐藏面消除机制，导致同一像素后面的物体无法提前剔除。
- 优先使用**更贴合叶片轮廓的网格**减少透明像素，中远距离草丛直接切换为实心低面片 + 顶点色渐变。

### 3. 贴图与采样带宽
- 所有 3D 场景贴图务必开启 **Mipmap**，否则远景采样不仅会出现噪点闪烁，还会导致纹理缓存命中率暴跌。
- 将 Roughness、Metallic、AO 合并打包进单张 ORM 贴图的 `R / G / B` 通道，减少采样器占用和内存带宽。

> **经验法则**：优化前先用真机抓帧（RenderDoc / Snapdragon Profiler / Xcode GPU Capture），先区分当前帧是 **Vertex Bound、Fragment Bound 还是 Bandwidth Bound**，再对症下药。
