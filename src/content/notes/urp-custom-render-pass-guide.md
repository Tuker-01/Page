---
title: 'Unity URP 自定义 ScriptableRenderFeature 结构笔记'
summary: '梳理 URP 自定义渲染管线扩展的标准生命周期、RenderPassEvent 插入时机与 RenderGraph 适配要点。'
category: '渲染管线'
date: 2026-10-12
tags: ['Unity', 'URP', 'RenderFeature', 'Pipeline']
---

## 整体结构概览

在 Unity URP 中，想要插入自定义渲染阶段（例如全屏描边、局部模糊、角色刘海阴影等），标准做法是组合两个类：

- **`ScriptableRendererFeature`**：挂在 URP Renderer Asset 上的配置入口，负责创建 Pass 并在每帧将其入队。
- **`ScriptableRenderPass`**：真正执行渲染指令的单元，决定插入时机（`renderPassEvent`）与具体绘制逻辑。

## 常见插入时机（RenderPassEvent）

| 时机枚举 | 典型用途 |
| :--- | :--- |
| `AfterRenderingOpaques` | 基于深度/法线的描边、屏幕空间环境效果、水体前置抓屏 |
| `AfterRenderingTransparents` | 影响半透明物体的特殊色调映射或全局滤镜 |
| `BeforeRenderingPostProcessing` | 自定义后处理（让 Bloom / ToneMapping 在其后统一生效） |

## 精简骨架示例

```csharp
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

public class CustomOutlineFeature : ScriptableRendererFeature
{
    [System.Serializable]
    public class Settings
    {
        public RenderPassEvent injectionPoint = RenderPassEvent.BeforeRenderingPostProcessing;
        public Material outlineMaterial;
    }

    public Settings settings = new Settings();
    private CustomOutlinePass _pass;

    public override void Create()
    {
        _pass = new CustomOutlinePass(settings)
        {
            renderPassEvent = settings.injectionPoint
        };
    }

    public override void AddRenderPasses(ScriptableRenderer renderer, ref RenderingData renderingData)
    {
        if (settings.outlineMaterial == null) return;
        if (renderingData.cameraData.isPreviewCamera) return;
        renderer.EnqueuePass(_pass);
    }
}
```

## 避免常见性能陷阱

1. **禁止在 `Execute` 中每帧 `new` 材质或数组**：所有 `Material`、`ShaderTagId`、`ProfilingSampler` 都应提前缓存。
2. **明确声明输入需求**：如果需要深度图或法线图，在 Pass 初始化时调用 `ConfigureInput(ScriptableRenderPassInput.Depth | ScriptableRenderPassInput.Normal)`，避免无意义的额外 Pass 开销。
3. **过滤非目标相机**：对 `PreviewCamera`、`Reflection` 相机按需跳过，防止编辑器预览窗口出现异常画面。
