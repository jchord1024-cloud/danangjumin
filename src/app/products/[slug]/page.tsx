import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { KakaoContact } from "@/components/KakaoContact";
import { getProduct } from "@/lib/product-queries";
import { categories, type Product } from "@/lib/products";

export const dynamic = "force-dynamic";

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
  const [primaryHighlight] = product.highlights;
  const galleryImages =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.image].filter(Boolean);
  const bookingSteps = [
    {
      title: "예약 날짜 확인",
      description: "원하시는 이용 날짜와 인원 가능 여부를 먼저 확인해주세요.",
    },
    {
      title: "카카오톡 상담",
      description: "인원, 일정, 옵션 서비스를 알려주시면 맞춤형으로 안내드립니다.",
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
  const featureItems = [...product.highlights, ...product.includes].slice(0, 8);
  const benefitItems = [
    "카카오톡 빠른 상담",
    "일정과 인원에 맞춘 현지 안내",
    "예약 확정 후 정보 페이지 제공",
  ];

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
          {product.highlights.map((item) => (
            <div key={item}>
              <span>Point</span>
              <strong>{item}</strong>
            </div>
          ))}
        </section>

        <section className="detail-story section">
          <div className="detail-story-copy">
            <p>{category.label} Selection</p>
            <h2>{primaryHighlight || product.title}</h2>
            <span>{product.detail}</span>
          </div>
          <div className="detail-story-panel">
            <strong>{product.title}</strong>
            <p>
              다낭주민쎈타가 일정, 이동, 상담 동선까지 함께 확인해 처음 예약하는
              고객도 편하게 결정할 수 있도록 안내합니다.
            </p>
          </div>
        </section>

        {galleryImages.length > 0 ? (
          <section className="detail-gallery-section section">
            <div className="section-head">
              <p>Gallery</p>
              <h2>공간을 미리 확인하세요</h2>
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
            {featureItems.slice(0, 3).map((item, index) => (
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
            <p>Features</p>
            <h2>포함 및 안내</h2>
            <span>예약 전 확인하면 좋은 핵심 항목입니다.</span>
          </div>
          <div className="detail-check-list">
            {featureItems.map((item) => (
              <div key={item}>
                <span>✅</span>
                <strong>{item}</strong>
              </div>
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

        <section className="detail-guide section">
          <div className="detail-guide-image" style={{ backgroundImage: `url(${product.image})` }} />
          <div className="detail-guide-copy">
            <p>Booking Guide</p>
            <h2>문의부터 확정까지 편하게 안내합니다.</h2>
            <div className="detail-guide-list">
              <div>
                <span>01</span>
                <strong>희망 일정 전달</strong>
                <p>날짜, 인원, 숙소 위치나 원하는 조건을 카카오톡으로 보내주세요.</p>
              </div>
              <div>
                <span>02</span>
                <strong>가능 여부 확인</strong>
                <p>현지 상황과 예약 가능 여부를 확인해 가장 알맞은 옵션을 안내합니다.</p>
              </div>
              <div>
                <span>03</span>
                <strong>예약정보 확인</strong>
                <p>확정된 예약은 예약정보 페이지에서 이름과 연락처로 조회할 수 있습니다.</p>
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

        <section className="detail-card-section">
          <div className="detail-card-head">
            <p>Notice</p>
            <h2>예약 전 꼭 확인해주세요</h2>
            <span>보다 편하고 안전한 이용을 위해 아래 내용을 확인해주세요.</span>
          </div>
          <div className="detail-soft-list">
            <article className="detail-soft-card">
              <span className="detail-icon">📌</span>
              <div>
                <strong>예약 가능 여부 확인</strong>
                <p>{product.notice}</p>
              </div>
            </article>
            {benefitItems.map((item, index) => (
              <article key={item} className="detail-soft-card">
                <span className="detail-icon">{["💬", "🧭", "🎁"][index]}</span>
                <div>
                  <strong>{item}</strong>
                  <p>예약 확정 전 필요한 내용을 카카오톡으로 다시 안내드립니다.</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <KakaoContact />
    </>
  );
}
