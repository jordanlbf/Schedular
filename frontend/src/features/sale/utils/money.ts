export function fmt(cents: number, currency: string = "USD") {
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency });
}