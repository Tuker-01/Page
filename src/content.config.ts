import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(['Shader & 渲染', '程序化资产', '工具与管线', '特效 VFX']),
    engine: z.string(),
    year: z.string(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    cover: z.string(),
    video: z.string().optional(),
    role: z.string().default('技术美术 / 独立实现'),
    tags: z.array(z.string()).default([]),
    repoUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    order: z.number().default(100),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(['渲染管线', 'Shader 算法', 'DCC 工具开发', '性能优化', '图形学基础']),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { works, notes };
