/** Lowercase, accent-free, trimmed. */
export const norm = (s: string | null | undefined) =>
  (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Levenshtein distance, short-circuiting to 9 when lengths differ by more than 2. */
export function lev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > 2) return 9;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[m][n];
}

/** Split `label` around the first accent-insensitive match of the normalised query `q`. */
export function highlight(label: string, q: string) {
  const i = norm(label).indexOf(q);
  if (!q || i < 0) return { pre: label, match: '', post: '' };
  return { pre: label.slice(0, i), match: label.slice(i, i + q.length), post: label.slice(i + q.length) };
}
