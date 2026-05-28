import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { KakaoContact } from "@/components/KakaoContact";
import { getProduct, getProductSlugs } from "@/lib/product-queries";
import { categories, type Product } from "@/lib/products";

export async function generateStaticParams() {
  return getProductSlugs();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product: Product | undefined = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const category = categories[product.category];

  return (
    <>
      <Header />
      <main>
        <section className="detail-layout">
          <div className="detail-gallery">
            <div
              className="detail-image"
              style={{ backgroundImage: `url(${product.image})` }}
              aria-label={product.title}
            />
            <div className="detail-gallery-row" aria-label="상품 핵심 정보">
              {product.highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="detail-copy">
            <div className="detail-kicker">
              <Link href={category.href}>{category.label}</Link>
              <span>{product.location}</span>
            </div>
            <h1>{product.title}</h1>
            <p>{product.detail}</p>
            <div className="price-panel">
              <span>상담 기준가</span>
              <strong>{product.price}</strong>
            </div>
            <div className="detail-info-grid">
              <div>
                <h2>포함 및 안내</h2>
                <ul>
                  {product.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>예약 전 확인</h2>
                <p>{product.notice}</p>
              </div>
            </div>
            <a
              className="kakao-cta"
              href={process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || "https://pf.kakao.com/"}
              target="_blank"
              rel="noreferrer"
            >
              카카오톡으로 문의
            </a>
          </div>
        </section>
      </main>
      <KakaoContact />
    </>
  );
}
