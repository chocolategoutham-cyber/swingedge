import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  metrics,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  metrics?: ReactNode;
}) {
  return (
    <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.25),_transparent_30%),linear-gradient(180deg,_#06111f,_#091421)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          {subtitle}
        </p>
        {metrics ? <div className="mt-8">{metrics}</div> : null}
      </div>
    </section>
  );
}
