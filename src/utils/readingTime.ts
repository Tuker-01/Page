/**
 * 针对中英文混排 + 代码块估算阅读时间（分钟）
 */
export function estimateReadingTime(body: string | undefined): number {
  if (!body) return 1;
  const withoutCode = body.replace(/```[\s\S]*?```/g, '');
  const codeBlocks = body.match(/```[\s\S]*?```/g) || [];
  const cjkChars = (withoutCode.match(/[\u4e00-\u9fa5]/g) || []).length;
  const latinWords = (withoutCode.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9_]+/g) || []).length;
  const codeLines = codeBlocks.reduce((acc, block) => acc + block.split('\n').length, 0);

  const minutes = cjkChars / 350 + latinWords / 200 + codeLines / 45;
  return Math.max(1, Math.round(minutes));
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
