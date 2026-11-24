---
title: 'Blender 到引擎的自动化资产规范检查插件'
summary: '使用 Python 开发的 Blender 面板插件，导出前一键检查命名、缩放归零、UV 通道、面数预算并支持自动修复与批量导出。'
category: '工具与管线'
engine: 'Blender / Python'
year: '2026'
date: 2026-07-22
featured: true
cover: '/images/works/asset-validator.svg'
role: '工具架构 / Python 开发'
tags: ['Python', 'Blender', 'Pipeline', 'Automation']
order: 3
---

> **示例作品说明**：工具类 TA 作品非常看重「问题背景 → 规则设计 → 交互与效率提升」的清晰表达。

## 解决什么问题

在多人协作的美术生产中，模型导入引擎后经常遇到以下低级但耗时的问题：
- 物体 `Scale` 未应用导致骨骼缩放或光照烘焙异常
- 缺少第二套光照贴图 UV（Lightmap UV）
- 材质槽为空或命名不符合 `SM_` / `SK_` / `MI_` 规范
- 多边形三角面数超过对应资产级别预算

## 规则引擎设计

插件将每一项检查抽象为独立的 `Rule` 类，支持 **检测（check）** 与 **一键修复（fix）** 分离，便于不同项目通过 JSON 配置文件灵活开关规则：

```python
from dataclasses import dataclass
from typing import List
import bpy

@dataclass
class Issue:
    obj_name: str
    rule_id: str
    message: str
    fixable: bool = True

def check_unapplied_scale(obj: bpy.types.Object) -> List[Issue]:
    sx, sy, sz = obj.scale
    if any(abs(v - 1.0) > 1e-4 for v in (sx, sy, sz)):
        return [
            Issue(
                obj_name=obj.name,
                rule_id="TRANSFORM_SCALE",
                message=f"缩放未归零: ({sx:.2f}, {sy:.2f}, {sz:.2f})",
                fixable=True,
            )
        ]
    return []
```

## 工具特性

- **一键全场景扫描**：在 Blender 侧边栏（N 面板）高亮列出错误物体，点击条目直接居中聚焦。
- **安全自动修复**：支持批量应用变换、清理孤立材质槽、按规则重命名导出节点。
- **批量 FBX/glTF 导出**：通过校验后自动将物体归零原点并按引擎坐标系参数导出。
