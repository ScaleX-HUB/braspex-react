export function safeJsonParse(value, fallback) {
  if (value == null) return fallback;
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;

  try {
    return JSON.parse(trimmed);
  } catch {
    return fallback;
  }
}
