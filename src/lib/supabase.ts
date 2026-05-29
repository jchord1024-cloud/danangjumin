import { createClient } from "@supabase/supabase-js";

export type ProductRow = {
  id: string;
  slug: string;
  category: "villas" | "golf" | "guides" | "taxi";
  title: string;
  location: string | null;
  price: string | null;
  summary: string | null;
  image_url: string | null;
  gallery_images: string[] | null;
  detail: string | null;
  highlights: string[] | null;
  includes: string[] | null;
  notice: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductPayload = {
  slug: string;
  category: "villas" | "golf" | "guides" | "taxi";
  title: string;
  location: string | null;
  price: string | null;
  summary: string | null;
  image_url: string | null;
  gallery_images: string[];
  detail: string | null;
  highlights: string[];
  includes: string[];
  notice: string | null;
  is_visible: boolean;
  sort_order: number;
};

export const productImageBucket = "product-images";

export type ReservationRow = {
  id: string;
  user_id: string | null;
  product_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  product_title: string | null;
  travel_date: string | null;
  people_count: number | null;
  status: "pending" | "confirmed" | "done" | "cancelled";
  memo: string | null;
  created_at: string;
  updated_at: string;
};

export type ReservationPayload = {
  customer_name: string;
  customer_phone: string | null;
  product_title: string | null;
  travel_date: string | null;
  people_count: number | null;
  status: ReservationRow["status"];
  memo: string | null;
};

export type ProfileRow = {
  id: string;
  kakao_id: string;
  name: string | null;
  phone?: string | null;
  email: string | null;
  role?: string | null;
  created_at: string;
};

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}
