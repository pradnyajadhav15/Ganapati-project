/**
 * Product sizes are entered by hand and are inconsistent in the data:
 * `14"`, `14.5”` (curly quote), bare `17`, `4.5`. This reads a height out of
 * whatever was typed, so the size comparison can be shown wherever possible
 * and quietly skipped when it cannot.
 */
export function parseHeightInches(size: string | null | undefined): number | null {
  if (!size) return null;
  const raw = String(size).trim();
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;

  const value = parseFloat(match[1]);
  if (!Number.isFinite(value) || value <= 0) return null;

  // A prime or the word feet means feet; a double prime or "inch" means inches.
  // Bare numbers are inches, which is how every existing product is recorded.
  const saysFeet = /(\bft\b|\bfeet\b|\bfoot\b|['′])/i.test(raw);
  const saysInches = /(["”″]|\binch(es)?\b|\bin\b)/i.test(raw);
  const inches = saysFeet && !saysInches ? value * 12 : value;

  // Beyond this the entry is more likely a typo or another unit than a murti.
  if (inches > 120) return null;
  return inches;
}

export type Height = { inches: number; cm: number; feet: string | null };

export function describeHeight(inches: number): Height {
  const cm = Math.round(inches * 2.54);
  let feet: string | null = null;
  if (inches >= 12) {
    const ft = Math.floor(inches / 12);
    const rem = Math.round(inches - ft * 12);
    feet = rem > 0 ? `${ft} ft ${rem} in` : `${ft} ft`;
  }
  return { inches, cm, feet };
}
