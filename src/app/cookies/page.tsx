import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Politica privind cookie-urile",
  description:
    "Ce se salvează în browserul tău când vizitezi site-ul MeetCoffee. Nu folosim cookie-uri de publicitate sau de analiză.",
};

export default function Page() {
  return (
    <LegalPage
      title="Politica privind cookie-urile"
      intro="Nu folosim cookie-uri de publicitate, de analiză sau de urmărire. Singurul lucru pe care îl salvăm local are un scop strict practic."
    >
      <LegalSection title="Ce salvăm">
        <p>
          Site-ul folosește o singură intrare în memoria locală a browserului
          (<code className="text-crema">localStorage</code>), nu un cookie:
        </p>
        <ul className="mt-4 space-y-3">
          <li className="rounded-[var(--radius-card)] border border-ivory/10 p-5">
            <p className="text-ivory">meetcoffee:intro-seen</p>
            <p className="mt-2 text-sm">
              Reține momentul în care ai văzut animația de introducere, ca la
              următoarele vizite să îți arătăm o variantă scurtă în loc de cea
              completă. Conține doar o dată calendaristică, nimic altceva.
            </p>
            <p className="mt-2 text-sm text-taupe">
              Durată: 30 de zile · Necesar pentru funcționarea site-ului
            </p>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Ce NU folosim">
        <p>
          Nu avem Google Analytics sau alt instrument de statistici. Nu avem
          pixeli de publicitate. Nu avem butoane de social media care încarcă
          scripturi externe. Harta Google nu este încorporată în pagină, tocmai
          ca să nu fie plasate cookie-uri terțe.
        </p>
      </LegalSection>

      <LegalSection title="Cum ștergi aceste date">
        <p>
          Poți șterge informația oricând, din setările browserului, secțiunea de
          date pentru site-uri. Nu îți afectează în niciun fel accesul: vei
          revedea pur și simplu animația completă la următoarea vizită.
        </p>
      </LegalSection>

      <LegalSection title="Dacă se schimbă ceva">
        <p>
          Dacă în viitor vom adăuga instrumente de analiză sau conținut extern
          care plasează cookie-uri, vom actualiza această pagină și vom cere
          consimțământul tău în prealabil, așa cum prevede legislația.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
