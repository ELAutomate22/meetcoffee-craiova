import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum tratează MeetCoffee datele vizitatorilor site-ului. Acest site de prezentare nu colectează date personale.",
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <LegalPage
      title="Politica de confidențialitate"
      intro="Pe scurt: acest site este o pagină de prezentare. Nu îți cerem date personale, nu ai cont și nu poți plasa comenzi aici."
    >
      <LegalSection title="Ce date colectăm">
        <p>
          Nu colectăm date personale prin acest site. Nu există formulare de
          contact, cont de utilizator, coș de cumpărături sau sistem de plată.
          Nu îți cerem numele, adresa de e-mail sau numărul de telefon.
        </p>
      </LegalSection>

      <LegalSection title="Cookie-uri și urmărire">
        <p>
          Site-ul nu folosește cookie-uri de publicitate și nu are instrumente
          de analiză a traficului. Singura informație salvată local, în
          browserul tău, este faptul că ai văzut deja animația de introducere —
          ca să nu o revezi de fiecare dată.
        </p>
        <p>
          Detalii complete găsești în{" "}
          <a href="/cookies" className="text-crema underline underline-offset-4">
            politica privind cookie-urile
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Servicii externe">
        <p>
          Butonul „Deschide în Google Maps” te trimite către Google Maps, un
          serviciu operat de Google. Din momentul în care ajungi acolo, se
          aplică politica de confidențialitate a Google. Harta nu este
          încorporată în pagină, tocmai pentru ca Google să nu primească date
          despre tine cât timp ești pe site-ul nostru.
        </p>
      </LegalSection>

      <LegalSection title="Drepturile tale">
        <p>
          Conform Regulamentului general privind protecția datelor (GDPR), ai
          dreptul de acces, rectificare, ștergere și opoziție cu privire la
          datele tale personale. Întrucât acest site nu stochează astfel de
          date, aceste drepturi se aplică doar informațiilor pe care ni le
          transmiți direct, în cafenea sau pe rețelele sociale.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pentru orice întrebare legată de această politică, ne poți scrie sau
          ne poți găsi la {site.address.full}.
        </p>
        {/*
          Datele de contact apar aici automat după ce sunt completate în
          src/data/site.ts. Nu se afișează valori inventate.
        */}
        {site.contact.email ? (
          <p>
            E-mail:{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-crema underline underline-offset-4"
            >
              {site.contact.email}
            </a>
          </p>
        ) : (
          <p className="text-taupe">
            Datele de contact vor fi publicate în curând.
          </p>
        )}
      </LegalSection>
    </LegalPage>
  );
}
