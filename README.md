# MeetCoffee — site de prezentare

Site de prezentare pentru **MeetCoffee**, cafenea de specialitate din centrul
Craiovei. Complet în limba română. Fără comandă online, coș, plăți sau conturi
de utilizator — este exclusiv un site de prezentare.

---

## Pornire rapidă

```bash
npm install          # instalează dependențele
npm run dev          # server de dezvoltare pe http://localhost:3000
npm run build        # build de producție
npm start            # rulează build-ul de producție
npm run lint         # verificare ESLint
npm run assets       # regenerează imaginile din cadrul-sursă (vezi ASSETS.md)
```

Cerințe: **Node.js 20.9+**.

---

## Ce trebuie să știe proprietarul

Tot conținutul editabil este în `src/data/`. Nu este nevoie să atingi
componentele pentru a schimba texte, prețuri sau date de contact.

| Fișier | Ce conține |
| --- | --- |
| `src/data/site.ts` | Nume, adresă, program, telefon, e-mail, rețele sociale, preț mediu |
| `src/data/menu.ts` | Categorii și produse din meniu, cu prețuri |
| `src/data/reviews.ts` | Nota medie și recenziile afișate |
| `src/data/faq.ts` | Întrebările frecvente |
| `src/data/gallery.ts` | Imaginile din galerie și textele lor alternative |

### Principiul de bază: nu inventăm date

Site-ul este construit ca să **ascundă** informația nedisponibilă, nu ca să o
inventeze. Câmpurile necompletate (`null`) nu apar deloc în interfață, iar
vizitatorul vede un mesaj neutru de tipul „Detalii disponibile în curând”.

Exemple concrete:

- **Programul** nu se afișează, iar pastila „Deschis acum” nu se calculează,
  cât timp `site.openingHours.confirmed` este `false`.
- **Meniul** afișează o notă că prețurile sunt orientative cât timp
  `menuMeta.confirmed` este `false`.
- **Întrebările frecvente** marcate cu `needsConfirmation: true` sunt ascunse
  complet, până la confirmarea răspunsului.
- **Numărul de recenzii** nu este afirmat cât timp `rating.count` este `null`,
  iar nota nu intră în datele structurate fără el (ar fi marcaj invalid).
- **Telefonul, e-mailul și rețelele sociale** apar automat în pagină și în
  subsol imediat ce sunt completate.

Lista completă a informațiilor de confirmat:
**[DATE-DE-CONFIRMAT.md](./DATE-DE-CONFIRMAT.md)**.

---

## Structura proiectului

```
public/
  images/
    intro/          cadrul cinematografic + bobul decupat
    gallery/        fotografiile din galerie
src/
  app/              rute (pagina principală + pagini legale, sitemap, robots)
  components/
    intro/          introducerea cinematografică (shader + cronologie)
    menu/           meniul interactiv
    gallery/        galeria cu vizualizare mărită
    location/       locația și pastila de program
    layout/         antet, subsol, șablon pagini legale
    sections/       hero, poveste, proces, recenzii, întrebări frecvente
    ui/             primitive reutilizabile
  data/             ⬅ conținutul editabil al afacerii
  lib/              program de funcționare, formatare, interogări media
scripts/
  prepare-assets.mjs  pipeline de procesare a imaginilor
```

---

## Introducerea cinematografică

La prima vizită, site-ul pornește cu o secvență de ~4,3 secunde: un bob de
cafea cade într-o ceașcă, impactul produce unde concentrice și stropi, iar
undele se transformă în „cortina” care deschide site-ul.

**Nu este un fișier video.** Este o simulare WebGL peste o singură imagine
WebP (~120 kB). Motivul este documentat în [ASSETS.md](./ASSETS.md).

### Cum funcționează

Un singur `requestAnimationFrame` mișcă simultan bobul, stropii și shaderul.
De aceea impactul și deschiderea cortinei sunt sincronizate exact — nu sunt
două animații care se succed, ci una singură.

Stările: `loading → ready → playing → impact → curtainOpening → siteVisible`,
plus ieșirile `skipped` și `reducedMotion`.

### Ieșiri garantate

Introducerea **nu poate bloca vizitatorul**. Există cinci căi de ieșire:

1. butonul „Sari peste introducere”;
2. tasta `Escape`;
3. tasta `Tab` (cine navighează cu tastatura ajunge direct în conținut);
4. un ceas de perete (`setTimeout`) care încheie secvența chiar dacă
   `requestAnimationFrame` nu rulează — cazul filelor de fundal;
5. o plasă de 2,5 secunde dacă imaginea nu se încarcă.

### Cine nu vede animația deloc

- vizitatorii cu **„mișcare redusă”** activată în sistemul de operare;
- dispozitivele cu **2 nuclee sau mai puține**, conexiuni **2G** sau cu
  **economie de date** pornită;
- browserele **fără WebGL** (rămâne imaginea statică, apoi intră site-ul).

La vizitele repetate (30 de zile) rulează o variantă scurtă, de ~2,1 secunde.

### Cum se reglează

Duratele sunt într-un singur loc: `src/components/intro/introTimeline.ts`.

---

## Accesibilitate

- `<html lang="ro">`, structură semantică, ierarhie corectă de titluri.
- Navigare completă de la tastatură, cu focus vizibil peste tot.
- Link „Sari la conținutul principal”.
- Taburile din meniu implementează modelul ARIA complet (săgeți, `Home`, `End`).
- Galeria mărită prinde focalizarea, se închide cu `Escape` și readuce
  focalizarea pe imaginea din care a fost deschisă.
- Întrebările frecvente folosesc `<details>` nativ — funcționează fără JS.
- Toate țintele de atingere au cel puțin 24 px (WCAG 2.5.8).
- `prefers-reduced-motion` este respectat în CSS și în JavaScript.
- Fără sunet automat, fără preluarea controlului derulării, fără ferestre
  pop-up.

---

## Confidențialitate

Site-ul nu are instrumente de analiză, pixeli publicitari sau cookie-uri de
urmărire. Harta Google **nu** este încorporată (ar încărca scripturi terțe);
în locul ei există o previzualizare proprie și un link către Google Maps.

Singura informație salvată local este `meetcoffee:intro-seen` — o dată
calendaristică, folosită ca să nu revezi animația completă la fiecare vizită.

Dacă vrei totuși harta încorporată, completează `site.maps.embedUrl` în
`src/data/site.ts` — componenta comută automat pe `<iframe>`. În acest caz
**trebuie** adăugat un mecanism de consimțământ pentru cookie-uri.

---

## Testare

Nu există suită automată de teste. Lista de verificare manuală:

**Introducere**

- [ ] Prima vizită: bobul cade, apar undele și stropii, cortina se deschide.
- [ ] Butonul „Sari peste introducere” funcționează în orice moment.
- [ ] `Escape` și `Tab` opresc introducerea.
- [ ] Reîncărcare imediată → varianta scurtă.
- [ ] Golește `localStorage` → revine varianta completă.
- [ ] Cu „mișcare redusă” activată → site-ul apare instant.
- [ ] Cu WebGL dezactivat → imagine statică, apoi site-ul.
- [ ] Deschide site-ul într-o filă de fundal, revino după 30 s → pagina se
      derulează normal (nu rămâne blocată).

**Site**

- [ ] Navigația marchează secțiunea curentă la derulare.
- [ ] Meniul mobil se deschide, se închide și funcționează cu tastatura.
- [ ] Filtrele din meniu schimbă produsele; săgețile stânga/dreapta merg.
- [ ] Galeria se deschide, navighează cu săgețile, se închide cu `Escape`.
- [ ] „Deschide în Google Maps” duce la adresa corectă.
- [ ] Fără derulare orizontală la 320, 375, 768, 1280 și 1920 px.
- [ ] Paginile `/confidentialitate`, `/cookies`, `/accesibilitate` se încarcă.
- [ ] `/sitemap.xml` și `/robots.txt` răspund corect.

**Verificare automată**

```bash
npm run lint && npx tsc --noEmit && npm run build
```

---

## Publicare pe Vercel

1. Urcă proiectul într-un depozit Git (GitHub, GitLab sau Bitbucket).
2. În Vercel: **Add New → Project** și selectează depozitul.
3. Vercel detectează automat Next.js. Nu este nevoie de nicio setare
   suplimentară și nu există variabile de mediu obligatorii.
4. **Deploy**.

### După prima publicare

Actualizează `site.url` în `src/data/site.ts` cu domeniul real. Valoarea este
folosită pentru adresa canonică, `sitemap.xml`, `robots.txt` și metadatele de
partajare pe rețele sociale — dacă rămâne greșită, previzualizările vor arăta
un domeniu inexistent.

## Publicare pe Netlify

Fișierul `netlify.toml` este deja configurat (comandă de build, Node 20, cache
pentru imagini). Netlify recunoaște Next.js și instalează singur runtime-ul.

1. În Netlify: **Add new site → Import an existing project → GitHub**.
2. Alege depozitul `meetcoffee-craiova`.
3. Setările de build sunt citite din `netlify.toml` — nu modifica nimic.
4. **Deploy**. Fiecare `git push` pe `main` declanșează o publicare nouă.

### Indexarea pe adresele temporare

Cât timp site-ul rulează pe o adresă temporară (`*.netlify.app`,
`*.vercel.app` sau o previzualizare de ramură), **nu este indexat de Google**:
`robots.txt` returnează `Disallow: /`, iar paginile conțin
`<meta name="robots" content="noindex, nofollow">`.

Motivul: prețurile din meniu sunt încă date orientative, neconfirmate de
proprietar, iar o adresă temporară indexată ar însemna și conținut duplicat în
rezultatele căutării.

Comutarea este automată și se face după domeniu. Când site-ul ajunge să ruleze
pe adresa reală din `site.url`, indexarea se activează singură — nu trebuie
schimbat niciun cod. **Deci actualizează `site.url` cu domeniul real înainte de
lansare, altfel site-ul va rămâne neindexat.**

Logica este în `src/lib/deployment.ts`.

### Alte platforme

Proiectul este un Next.js standard, fără server propriu, deci funcționează pe
Netlify, Cloudflare Pages sau orice gazdă cu Node.js 20.9+. Toate rutele sunt
generate static la build.

---

## Limitări cunoscute

- **Fotografiile sunt generate**, nu sunt făcute în cafenea. Trebuie
  înlocuite. Vezi [ASSETS.md](./ASSETS.md).
- **Nu există siglă MeetCoffee**; se folosește un logotip tipografic.
- Programul, contactul și rețelele sociale așteaptă confirmarea proprietarului.
- Introducerea este o simulare, nu filmare reală de produs. Dacă apare un
  material video profesional, poate fi integrat — vezi ASSETS.md, secțiunea
  „Trecerea la video”.
