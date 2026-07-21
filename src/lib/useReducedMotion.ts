"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * `true` dacă vizitatorul a cerut mișcare redusă în sistemul de operare.
 * `null` cât timp preferința nu este încă cunoscută (server / prima randare),
 * ca să nu pornim nicio animație pe baza unei presupuneri.
 */
export function useReducedMotion(): boolean | null {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Estimează dacă dispozitivul este prea slab pentru animația completă.
 * Folosit ca să sărim peste simularea WebGL pe telefoane vechi și pe
 * conexiuni cu economie de date.
 */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (connection?.saveData) return true;
  if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return true;
  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2) {
    return true;
  }

  return false;
}
