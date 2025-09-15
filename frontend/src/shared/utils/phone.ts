export function formatPhone(value: string): string {
  const formatted = value.replace(/\D/g, '');
  if (formatted.length > 0) {
    if (formatted.length <= 4) {
      return formatted;
    } else if (formatted.length <= 7) {
      return formatted.slice(0, 4) + ' ' + formatted.slice(4);
    } else {
      return formatted.slice(0, 4) + ' ' + formatted.slice(4, 7) + ' ' + formatted.slice(7, 10);
    }
  }
  return formatted;
}