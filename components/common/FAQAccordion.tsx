export default function FAQAccordion({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <summary className="cursor-pointer list-none font-medium text-white">
            {item.question}
          </summary>
          <p className="mt-3 text-sm leading-6 text-slate-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
