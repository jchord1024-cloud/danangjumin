import { CategoryPage } from "@/components/CategoryPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function VillasPage() {
  return <CategoryPage category="villas" />;
}
