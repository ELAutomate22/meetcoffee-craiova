import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="continut-principal"
      tabIndex={-1}
      className="flex min-h-[100svh] items-center focus-visible:outline-none"
    >
      <div className="container-page text-center">
        <p className="eyebrow">Eroare 404</p>
        <h1 className="mt-6 text-4xl text-ivory sm:text-6xl">
          Pagina asta nu există.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted">
          S-ar putea să fi fost mutată sau linkul să fie greșit. Cafeaua, în
          schimb, e la locul ei.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block rounded-[999px] bg-crema px-8 py-4 font-medium text-espresso transition-transform duration-300 hover:scale-[1.03] hover:bg-ivory"
        >
          Înapoi la pagina principală
        </Link>
      </div>
    </main>
  );
}
