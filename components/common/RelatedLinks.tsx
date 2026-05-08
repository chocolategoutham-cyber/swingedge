import Link from "next/link";

export default function RelatedLinks({
  links,
}: {
  links: Array<{ href: string; title: string; description: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/40 hover:bg-white/10"
        >
          <p className="font-medium text-white">{link.title}</p>
          <p className="mt-2 text-sm text-slate-400">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}
