import { site } from "@/data/site";

/**
 * Calculează starea „Deschis acum” / „Închis acum” din programul editabil
 * definit în src/data/site.ts.
 *
 * Regula de bază: dacă programul NU este confirmat de proprietar, nu afirmăm
 * nimic. Nu ghicim ore de funcționare.
 */

export type OpenState =
  | { kind: "unknown" }
  | { kind: "open"; closesAt: string }
  | { kind: "closed"; opensAt: string | null; opensLabel: string | null };

/** Minute de la miezul nopții pentru un text "HH:MM". */
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Ora locală a cafenelei (Europe/Bucharest), indiferent de fusul orar al
 * vizitatorului — un turist din alt fus trebuie să vadă programul corect.
 */
function nowInShopTimezone(now: Date): { day: number; minutes: number } {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.openingHours.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  return {
    day: weekdayMap[get("weekday")] ?? now.getDay(),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function getOpenState(now: Date = new Date()): OpenState {
  if (!site.openingHours.confirmed) return { kind: "unknown" };

  const { day, minutes } = nowInShopTimezone(now);
  const today = site.openingHours.days.find((d) => d.day === day);

  if (today?.opens && today?.closes) {
    const opens = toMinutes(today.opens);
    let closes = toMinutes(today.closes);
    // Program care trece de miezul nopții, ex. 08:00–01:00.
    if (closes <= opens) closes += 24 * 60;

    if (minutes >= opens && minutes < closes) {
      return { kind: "open", closesAt: today.closes };
    }
    if (minutes < opens) {
      return { kind: "closed", opensAt: today.opens, opensLabel: "astăzi" };
    }
  }

  // Caută următoarea zi cu program.
  for (let step = 1; step <= 7; step += 1) {
    const next = site.openingHours.days.find((d) => d.day === (day + step) % 7);
    if (next?.opens) {
      return {
        kind: "closed",
        opensAt: next.opens,
        opensLabel: step === 1 ? "mâine" : next.label.toLowerCase(),
      };
    }
  }

  return { kind: "closed", opensAt: null, opensLabel: null };
}

/** Zilele ordonate luni → duminică, cum se citește un program în România. */
export const weekOrdered = [1, 2, 3, 4, 5, 6, 0]
  .map((d) => site.openingHours.days.find((x) => x.day === d))
  .filter((d): d is NonNullable<typeof d> => Boolean(d));

/**
 * Program în formatul schema.org (`Mo 08:00-20:00`), pentru datele
 * structurate. Returnează `null` dacă programul nu este confirmat.
 */
export function schemaOpeningHours(): string[] | null {
  if (!site.openingHours.confirmed) return null;
  const codes = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const specs = site.openingHours.days
    .filter((d) => d.opens && d.closes)
    .map((d) => `${codes[d.day]} ${d.opens}-${d.closes}`);
  return specs.length > 0 ? specs : null;
}
