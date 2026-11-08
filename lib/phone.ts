export function normalizePhone(phone: string) {
  return phone.trim().replace(/[^\d+]/g, "");
}
