/**
 * Customer-specific utilities
 */

export const AUSTRALIAN_STATES = [
  { code: "", name: "Select State" },
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "WA", name: "Western Australia" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NT", name: "Northern Territory" },
] as const;

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+?61|0)[2-478](?:[0-9]){8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function isValidPostcode(postcode: string): boolean {
  const postcodeRegex = /^[0-9]{4}$/;
  return postcodeRegex.test(postcode);
}