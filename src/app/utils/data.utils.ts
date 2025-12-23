export function parseDateToIso(date: string | null): string | null {
  if (!date || date.length !== 10) return null;

  const [day, month, year] = date.split('/').map(Number);
  const parsed = new Date(year, month - 1, day);

  if (isNaN(parsed.getTime())) return null;

  return parsed.toISOString();
}
