export const SITE = {
  // 网站名称与你的署名（修改这里即可全局生效）
  brand: 'TA.FOLIO',
  author: '你的名字',
  role: 'Technical Artist · 技术美术',
  title: 'TA.FOLIO — 技术美术作品集与笔记',
  description: '聚焦实时渲染、Shader 开发、程序化内容生成与 DCC 工具管线的技术美术作品集与技术笔记。',

  // 首页介绍
  heroTag: 'Technical Art · Graphics & Pipeline',
  heroHeading: '用代码连接艺术与实时渲染',
  heroSubtitle:
    '这里记录我的技术美术作品、渲染效果拆解与日常技术笔记。关注实时着色器、风格化渲染、程序化资产以及提升美术生产效率的自动化工具。',

  // 联系方式与外部主页（留空字符串则自动隐藏）
  social: {
    github: 'https://github.com/your-username',
    artstation: '',
    bilibili: '',
    email: 'hello@example.com',
  },

  // 技能矩阵（显示在「关于」页面）
  skills: [
    {
      group: '图形与着色器',
      items: ['HLSL / GLSL', 'Shader Graph / ASE', 'PBR & 风格化渲染 (NPR)', '后处理与水体/植被着色'],
    },
    {
      group: '引擎与渲染管线',
      items: ['Unity URP / HDRP', 'Unreal Engine 5', 'Custom Render Pass', 'RenderDoc / Frame Debugger 性能分析'],
    },
    {
      group: '程序化与资产',
      items: ['Houdini PCG / HDA', 'Substance 3D Designer', '几何节点 (Blender Geometry Nodes)', '地形与环境生成'],
    },
    {
      group: '工具与管线开发',
      items: ['Python (Maya / Blender / Houdini)', 'C# Unity Editor 扩展', '自动化资产检查与批处理', 'Git / CI 协作管线'],
    },
  ],

  // 经历时间线（显示在「关于」页面，按需修改）
  timeline: [
    {
      period: '2025 — 至今',
      title: '技术美术 · 独立学习与项目实践',
      detail: '专注实时风格化渲染、URP 自定义渲染管线与程序化环境工具链研究，持续沉淀公开技术笔记。',
    },
    {
      period: '2023 — 2025',
      title: '图形学与 DCC 工具探索',
      detail: '系统学习计算机图形学基础、线性代数与 Shader 编写，开发多款 Blender/Unity 美术效率脚本。',
    },
  ],
} as const;
