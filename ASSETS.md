# Resurse vizuale — cum au fost create și cum se înlocuiesc

---

## 1. Situația actuală, pe scurt

| Resursă | Stare | Sursă |
| --- | --- | --- |
| Cadrul introducerii | generat | Higgsfield MCP (`nano_banana_pro`) |
| Bobul de cafea decupat | derivat | decupat din cadrul de mai sus, cu `sharp` |
| Cele 8 imagini din galerie | generate | OpenAI `gpt-image` prin MCP local |
| Siglă MeetCoffee | **lipsă** | se folosește un logotip tipografic |
| Fotografii reale din cafenea | **lipsă** | de furnizat de proprietar |
| Video cinematografic | **nu a fost generat** | vezi secțiunea 3 |

Toate imaginile generate sunt substitute. Trebuie înlocuite cu fotografii
reale înainte de publicarea finală.

---

## 2. De ce introducerea nu este un fișier video

Cerința inițială prevedea un video cinematografic generat cu Higgsfield.
**Serverul Higgsfield era disponibil și a fost folosit — dar numai pentru
imagini.** Generarea de video este blocată pe planul gratuit al contului:

```
403  job_minimum_basic_plan_required
```

Eroarea a apărut identic pe `kling3_0_turbo` și pe `minimax_hailuo`. Contul
avea 10 credite; generarea imaginii-sursă a consumat 2.

### Ce s-a făcut în schimb

Un singur cadru fotorealist a fost generat cu Higgsfield, iar mișcarea este
**simulată în timp real în browser**, cu un shader WebGL: unde concentrice
pornind din punctul de impact, reflexii pe crestele undelor și desfacerea
imaginii în două panouri de cortină.

Rezultatul nu este un compromis pe toate planurile — pe majoritatea este mai
bun decât un video:

| | Video de 5 s | Soluția actuală |
| --- | --- | --- |
| Greutate | 4–8 MB | **~120 kB** (o imagine WebP) |
| Se adaptează la orice format de ecran | nu (crop fix) | **da** (shaderul recalculează) |
| Se poate întrerupe la orice cadru | greu | **da, instantaneu** |
| Cost de regenerare | credite per variantă | **zero** |
| Realismul fizic al lichidului | mai mare | mai stilizat |

Singurul dezavantaj real este că mișcarea lichidului este stilizată, nu
filmată.

### Trecerea la video, dacă apare unul

Structura o permite fără să rescrii logica. În
`src/components/intro/CinematicIntro.tsx`, elementul `<img ref={posterRef}>`
se înlocuiește cu un `<video>`, iar `CoffeeSurface.create()` primește nodul
video în locul imaginii — `texImage2D` acceptă ambele. Cortina și cronologia
rămân neschimbate.

Specificațiile recomandate pentru un asemenea video:

| | Desktop | Mobil |
| --- | --- | --- |
| Rezoluție | 1920×1080 (sau 2560×1440) | 1080×1350 sau 1080×1920 |
| Cadre pe secundă | 24 sau 30 | 24 sau 30 |
| Durată | 4–7 s | 4–7 s |
| Format principal | WebM (VP9) | WebM (VP9) |
| Format de rezervă | MP4 (H.264) | MP4 (H.264) |
| Greutate țintă | sub 6–8 MB | sub 3–5 MB |
| Compoziție | ceașca **centrată**, cu spațiu liber pe margini | ceașca centrată pe verticală |
| Sunet | fără | fără |

Numele de fișiere așteptate: `intro-desktop.webm`, `intro-desktop.mp4`,
`intro-mobile.webm`, `intro-mobile.mp4`, în `public/video/`.

Comenzi de export (necesită `ffmpeg`, care **nu** este instalat în acest
mediu):

```bash
ffmpeg -i sursa.mov -c:v libvpx-vp9 -crf 34 -b:v 0 -an -vf scale=1920:-2 intro-desktop.webm
ffmpeg -i sursa.mov -c:v libx264 -crf 24 -preset slow -an -vf scale=1920:-2 intro-desktop.mp4
```

---

## 3. Cadrul introducerii

**Model:** Higgsfield `nano_banana_pro` · 1376×768 · 2 credite

Promptul folosit (rezumat): cadru macro de sus, ceașcă ceramică mată cu cafea
foarte închisă, inel de cremă la margine, un bob suspendat deasupra centrului,
boabe împrăștiate pe ardezie, lumină caldă de studio, fără text, fără mâini,
fără logo-uri.

### Fișiere produse

| Fișier | Rol | Dimensiune |
| --- | --- | --- |
| `assets-source/intro-source.png` | cadrul original, nemodificat | 1376×768 |
| `intro-plate-desktop.webp` | textura shaderului **și** cadrul-poster | 1600 lățime |
| `intro-plate-mobile.webp` | aceeași scenă, decupaj portret centrat | 1000 lățime |
| `intro-bean.webp` | bobul decupat, cu margine estompată | 220 lățime |
| `intro-fallback.webp` | fundalul secțiunii hero | 1800 lățime |

> **Nu există fișier `intro-poster-*.webp` separat, intenționat.**
> Elementul `<img>` pe care îl pictează browserul primul este exact același
> nod pe care WebGL îl încarcă apoi ca textură. Astfel schimbul dintre poster
> și canvas este identic la nivel de pixel: fără cadru negru, fără reîncadrare.
> Un poster separat ar fi doar un fișier în plus de ținut sincronizat.

### Cum au fost derivate

`scripts/prepare-assets.mjs` face două lucruri neevidente:

1. **Șterge bobul din cadru.** Suprafața de sub bob este un gradient neted de
   reflexie. Scriptul ia câte o coloană îngustă de pixeli din stânga și din
   dreapta bobului, le întinde peste zonă și le amestecă orizontal. Clonarea
   unui bloc întreg — abordarea evidentă — târăște după ea marginea luminoasă
   a reflexiei și se vede ca o pată.
2. **Decupează bobul** cu o mască eliptică estompată, ca să se poată așeza
   invizibil peste lichidul închis la culoare, oriunde ar ateriza.

### Dacă înlocuiești cadrul-sursă

Pune noua imagine în `assets-source/intro-source.png` — **în afara folderului
`public/`**, ca fișierul original, de câțiva megabytes, să nu ajungă servit
vizitatorilor. Apoi **actualizează constantele geometrice** din capul
scriptului:

```js
const BEAN  = { left: 638, top: 262, width: 108, height: 112 }; // caseta bobului
const PATCH = { cx: 691, cy: 350, rx: 82, ry: 125 };            // zona de acoperit
```

Apoi, în `src/components/intro/coffeeSurface.ts`:

```ts
export const CUP_CENTER   = { x: 0.502, y: 0.475 }; // centrul ceștii, 0–1
export const LIQUID_RADIUS = 0.219;                 // raza discului de lichid
```

`CUP_CENTER` spune shaderului de unde pornesc undele și unde aterizează bobul.
`LIQUID_RADIUS` limitează undele la lichid — dacă e prea mare, se unduiește și
marginea de ceramică, iar iluzia se pierde imediat.

Rulează apoi:

```bash
npm run assets
```

---

## 4. Galeria

Cele 8 imagini au fost generate cu `gpt-image` și convertite în WebP
(calitate 78, maximum 1600 px pe latura lungă). Fiecare are 37–75 kB.

### Ce trebuie fotografiat în realitate

| Fișier | Ce înlocuiește |
| --- | --- |
| `interior-01.webp` | interiorul cafenelei, lumină naturală |
| `terrace.webp` | terasa și strada, dimineața devreme |
| `latte-art.webp` | turnarea laptelui, cadru apropiat |
| `extraction.webp` | espresso curgând din espressor |
| `beans.webp` | boabele folosite, prim-plan |
| `v60.webp` | prepararea la filtru |
| `meeting.webp` | oameni la masă (cu acordul lor) |
| `pastries.webp` | produsele de patiserie oferite |

### Cum se înlocuiesc

1. Pune fotografia în `public/images/gallery/`, cu **același nume de fișier**.
2. În `src/data/gallery.ts`, actualizează `alt` (descriere reală, în română),
   `caption`, `width` și `height`.
3. Pune `generated: false`. Când toate imaginile au `false`, nota „fotografii
   de prezentare” dispare automat de pe site.
4. Rulează `npm run assets` ca să le optimizeze.

**Atenție la raport:** `width` și `height` trebuie să fie cele reale. Sunt
folosite pentru a rezerva spațiul înainte de încărcare — dacă sunt greșite,
pagina va sări la derulare.

---

## 5. Ce lipsește complet

| Resursă | De ce contează |
| --- | --- |
| **Sigla MeetCoffee** (SVG sau PNG transparent, ≥1000 px) | Acum se folosește un logotip tipografic în antet, subsol și introducere. |
| **Imagine de partajare socială** (1200×630) | Acum se folosește cadrul introducerii. Funcțional, dar nu conține numele. |
| **Favicon propriu** | Rămâne cel implicit din `src/app/favicon.ico`. |
| **Fotografii reale** | Vezi tabelul de la secțiunea 4. |
| **Materiale MABO Coffee aprobate** | Nu a fost folosit niciun element de brand MABO, tocmai pentru a nu încălca drepturi de autor. Se pot adăuga doar cu acordul scris al MABO. |

Când primești sigla: pune-o în `public/images/` și înlocuiește logotipul
tipografic din `SiteHeader.tsx`, `SiteFooter.tsx` și `CinematicIntro.tsx`.
Nu deforma sigla — folosește `object-contain` și păstrează raportul original.
