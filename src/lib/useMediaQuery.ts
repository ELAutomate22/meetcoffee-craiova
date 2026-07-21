"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Citește o interogare media ca sursă externă de adevăr.
 *
 * `useSyncExternalStore` este API-ul potrivit aici: browserul deține valoarea,
 * React doar se abonează la ea. Spre deosebire de varianta cu `useEffect` și
 * `setState`, nu produce o randare în cascadă și tratează corect hidratarea.
 *
 * Returnează `null` pe server și la prima randare, adică „încă nu știm”.
 * Așa evităm să pornim o animație înainte de a ști dacă vizitatorul a cerut
 * mișcare redusă.
 */
export function useMediaQuery(query: string): boolean | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // Pe server nu există `window`; valoarea reală ajunge după hidratare.
  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
