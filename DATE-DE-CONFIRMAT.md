# Informații care trebuie confirmate de proprietar

Toate elementele de mai jos sunt **ascunse pe site** până la completare.
Vizitatorii nu văd niciun text de tip „de completat” — văd fie un mesaj
neutru, fie nimic.

---

## 1. Urgent — afectează vizibil site-ul

### Program de funcționare

**Unde:** `src/data/site.ts` → `openingHours`

Acum site-ul afișează „Program disponibil în curând”, iar pastila
„Deschis acum / Închis acum” nu se calculează deloc.

Completează orele pentru fiecare zi, apoi pune `confirmed: true`:

```ts
openingHours: {
  confirmed: true,                       // ⬅ schimbă în true
  days: [
    { day: 1, label: "Luni", opens: "08:00", closes: "20:00" },
    // `opens: null` înseamnă închis în ziua respectivă
  ],
}
```

De îndată ce este `true`, apar automat: tabelul cu programul, pastila de
stare în hero, în locație și în subsol, plus programul în datele structurate
pentru Google.

### Telefon și e-mail

**Unde:** `src/data/site.ts` → `contact`

Acum secțiunea de contact este ascunsă, iar în subsol scrie
„Detalii de contact disponibile în curând”.

```ts
contact: {
  phone: "+40 7xx xxx xxx",
  email: "contact@exemplu.ro",
}
```

### Rețele sociale

**Unde:** `src/data/site.ts` → `social`

Trebuie **URL-ul complet** al profilului, nu doar numele de utilizator.
Linkurile apar în subsol imediat ce sunt completate.

### Meniu și prețuri

**Unde:** `src/data/menu.ts`

⚠️ **Produsele și prețurile actuale sunt inventate ca exemplu.** Site-ul
afișează vizibil nota „Meniu orientativ” tocmai pentru a nu induce în eroare.

După ce înlocuiești totul cu oferta reală, pune `menuMeta.confirmed = true`
și nota dispare.

---

## 2. Important pentru Google

### Numărul de recenzii

**Unde:** `src/data/reviews.ts` → `rating.count`

Sursele disponibile indicau numere diferite de recenzii, deci nu am afirmat
niciunul. Acum site-ul arată nota 4,9 fără să pretindă un total.

Citește numărul exact din profilul Google și completează-l. Fără el, nota
**nu** intră în datele structurate — `aggregateRating` este invalid fără
`reviewCount`, iar un marcaj invalid poate duce la penalizarea profilului
local.

### Coordonate geografice

**Unde:** `src/data/site.ts` → `geo`

Deschide locația exactă în Google Maps, clic dreapta pe punct, copiază
coordonatele:

```ts
geo: { latitude: 44.31xx, longitude: 23.79xx }
```

Nu le aproxima. Coordonate greșite trimit clienții în altă parte.

### Domeniul real

**Unde:** `src/data/site.ts` → `url`

Acum este `https://meetcoffee.ro`. Dacă domeniul final diferă, actualizează-l
— este folosit pentru adresa canonică, sitemap și previzualizările pe rețele
sociale.

---

## 3. Răspunsuri de confirmat la întrebări frecvente

**Unde:** `src/data/faq.ts`

Următoarele întrebări sunt **ascunse complet** de pe site pentru că răspunsul
depinde de politica reală a cafenelei. Am scris o variantă plauzibilă pentru
fiecare — confirmă sau corectează, apoi șterge linia `needsConfirmation: true`.

| Întrebare | De confirmat |
| --- | --- |
| Aveți opțiuni cu lapte vegetal? | Ce sortimente exact (ovăz, soia, migdale)? Cost suplimentar? |
| Aveți băuturi fără cofeină? | Se oferă espresso decofeinizat? |
| Pot lucra de la laptop? | Este permis? Există restricții de interval orar? |
| Acceptați animale de companie? | Doar pe terasă sau și în interior? |
| Se pot face rezervări? | Se preiau rezervări? Pe ce cale? |

Cele trei întrebări deja publicate (ce înseamnă cafea de specialitate, unde
se află cafeneaua, produse de sezon) nu necesită confirmare.

---

## 4. De verificat

| Element | Observație |
| --- | --- |
| **Textul recenziilor** | Recenziile au fost redate în română ca fragmente. Verifică formularea față de originalele de pe Google și adaugă numele autorilor, dacă vrei să apară. |
| **URL MABO Coffee** | `site.supplier.url` este `null`. Dacă vrei un link către partener, adaugă adresa oficială. |
| **Contextul de zonă** | Textul „Zona centrală a Craiovei, aproape de Centrul Vechi” trebuie confirmat. Nu am inclus indicații despre transport public sau timpi de mers pe jos, pentru că nu au putut fi verificate. |
| **Prețul mediu** | „20–40 lei de persoană” provine din informațiile primite. Confirmă că mai este de actualitate. |

---

## 5. Ce NU a fost inventat

Pentru claritate — următoarele **nu apar nicăieri** pe site, pentru că nu
existau date verificate:

- niciun număr de telefon;
- nicio adresă de e-mail;
- niciun nume de utilizator de Instagram sau Facebook;
- nicio oră de deschidere sau închidere;
- niciun număr total de recenzii;
- nicio coordonată geografică;
- niciun nume de recenzent;
- nicio informație despre transport public sau parcare.
