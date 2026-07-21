"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { getOpenState, type OpenState } from "@/lib/hours";

/**
 * Pastila „Deschis acum” / „Închis acum”.
 *
 * Ora curentă este o sursă externă de adevăr, deci o citim cu
 * `useSyncExternalStore`, nu cu `useEffect` + `setState`. Instantaneul este un
 * șir de caractere (nu un obiect), pentru ca două citiri consecutive în
 * aceeași randare să fie identice — altfel React ar re-randa la nesfârșit.
 *
 * Pe server returnăm `null`: ora serverului nu are legătură cu ora
 * vizitatorului, iar un text care se schimbă la hidratare ar fi o eroare.
 *
 * Dacă programul nu este confirmat de proprietar, nu afirmăm nimic.
 */
function subscribe(onChange: () => void) {
  // Reîmprospătare din minut în minut, ca pastila să nu rămână în urmă dacă
  // cineva ține pagina deschisă peste ora de închidere.
  const timer = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(timer);
}

export function OpenStatus({ className = "" }: { className?: string }) {
  const getSnapshot = useCallback(() => JSON.stringify(getOpenState()), []);
  const getServerSnapshot = useCallback(() => null, []);

  const serialized = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const status = useMemo<OpenState | null>(
    () => (serialized ? (JSON.parse(serialized) as OpenState) : null),
    [serialized],
  );

  if (status === null) {
    // Rezervă exact aceeași înălțime ca varianta încărcată, fără salt de layout.
    return <span className={`inline-block h-5 ${className}`} aria-hidden="true" />;
  }

  if (status.kind === "unknown") {
    return (
      <span className={`inline-flex items-center gap-2 text-muted ${className}`}>
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-taupe" />
        Program disponibil în curând
      </span>
    );
  }

  if (status.kind === "open") {
    return (
      <span className={`inline-flex items-center gap-2 text-ivory ${className}`}>
        <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crema opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-crema" />
        </span>
        Deschis acum · până la {status.closesAt}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 text-muted ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-taupe" />
      {status.opensAt
        ? `Închis acum · deschidem ${status.opensLabel} la ${status.opensAt}`
        : "Închis acum"}
    </span>
  );
}
