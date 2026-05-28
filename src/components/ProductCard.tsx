import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} aria-label={`${product.title} 상세 보기`}>
        <div
          className="product-image"
          style={{ backgroundImage: `url(${product.image})` }}
        />
        <div className="product-body">
          <p>{product.location}</p>
          <h3>{product.title}</h3>
          <span>{product.summary}</span>
          <strong>{product.price}</strong>
        </div>
      </Link>
    </article>
  );
}
