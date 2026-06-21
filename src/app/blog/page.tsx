import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="container-page py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Blog
        </p>
        <h1 className="text-3xl font-extrabold text-ink-900">
          Imtihonga tayyorgarlik maqolalari
        </h1>
        <p className="text-sm leading-7 text-ink-700">
          Maqolalar bo&apos;limi tayyorlanmoqda. Hozircha shaxsiy reja va
          mashg&apos;ulotlar bilan ishlash uchun dashboardga o&apos;ting.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center rounded-full bg-brand-500 px-5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Dashboardga o&apos;tish
        </Link>
      </div>
    </main>
  );
}
