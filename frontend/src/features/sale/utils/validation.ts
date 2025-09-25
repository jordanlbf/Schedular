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

export function isValidABN(abn: string): boolean {
  const abnRegex = /^[0-9]{11}$/;
  return abnRegex.test(abn.replace(/\s/g, ''));
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

export function formatABN(abn: string): string {
  const cleaned = abn.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return abn;
}