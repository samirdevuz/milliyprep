import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const COLUMNS = [
  {
    title: "Mahsulot",
    links: [
      { href: "#imkoniyatlar", label: "Imkoniyatlar" },
      { href: "#kurslar", label: "Mahsulot" },
      { href: "#narxlar", label: "Narxlar" },
    ],
  },
  {
    title: "Kompaniya",
    links: [
      { href: "/about", label: "Biz haqimizda" },
      { href: "/blog", label: "Blog" },
      { href: "mailto:salom@milliyprep.xyz", label: "Aloqa" },
    ],
  },
  {
    title: "Huquqiy",
    links: [
      { href: "/privacy", label: "Maxfiylik siyosati" },
      { href: "/terms", label: "Foydalanish shartlari" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-50/60">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm text-ink-600">
              Milliy Sertifikatga eng samarali yo&apos;l. Shaxsiy reja,
              mavzuli mashqlar va AI tutor — bir joyda.
            </p>
            <div className="flex gap-3 text-sm">
              <Link
                href="https://t.me/milliyprep"
                className="rounded-full bg-white px-3 py-1.5 ring-1 ring-ink-200 transition hover:bg-ink-50"
              >
                Telegram
              </Link>
              <Link
                href="https://instagram.com/milliyprep"
                className="rounded-full bg-white px-3 py-1.5 ring-1 ring-ink-200 transition hover:bg-ink-50"
              >
                Instagram
              </Link>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-700 transition hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-500 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} MilliyPrep. Barcha huquqlar
            himoyalangan.
          </p>
          <p className="max-w-xl md:text-right">
            Milliy Sertifikat — O&apos;zbekiston Respublikasi Bilim va
            malakalarni baholash agentligining rasmiy imtihoni. MilliyPrep —
            mustaqil tayyorlov platformasi.
          </p>
        </div>
      </div>
    </footer>
  );
}
