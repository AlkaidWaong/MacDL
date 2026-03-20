const ALIAS_TO_CANONICAL: Record<string, string> = {
  ORC: "OCR"
};

export function normalizeTag(tag: string): string {
  return ALIAS_TO_CANONICAL[tag] ?? tag;
}
