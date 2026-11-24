# TA.FOLIO — 技术美术作品集与笔记网站

基于 **Astro** 构建的零成本个人网站模板，专为 **技术美术（Technical Artist）** 设计：
- **设计感 + 结构感兼备**：柔和护眼的深/浅双色主题、首页实时程序化视口、16:10 作品集展示画廊、带实时搜索/分类筛选/右侧固定目录大纲（TOC）的技术笔记系统。
- **开箱支持 TA 写作需求**：内置 HLSL / GLSL / C# / Python / VEX 代码高亮与一键复制，以及 KaTeX 数学公式渲染（支持 `$...$` 和 `$$...$$`）。
- **零成本自动上线**：内置 GitHub Actions 配置，配合 **GitHub Desktop** 推送即自动更新网站。

---

## 一、平时怎么修改内容？

### 1. 修改个人信息（名字、简介、技能栈、社交链接）
只改这一个文件即可全局生效：
- `src/config/site.ts`

### 2. 新增一个作品集项目
1. 把作品封面图（PNG / JPG / WebP）或演示视频（MP4）放到 `public/images/works/`。
2. 在 `src/content/works/` 目录下新建一个 `.md` 文件（例如 `my-shader.md`），开头写好元信息：
   ```markdown
   ---
   title: '你的作品标题'
   summary: '一句话概括亮点与技术方案'
   category: 'Shader & 渲染'   # 可选：Shader & 渲染 / 程序化资产 / 工具与管线 / 特效 VFX
   engine: 'Unity URP'         # 例如：Unreal Engine 5 / Houdini / Blender
   year: '2026'
   date: 2026-11-24
   featured: true              # 设为 true 会出现在首页精选
   cover: '/images/works/你的封面图.png'
   video: '/images/works/你的演示视频.mp4' # 可选，不需要可以删掉这一行
   role: 'Shader 编写 / 独立实现'
   tags: ['HLSL', 'URP']
   order: 1                    # 数字越小排序越靠前
   ---

   ## 项目目标
   这里用 Markdown 写你的作品拆解……
   ```

### 3. 新增一篇技术笔记
在 `src/content/notes/` 目录下新建一个 `.md` 文件（例如 `my-note.md`）：
```markdown
---
title: '你的笔记标题'
summary: '这篇笔记讲了什么'
category: 'Shader 算法'       # 可选：渲染管线 / Shader 算法 / DCC 工具开发 / 性能优化 / 图形学基础
date: 2026-11-24
tags: ['HLSL', 'URP']
---

## 正文标题
正文里的 `##` 和 `###` 标题会自动生成右侧目录大纲。
```

---

## 二、本地预览（修改时实时查看效果）

在 `D:\ta-portfolio` 目录下打开终端，运行：

```bash
npm run dev
```

打开终端里显示的 `http://localhost:4321` 即可实时预览。

---

## 三、用 GitHub Desktop 免费上线（GitHub Pages）

1. **在 GitHub Desktop 添加本项目**：
   - 打开 GitHub Desktop → 菜单栏 `File` → `Add local repository...` → 选择 `D:\ta-portfolio`。
   - 如果提示还不是 Git 仓库，点击提示里的 **`create a repository`** 初始化本地仓库。
2. **提交并发布到 GitHub**：
   - 在左下角写一句提交说明（例如 `Initial commit`），点击 **Commit to main**。
   - 点击顶部 **Publish repository**：
     - 仓库名推荐填 **`你的GitHub用户名.github.io`**（这样网址最简洁，就是 `https://你的用户名.github.io`）。
     - 也可以填任意名字如 `ta-portfolio`（网址会是 `https://你的用户名.github.io/ta-portfolio`，本项目已自动适配路径，无需改代码）。
     - **取消勾选** "Keep this code private"（GitHub Pages 免费版需要公开仓库）。
3. **开启 GitHub Pages（只需设置一次）**：
   - 打开你在网页上的 GitHub 仓库 → 点击 **Settings** → 左侧 **Pages**。
   - 在 **Build and deployment → Source** 下拉框中，选择 **GitHub Actions**。
4. **以后日常更新**：
   - 写完新笔记或放好新作品 → 打开 **GitHub Desktop** → Commit → **Push origin**。
   - 等待约 1 分钟，网站就会自动重新构建并上线！
