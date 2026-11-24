/**
 * 拼接 Astro 的 base 路径，确保部署到
 * username.github.io 或 username.github.io/repo-name 都能正常跳转与加载图片。
 */
export function withBase(path: string): string {
  if (!path) return import.meta.env.BASE_URL;
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) {
    return path;
  }
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
