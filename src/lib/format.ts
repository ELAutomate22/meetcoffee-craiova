/** Formatare românească pentru prețuri și numere. */

const priceFormatter = new Intl.NumberFormat("ro-RO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** 14 → „14 lei”. Returnează `null` dacă prețul nu este stabilit. */
export function formatPrice(value: number | null): string | null {
  if (value === null) return null;
  return `${priceFormatter.format(value)} lei`;
}

/** 4.9 → „4,9” (virgulă zecimală, ca în română). */
export function formatRating(value: number): string {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}
