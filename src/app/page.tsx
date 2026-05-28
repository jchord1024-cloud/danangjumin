import Link from "next/link";
import { Header } from "@/components/Header";
import { KakaoContact } from "@/components/KakaoContact";
import { categories } from "@/lib/products";

const categoryKeys = ["villas", "golf", "guides", "taxi"] as const;

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <p>Da Nang Local Reservation Center</p>
            <h1>다낭 여행, 현지처럼 편하게.</h1>
            <span>
              풀빌라, 골프, 가이드, 택시까지 필요한 일정만 골라 다낭주민쎈타에서 빠르게 상담하세요.
            </span>
          </div>
          <div className="hero-actions">
            <Link href="/villas">상품 둘러보기</Link>
            <Link href="/reservation">예약정보 확인</Link>
          </div>
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
