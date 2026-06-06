const ALIAS_TO_CANONICAL: Record<string, string> = {
  ORC: "OCR",
  Markdown: "Markdown编辑器",
  "mac卸载工具": "Mac应用卸载",
  "Mac剪贴板": "剪贴板管理器",
  "剪贴板工具": "剪贴板管理器",
  "屏幕录制": "录屏工具",
  "写作软件": "写作工具",
  "Mac办公": "办公效率"
};

export function normalizeTag(tag: string): string {
  return ALIAS_TO_CANONICAL[tag] ?? tag;
}
