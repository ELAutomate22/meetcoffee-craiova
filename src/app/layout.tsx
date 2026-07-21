import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

/**
 * Serifă editorială pentru titluri. `latin-ext` este obligatoriu:
 * fără el, diacriticele românești (ă, â, î, ș, ț) ar fi luate de browser din
 * altă fontă, iar textul ar arăta neuniform.
 */
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-fraunces",
});

/** Sans modernă, foarte lizibilă, pentru navigație și text curent. */
const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "MeetCoffee Craiova — cafea de specialitate și un loc de întâlnire",
    template: "%s · MeetCoffee Craiova",
  },
  description:
    "Cafenea de specialitate în centrul Craiovei. Cafea preparată atent, atmosferă relaxată și un spațiu creat pentru întâlniri și conversații bune.",
  keywords: [
    "cafea de specialitate Craiova",
    "cafenea Craiova",
    "specialty coffee Craiova",
    "MeetCoffee",
    "cafenea centrul Craiovei",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: site.url,
    siteName: site.name,
    title: "MeetCoffee Craiova — cafeaua care ne aduce împreună",
    description:
      "Cafea de specialitate preparată atent, într-un loc gândit pentru dimineți liniștite și întâlniri care contează.",
    images: [
      {
        url: "/images/intro/intro-fallback.webp",
        width: 1800,
        height: 1005,
        alt: "Ceașcă de cafea de specialitate văzută de sus, cu boabe de cafea în jur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetCoffee Craiova — cafeaua care ne aduce împreună",
    description: "Cafea de specialitate preparată atent, în centrul Craiovei.",
    images: ["/images/intro/intro-fallback.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#160e0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ro"
      // Next.js 16 nu mai suprascrie derularea lină decât dacă i-o cerem.
      data-scroll-behavior="smooth"
      // Scriptul de mai jos adaugă `data-js` pe <html> înainte de hidratare,
      // deci serverul și clientul diferă intenționat pe acest atribut.
      suppressHydrationWarning
      className={`${fraunces.variable} ${manrope.variable}`}
    >
      <head>
        {/*
          Cadrul de introducere este cel mai mare element pictat la prima
          vizită, deci îl cerem devreme. Fiecare variantă are `media`, ca
          telefoanele să nu descarce imaginea de desktop.
        */}
        <link
          rel="preload"
          as="image"
          href="/images/intro/intro-plate-desktop.webp"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/intro/intro-plate-mobile.webp"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        {/*
          Marchează documentul ca „are JavaScript” înainte de prima pictare.
          Elementele care apar la derulare pornesc ascunse doar în acest caz,
          deci fără JS textul rămâne vizibil în loc să dispară definitiv.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.js="true"`,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
