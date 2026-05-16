import { redirect } from "next/navigation";

export default async function PreBreakoutStockAliasPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  redirect(`/stocks/${symbol.toUpperCase()}`);
}
