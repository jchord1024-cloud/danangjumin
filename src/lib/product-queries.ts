import {
  getProduct as getStaticProduct,
  getProductsByCategory as getStaticProductsByCategory,
  products as staticProducts,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { getSupabaseServerClient, type ProductRow } from "@/lib/supabase";

function mapProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    category: row.category,
    title: row.title,
    location: row.location || "",
    price: row.price || "",
    summary: row.summary || "",
    image: row.image_url || "",
    galleryImages: row.gallery_images || [],
    highlights: row.highlights || [],
    includes: row.includes || [],
    notice: row.notice || "",
    detail: row.detail || "",
  };
}

export async function getProductsByCategory(
  category: ProductCategory,
): Promise<Product[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return getStaticProductsByCategory(category);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load products from Supabase:", error.message);
    return getStaticProductsByCategory(category);
  }

  return (data || []).map((row) => mapProduct(row as ProductRow));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return getStaticProduct(slug);
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to load product from Supabase:", error.message);
    return getStaticProduct(slug);
  }

  return data ? mapProduct(data as ProductRow) : undefined;
}

export async function getProductSlugs(): Promise<Array<{ slug: string }>> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return staticProducts.map((product) => ({ slug: product.slug }));
  }

  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_visible", true);

  if (error) {
    console.error("Failed to load product slugs from Supabase:", error.message);
    return staticProducts.map((product) => ({ slug: product.slug }));
  }

  return (data || []).map((product) => ({ slug: product.slug as string }));
}
