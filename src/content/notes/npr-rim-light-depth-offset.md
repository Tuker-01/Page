---
title: '基于深度图偏移的等宽屏幕空间边缘光（Depth Rim Light）'
summary: '对比传统 Fresnel 边缘光的局限，推导并实现卡通渲染中常用的视空间法线偏移深度采样边缘光算法。'
category: 'Shader 算法'
date: 2026-10-28
tags: ['NPR', 'HLSL', 'DepthBuffer', 'RimLight']
---

## 为什么传统 Fresnel 不够用

在写实渲染中，我们常使用菲涅耳近似来计算边缘光：

$$
F(\mathbf{N}, \mathbf{V}) = (1 - \max(\mathbf{N} \cdot \mathbf{V}, 0))^p
$$

但在二次元 / 风格化角色渲染中，直接使用 `NdotV` 有两个明显缺点：
1. 在平坦或曲率变化大的部位（如脸颊、宽大衣摆），光边粗细极不均匀；
2. 缺乏清晰的「硬边缘」剪影感，容易显得塑料。

## 深度偏移法的核心思路

屏幕空间深度偏移边缘光（Screen-Space Depth Rim）的思路非常直接：

1. 将片元的法线转换到**观察空间（View Space）**，得到 $\mathbf{N}_{vs}$；
2. 沿着 $\mathbf{N}_{vs}.xy$ 的方向，在屏幕 UV 上偏移固定像素宽度 $\Delta u, \Delta v$；
3. 采样偏移位置的场景深度 $D_{\text{offset}}$，并与当前片元线性深度 $D_{\text{curr}}$ 做差；
4. 当 $D_{\text{offset}} - D_{\text{curr}} > \text{threshold}$ 时，说明偏移处已经落到角色轮廓之外（背景深度更远），于是点亮边缘光！

## HLSL 核心实现

```hlsl
// 计算基于深度的等宽边缘光
float ComputeDepthRim(
    float2 screenUV,
    float3 normalVS,
    float currentLinearDepth,
    float rimWidthPx,
    float depthThreshold)
{
    // 按屏幕分辨率换算 UV 偏移量，保证不同分辨率下线宽一致
    float2 pixelSize = _ScreenParams.zw - 1.0; // (1/width, 1/height)
    float2 offsetUV = screenUV + normalize(normalVS.xy + 1e-5) * rimWidthPx * pixelSize;

    // 防止采样越界
    offsetUV = clamp(offsetUV, 0.001, 0.999);

    float offsetRawDepth = SampleSceneDepth(offsetUV);
    float offsetLinearDepth = LinearEyeDepth(offsetRawDepth, _ZBufferParams);

    float depthDiff = offsetLinearDepth - currentLinearDepth;
    return smoothstep(depthThreshold, depthThreshold + 0.15, depthDiff);
}
```

## 实战细节与踩坑记录

- **距离缩放控制**：当相机拉远时，如果 `rimWidthPx` 固定不变，远处的角色可能会被边缘光完全糊住。通常乘以一个基于 `currentLinearDepth` 的柔和衰减系数。
- **透视畸变修正**：观察空间法线在近距离透视投影下受 FOV 影响，可结合 `unity_CameraProjection._m11` 保持跨相机 FOV 表现一致。
- **渲染队列前提**：角色材质必须晚于写入 `_CameraDepthTexture` 的阶段渲染，或在自定义 Depth Prepass 之后执行。
