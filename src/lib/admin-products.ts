import {
  getSupabaseAdminClient,
  type ProductPayload,
  type ProductRow,
} from "@/lib/supabase";

const categories = ["villas", "golf", "guides", "taxi"] as const;

function parseList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseProductPayload(body: Record<string, unknown>): ProductPayload {
  const title = String(body.title || "").trim();
  const rawSlug = String(body.slug || title).trim();
  const slug = normalizeSlug(rawSlug);
  const category = String(body.category || "");

  if (!title) {
    throw new Error("상품명을 입력하세요.");
  }

  if (!slug) {
    throw new Error("영문 slug를 입력하세요.");
  }

  if (!categories.includes(category as ProductPayload["category"])) {
    throw new Error("카테고리를 선택하세요.");
  }

  return {
    slug,
    category: category as ProductPayload["category"],
    title,
    location: String(body.location || "").trim() || null,
    price: String(body.price || "").trim() || null,
    summary: String(body.summary || "").trim() || null,
    image_url: String(body.image_url || "").trim() || null,
    detail: String(body.detail || "").trim() || null,
    highlights: parseList(body.highlights),
    includes: parseList(body.includes),
    notice: String(body.notice || "").trim() || null,
    is_visible: Boolean(body.is_visible),
    sort_order: Number(body.sort_order || 0),
  };
}

export async function listAdminProducts(): Promise<ProductRow[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as ProductRow[];
}

export async function createAdminProduct(payload: ProductPayload) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
  }

  const { error } = await supabase.from("products").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateAdminProduct(id: string, payload: ProductPayload) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
  }

  const { error } = await supabase
    .from("products")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteAdminProduct(id: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
