---
title: 'Houdini 程序化悬崖与风化岩层 HDA'
summary: '面向开放世界关卡搭白盒的 Houdini Digital Asset，输入基础体块即可自动生成带层理裂隙、顶点色遮罩及多级 LOD 的岩壁资产。'
category: '程序化资产'
engine: 'Houdini / UE5'
year: '2026'
date: 2026-09-05
featured: true
cover: '/images/works/procedural-cliff.svg'
role: '程序化建模 / HDA 管线集成'
tags: ['Houdini', 'HDA', 'VDB', 'Procedural']
order: 2
---

> **示例作品说明**：这里演示如何用结构化的方式展示程序化资产或 Houdini 工具作品。

## 设计痛点

在大型自然场景制作中，手工雕刻大量悬崖模块容易出现重复接缝，且一旦关卡设计师调整路线或高度，美术需要反复返工。通过将悬崖拆解为 **输入体块 → VDB 体素融合 → 层理置换 → 减面展 UV → 烘焙遮罩** 的自动化流程，可以让关卡白盒阶段直接产出接近终版结构的资产。

## 节点管线架构

1. **Blockout 预处理**：接受 Unreal Engine 中的 Brush 或静态网格体，转换为高精度 VDB 消除尖锐穿插。
2. **层理与风化置换**：结合 Worley Noise（块状裂纹）与倾斜方向渐变，在 VEX 中沿法线方向施加分层挤压。
3. **拓扑重建与 LOD**：使用 PolyReduce 配合曲率权重保留硬朗轮廓，自动输出 `LOD0` 至 `LOD3`。
4. **顶点色通道编码**：
   - `R` 通道：边缘磨损曲率（Curvature），驱动引擎材质中的亮边磨白
   - `G` 通道：顶面朝向积灰/青苔遮罩（World Normal Y + AO）
   - `B` 通道：缝隙闭塞（Cavity），增强裂纹暗部对比

## 关键 VEX 片段

```c
// 根据世界高度与倾斜角生成沉积岩层理扰动
float strata = sin((@P.y + @P.x * chf("tilt")) * chf("freq") + noise(@P * 0.4) * 2.0);
float mask = smoothstep(-0.3, 0.8, strata);
@P += @N * (mask * chf("amplitude"));
```

## 产出收益

- 关卡白盒调整后 **30 秒内** 重新生成完整悬崖与碰撞体。
- 自动输出的顶点色遮罩可直接复用项目标准的三平面映射（Triplanar）岩石母材质，无需为每块岩石单独画贴图。
