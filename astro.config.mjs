import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 部署到 GitHub Pages 时：
// 1) 如果仓库名是 <用户名>.github.io，base 保持 '/' 即可
// 2) 如果仓库名是其他名字（例如 ta-portfolio），把 base 改成 '/ta-portfolio'
export default defineConfig({
  site: process.env.SITE_URL || 'https://username.github.io',
  base: process.env.BASE_PATH || '/',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'vitesse-dark',
      },
      wrap: true,
    },
  },
});
