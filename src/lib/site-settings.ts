import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase";

export type HomeHeroSettings = {
  eyebrow: string;
  title: string;
  description: string;
  mediaItems: HomeHeroMediaItem[];
  slideDurationMs: number;
};

export type HomeHeroMediaItem = {
  url: string;
  type: "image" | "video";
};

const homeHeroKey = "home_hero";

export const defaultHomeHeroSettings: HomeHeroSettings = {
  eyebrow: "Da Nang Local Reservation Center",
  title: "다낭 여행, 현지처럼 편하게.",
  description:
    "풀빌라, 골프, 가이드, 택시까지 필요한 일정만 골라 다낭주민쎈타에서 빠르게 상담하세요.",
  mediaItems: [
    {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
      type: "image",
    },
  ],
  slideDurationMs: 2000,
};

function parseMediaItems(record: Partial<HomeHeroSettings> & {
  mediaUrl?: string;
  mediaType?: "image" | "video";
}): HomeHeroMediaItem[] {
  if (Array.isArray(record.mediaItems)) {
    const mediaItems = record.mediaItems
      .map((item) => ({
        url: String(item?.url || "").trim(),
        type: (item?.type === "video" ? "video" : "image") as HomeHeroMediaItem["type"],
      }))
      .filter((item) => item.url);

    if (mediaItems.length > 0) {
      return mediaItems;
    }
  }

  if (record.mediaUrl) {
    return [
      {
        url: record.mediaUrl,
        type: record.mediaType === "video" ? "video" : "image",
      },
    ];
  }

  return defaultHomeHeroSettings.mediaItems;
}

function parseHomeHeroSettings(value: unknown): HomeHeroSettings {
  const data = value && typeof value === "object" ? value : {};
  const record = data as Partial<HomeHeroSettings>;
  const slideDurationMs = Number(record.slideDurationMs);

  return {
    eyebrow: record.eyebrow || defaultHomeHeroSettings.eyebrow,
    title: record.title || defaultHomeHeroSettings.title,
    description: record.description || defaultHomeHeroSettings.description,
    mediaItems: parseMediaItems(record),
    slideDurationMs:
      Number.isFinite(slideDurationMs) && slideDurationMs >= 1000
        ? Math.min(slideDurationMs, 30000)
        : defaultHomeHeroSettings.slideDurationMs,
  };
}

export async function getHomeHeroSettings(): Promise<HomeHeroSettings> {
  const supabase = getSupabaseAdminClient() || getSupabaseServerClient();

  if (!supabase) {
    return defaultHomeHeroSettings;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", homeHeroKey)
    .maybeSingle();

  if (error || !data) {
    return defaultHomeHeroSettings;
  }

  return parseHomeHeroSettings(data.value);
}

export async function updateHomeHeroSettings(settings: HomeHeroSettings) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY가 필요합니다.");
  }

  const payload = parseHomeHeroSettings(settings);
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: homeHeroKey,
      value: payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
