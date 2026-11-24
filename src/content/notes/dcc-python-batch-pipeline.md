---
title: '用 Python 编写可维护的 DCC 资产批处理脚本架构'
summary: '总结在 Maya / Blender / Houdini 中开发工具脚本时的分层结构、无头批处理技巧与错误日志规范。'
category: 'DCC 工具开发'
date: 2026-09-18
tags: ['Python', 'Pipeline', 'Blender', 'Maya']
---

## 为什么很多 TA 脚本越写越难维护

初期写美术小工具时，大家习惯把 **UI 界面代码** 和 **核心几何/文件处理逻辑** 全塞进同一个 `.py` 文件里。一旦要支持命令行批量跑几百个资产（无 UI 模式），或者需要换个引擎导出参数，整段脚本就得重写。

## 推荐的三层目录划分

```text
asset_tool/
├── core/               # 纯逻辑层：不依赖任何 UI，可独立在命令行批处理运行
│   ├── rules.py        # 资产检查与修复规则
│   └── exporter.py     # FBX / glTF 导出封装
├── ui/                 # 表现层：Blender Panel / PySide6 / Qt 窗口
│   └── panel.py
└── config/             # 配置层：项目命名规范、面数预算（JSON / YAML）
    └── rules.json
```

## 批处理执行的核心原则

### 1. 幂等性（Idempotency）

同一个资产连续跑两次修复脚本，结果应当完全一致，不能出现“越修名字越长”（例如重复加 `SM_SM_Rock` 前缀）的情况：

```python
def ensure_prefix(name: str, prefix: str = "SM_") -> str:
    return name if name.startswith(prefix) else f"{prefix}{name}"
```

### 2. 结构化输出报告

批量处理 500 个 FBX 文件时，不要在报错时直接中断整个循环；应该捕获单个文件的异常并写入 CSV / JSON 报告，方便美术一次性定位所有问题资产。

### 3. 无头模式（Headless CLI）

Blender 可以通过命令行静默批量执行 Python 脚本，非常适合接入 Git / Jenkins 自动化管线：

```bash
blender --background scene.blend --python run_validator.py -- --output report.json
```
