import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/common/PageHero";
import ImportantDisclaimer from "@/components/common/ImportantDisclaimer";
import FAQAccordion from "@/components/common/FAQAccordion";
import RelatedLinks from "@/components/common/RelatedLinks";
import {
  featuredLessonIds,
  learnCategories,
  learnLessons,
  type LearnLesson,
} from "@/lib/content/learn";

export const metadata: Metadata = {
  title: "Learn Swing Trading Research - Patterns and Risk",
  description: "Educational guides for scanner methodology, patterns, breadth, relative strength, and responsible risk framing.",
};

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { lesson } = await searchParams;
  const activeLesson =
    learnLessons.find((item) => item.id === lesson) ??
    learnLessons.find((item) => item.id === "intro-swing-vs-day") ??
    learnLessons[0];

  const featured = featuredLessonIds
    .map((id) => learnLessons.find((lessonItem) => lessonItem.id === id))
    .filter((item): item is LearnLesson => Boolean(item));

  const lessonFaq = activeLesson.faq;

  return (
    <main>
      <PageHero
        eyebrow="Learn"
        title="Learn Swing Trading Research"
        subtitle="Pattern guides, scanner methodology, market-context notes, and risk framing for responsible NSE research."
      />
      <section className="container py-8">
        <ImportantDisclaimer />
      </section>

      <section className="container pb-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((item) => (
            <Link
              key={item.id}
              href={`/learn?lesson=${item.id}`}
              className={`rounded-3xl border p-5 transition ${item.id === activeLesson.id ? "border-cyan-400/40 bg-cyan-500/10" : "border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-white/10"}`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.category}</p>
              <h2 className="mt-3 text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
              <p className="mt-4 text-xs text-cyan-200">{item.readTime}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container grid gap-6 pb-10 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Lesson menu</p>
          <div className="mt-4 space-y-6">
            {learnCategories.map((category) => {
              const items = learnLessons.filter((lessonItem) => lessonItem.category === category);
              return (
                <div key={category}>
                  <h2 className="text-sm font-semibold text-white">{category}</h2>
                  <div className="mt-3 space-y-2">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/learn?lesson=${item.id}`}
                        className={`block rounded-2xl px-3 py-3 text-sm transition ${item.id === activeLesson.id ? "bg-cyan-500/10 text-cyan-100" : "bg-slate-950/50 text-slate-300 hover:bg-slate-950 hover:text-white"}`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              {activeLesson.category}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {activeLesson.readTime}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black text-white">{activeLesson.title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">{activeLesson.summary}</p>

          <div className="mt-8 space-y-8">
            {activeLesson.sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-slate-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeLesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Suggested research flow</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <p>1. Read the lesson definitions and failure cases.</p>
              <p>2. Open a live scanner page and compare evidence tags.</p>
              <p>3. Check Nifty breadth and sector leadership before over-weighting one symbol.</p>
              <p>4. Document your own risk boundary before acting on any research candidate.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Research-only note</p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Lessons explain vocabulary and model context. They do not provide recommendations, certainty, or personalized advice.
            </p>
          </div>
        </aside>
      </section>

      <section className="container pb-10">
        <FAQAccordion items={lessonFaq} />
      </section>

      <section className="container pb-10">
        <RelatedLinks
          links={[
            { href: "/patterns/vcp", title: "VCP Guide", description: "Understand contraction-led bases and quieter volume." },
            { href: "/patterns/high-tight-flag", title: "High Tight Flag", description: "Explore momentum continuation and volatility risk." },
            { href: "/how-we-scan-stocks", title: "How We Scan Stocks", description: "See the platform philosophy and data vocabulary." },
            { href: "/pre-breakout", title: "Pre-Breakout Scanner", description: "Compare lesson concepts against live research rows." },
          ]}
        />
      </section>
    </main>
  );
}
