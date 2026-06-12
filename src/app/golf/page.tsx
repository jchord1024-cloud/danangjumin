import { CategoryPage } from "@/components/CategoryPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function GolfPage() {
  return <CategoryPage category="golf" />;
}
