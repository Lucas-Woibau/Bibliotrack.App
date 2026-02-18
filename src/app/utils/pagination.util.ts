export function getVisiblePages(
  currentPage: number,
  totalPages: number
): number[] {
  const first = 1;
  const last = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, currentPage), last);

  if (last === 1) return [1];

  const uniqueSorted = (arr: number[]) =>
    [...new Set(arr)]
      .filter((p) => p >= 1 && p <= last)
      .sort((a, b) => a - b);

  if (current <= 2) {
    return uniqueSorted([1, 2, 3, last]).slice(0, 5);
  }

  if (current >= last - 1) {
    return uniqueSorted([1, last - 2, last - 1, last]).slice(-5);
  }

  return uniqueSorted([1, current - 1, current, current + 1, last]).slice(0, 5);
}
