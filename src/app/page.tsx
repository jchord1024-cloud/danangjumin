import Link from "next/link";
import { Header } from "@/components/Header";
import { HomeHero } from "@/components/HomeHero";
import { KakaoContact } from "@/components/KakaoContact";
import { getHomeHeroSettings } from "@/lib/site-settings";
import { categories } from "@/lib/products";

const categoryKeys = ["villas", "golf", "guides", "taxi"] as const;

export const dynamic = "force-dynamic";

export default async function Home() {
  const homeHeroSettings = await getHomeHeroSettings();

  return (
    <>
      <Header overlay />
      <main>
        <HomeHero settings={homeHeroSettings} />

        <section className="home-middle-copy">
          <p>{homeHeroSettings.middleText}</p>
        </section>

        <section className="category-links" aria-label="예약 카테고리">
          {categoryKeys.map((key) => {
            const item = categories[key];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="category-tile"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(9, 18, 25, .14), rgba(9, 18, 25, .78)), url(${item.image})` }}
              >
                <p>{item.eyebrow}</p>
                <h2>{item.label}</h2>
                <span>{item.description}</span>
              </Link>
            );
          })}
        </section>
      </main>
      <KakaoContact />
    </>
  );
}
