/**
 * 제목 → URL 슬러그 변환
 * - 한글 그대로 유지 (브라우저에서 디코딩되어 표시됨)
 * - 공백 → 하이픈
 * - 특수문자 제거
 */
export function toSlug(title: string): string {
  return title
    .trim()
    .replace(/[\n\r]+/g, " ")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
