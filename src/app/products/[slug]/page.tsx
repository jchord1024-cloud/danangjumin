import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { KakaoContact } from "@/components/KakaoContact";
import { getProduct } from "@/lib/product-queries";
import { categories, type Product } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const galleryImages =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.image].filter(Boolean);
  const bookingSteps = [
    {
      title: "카카오톡 상담",
      description: "인원, 일정, 옵션 서비스를 알려주시면 맞춤형으로 안내드립니다.",
    },
    {
      title: "예약 날짜 확인",
      description: "원하시는 이용 날짜와 인원 가능 여부를 먼저 확인해주세요.",
    },
    {
      title: "최종 정보 확정",
      description: "날짜, 인원, 요금, 포함사항을 함께 확인한 뒤 예약 내용을 확정합니다.",
    },
    {
      title: "예약정보 확인",
      description: "확정된 예약은 예약정보 페이지에서 예약자명과 연락처로 확인할 수 있습니다.",
    },
  ];
  const highlightItems = product.highlights.slice(0, 3);

  return (
    <>
      <Header />
      <main className="detail-page">
        <section
          className="detail-hero"
          style={{ backgroundImage: `url(${product.image})` }}
        >
          <div className="detail-hero-overlay">
            <div className="detail-hero-copy">
              <div className="detail-kicker">
                <Link href={category.href}>{category.label}</Link>
                <span>{product.location}</span>
              </div>
              <p>{category.eyebrow}</p>
              <h1>{product.title}</h1>
              <span>{product.summary}</span>
            </div>
            <aside className="detail-booking-panel" aria-label="예약 요약">
              <span>상담 기준가</span>
              <strong>{product.price}</strong>
              <p>희망 날짜와 인원을 알려주시면 가능 여부와 최종 금액을 빠르게 확인해드립니다.</p>
              <a
                className="kakao-cta"
                href={
                  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ||
                  "https://pf.kakao.com/"
                }
                target="_blank"
                rel="noreferrer"
              >
                카카오톡으로 문의
              </a>
            </aside>
          </div>
        </section>

        <section className="detail-summary-band" aria-label="상품 핵심 정보">
          <div>
            <span>Location</span>
            <strong>{product.location}</strong>
          </div>
        </section>


        {galleryImages.length > 0 ? (
          <section className="detail-gallery-section section">
            <div className="section-head">
              <p>Gallery</p>
              <span>대표 사진과 추가 갤러리로 분위기와 공간감을 살펴볼 수 있습니다.</span>
            </div>
            <div className="detail-gallery-grid">
              {galleryImages.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={index === 0 ? "wide" : ""}
                  style={{ backgroundImage: `url(${image})` }}
                  aria-label={`${product.title} 갤러리 ${index + 1}`}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="detail-card-section">
          <div className="detail-card-head">
            <p>Why This Choice</p>
            <h2>이 상품의 매력 포인트</h2>
            <span>{product.summary}</span>
          </div>
          <div className="detail-soft-list">
            {highlightItems.map((item, index) => (
              <article key={item} className="detail-soft-card">
                <span className="detail-icon">{["🌴", "🌊", "✨"][index] || "✓"}</span>
                <div>
                  <strong>{item}</strong>
                  <p>상담 시 세부 조건과 이용 가능 여부를 함께 확인해드립니다.</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="detail-card-section">
          <div className="detail-card-head">
            <p>Reservation Guide</p>
            <h2>예약 방법 안내</h2>
            <span>아래 순서대로 진행해주시면 빠르게 예약을 도와드립니다.</span>
          </div>
          <div className="detail-step-list">
            {bookingSteps.map((step, index) => (
              <article key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="detail-card-section">
          <div className="detail-card-head">
            <p>Cancellation Policy</p>
            <h2>환불 안내</h2>
            <span>예약 취소 시점에 따라 아래 기준으로 환불이 진행됩니다.</span>
          </div>
          <div className="refund-policy-card">
            <div className="refund-policy-row refund-policy-head">
              <strong>예약 취소 요청</strong>
              <strong>환불 금액</strong>
            </div>
            <div className="refund-policy-row">
              <span>체크인 기준 30일 전</span>
              <strong>100% 환불</strong>
            </div>
            <div className="refund-policy-row">
              <span>15일 ~ 29일 전</span>
              <strong>50% 환불</strong>
            </div>
            <div className="refund-policy-row">
              <span>15일 이내</span>
              <strong>환불 불가</strong>
            </div>
          </div>
          <div className="refund-policy-note">
            <strong>꼭 확인해주세요</strong>
            <p>
              환불 기준은 체크인 날짜를 기준으로 계산됩니다. 예약 변경 및 취소는
              상담 채널을 통해 접수된 시점을 기준으로 처리됩니다.
            </p>
          </div>
        </section>
      </main>
      <KakaoContact />
    </>
  );
}
