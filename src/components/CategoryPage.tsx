import { Header } from "@/components/Header";
import { KakaoContact } from "@/components/KakaoContact";
import { ProductCard } from "@/components/ProductCard";
import { getProductsByCategory } from "@/lib/product-queries";
import { categories, type ProductCategory } from "@/lib/products";

export async function CategoryPage({ category }: { category: ProductCategory }) {
  const categoryInfo = categories[category];
  const items = await getProductsByCategory(category);

  return (
    <>
      <Header />
      <main>
        <section
          className="category-hero"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(9, 18, 25, .82), rgba(9, 18, 25, .34)), url(${categoryInfo.image})` }}
        >
          <div>
            <p>{categoryInfo.eyebrow}</p>
            <h1>{categoryInfo.label}</h1>
            <span>{categoryInfo.description}</span>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <p>상품 목록</p>
            <h2>{categoryInfo.label} 예약 상품</h2>
          </div>
          <div className="product-grid">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      </main>
      <KakaoContact />
    </>
  );
}
