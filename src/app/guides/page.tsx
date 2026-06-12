import { CategoryPage } from "@/components/CategoryPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function GuidesPage() {
  return <CategoryPage category="guides" />;
}
