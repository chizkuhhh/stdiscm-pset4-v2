const codes = new Map<
  string,
  { code: string; expires: number }
>();

export function setCode(email: string, code: string) {
  codes.set(email, {
    code,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  });
}

export function getCode(email: string) {
  const entry = codes.get(email);
  if (!entry) return null;

  if (Date.now() > entry.expires) {
    codes.delete(email);
    return null;
  }
  return entry.code;
}

export function deleteCode(email: string) {
  codes.delete(email);
}