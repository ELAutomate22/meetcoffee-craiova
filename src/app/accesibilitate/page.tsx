import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Declarație de accesibilitate",
  description:
    "Cum am construit site-ul MeetCoffee pentru a fi utilizabil de cât mai multe persoane, inclusiv cu tastatura sau cu cititor de ecran.",
};

export default function Page() {
  return (
    <LegalPage
      title="Declarație de accesibilitate"
      intro="Ne-am propus ca site-ul să fie utilizabil de cât mai multe persoane, indiferent de dispozitiv sau de tehnologia de asistare folosită."
    >
      <LegalSection title="Standardul urmărit">
        <p>
          Site-ul este construit după recomandările WCAG 2.1, nivel AA. Aceasta
          înseamnă contrast suficient între text și fundal, structură corectă a
          titlurilor, texte alternative pentru imagini și posibilitatea de a
          folosi tot conținutul fără mouse.
        </p>
      </LegalSection>

      <LegalSection title="Ce am implementat">
        <ul className="list-disc space-y-2 pl-5">
          <li>Navigare completă de la tastatură, cu indicator de focalizare vizibil.</li>
          <li>
            Link „Sari la conținutul principal”, ca navigarea să nu treacă de
            fiecare dată prin meniu.
          </li>
          <li>
            Animația de introducere poate fi oprită oricând, din buton sau cu
            tasta Escape, și se oprește automat la apăsarea tastei Tab.
          </li>
          <li>
            Dacă ai activat „mișcare redusă” în sistemul de operare, animațiile
            nu pornesc deloc, iar site-ul se afișează direct.
          </li>
          <li>Structură semantică: titluri ierarhizate, liste, secțiuni denumite.</li>
          <li>Texte alternative în limba română pentru toate imaginile de conținut.</li>
          <li>Fără sunet pornit automat și fără preluarea controlului derulării.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Limitări cunoscute">
        <p>
          Animația de introducere este un element vizual decorativ. Nu conține
          informații care să lipsească din restul paginii, iar cititoarele de
          ecran o pot ignora în întregime — tot conținutul site-ului este
          prezent în pagină și dedesubtul ei.
        </p>
        <p>
          Fotografiile actuale din galerie sunt imagini de prezentare, urmând a
          fi înlocuite cu fotografii realizate în cafenea. Textele alternative
          vor fi actualizate odată cu ele.
        </p>
      </LegalSection>

      <LegalSection title="Ai întâmpinat o problemă?">
        <p>
          Dacă ceva nu funcționează pentru tine, spune-ne. Orice semnalare ne
          ajută să corectăm. Ne poți găsi direct în cafenea sau pe rețelele
          sociale.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
