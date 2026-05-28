"use client";

import { useMemo, useState } from "react";
import type { ProductRow } from "@/lib/supabase";

type FormState = {
  id?: string;
  slug: string;
  category: ProductRow["category"];
  title: string;
  location: string;
  price: string;
  summary: string;
  image_url: string;
  detail: string;
  highlights: string;
  includes: string;
  notice: string;
  is_visible: boolean;
  sort_order: number;
};

const emptyForm: FormState = {
  slug: "",
  category: "villas",
  title: "",
  location: "",
  price: "",
  summary: "",
  image_url: "",
  detail: "",
  highlights: "",
  includes: "",
  notice: "",
  is_visible: true,
  sort_order: 100,
};

const categoryLabels: Record<ProductRow["category"], string> = {
  villas: "풀빌라",
  golf: "골프",
  guides: "가이드",
  taxi: "택시",
};

function productToForm(product: ProductRow): FormState {
  return {
    id: product.id,
    slug: product.slug,
    category: product.category,
    title: product.title,
    location: product.location || "",
    price: product.price || "",
    summary: product.summary || "",
    image_url: product.image_url || "",
    detail: product.detail || "",
    highlights: (product.highlights || []).join("\n"),
    includes: (product.includes || []).join("\n"),
    notice: product.notice || "",
    is_visible: product.is_visible,
    sort_order: product.sort_order,
  };
}

export function AdminProducts({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const selectedTitle = useMemo(
    () => (form.id ? "상품 수정" : "새 상품 등록"),
    [form.id],
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refreshProducts() {
    window.location.reload();
  }

  async function submitProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const endpoint = form.id
      ? `/api/admin/products/${form.id}`
      : "/api/admin/products";
    const method = form.id ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };

    setIsSaving(false);

    if (!response.ok || !result.ok) {
      setMessage(result.message || "저장에 실패했습니다.");
      return;
    }

    setMessage("저장되었습니다.");
    setForm(emptyForm);
    await refreshProducts();
  }

  async function deleteProduct(product: ProductRow) {
    if (!window.confirm(`${product.title} 상품을 삭제할까요?`)) {
      return;
    }

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as { ok: boolean; message?: string };

    if (!response.ok || !result.ok) {
      setMessage(result.message || "삭제에 실패했습니다.");
      return;
    }

    setProducts((current) => current.filter((item) => item.id !== product.id));
    setMessage("삭제되었습니다.");
  }

  async function uploadImage(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as {
      ok: boolean;
      url?: string;
      message?: string;
    };

    setIsUploading(false);

    if (!response.ok || !result.ok || !result.url) {
      setMessage(result.message || "이미지 업로드에 실패했습니다.");
      return;
    }

    updateField("image_url", result.url);
    setMessage("이미지가 업로드되었습니다.");
  }

  return (
    <div className="admin-layout">
      <section className="admin-list" aria-label="상품 목록">
        <div className="admin-section-head">
          <p>Products</p>
          <h2>상품 목록</h2>
        </div>
        <div className="admin-table">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              className={form.id === product.id ? "admin-row active" : "admin-row"}
              onClick={() => setForm(productToForm(product))}
            >
              <span>{categoryLabels[product.category]}</span>
              <strong>{product.title}</strong>
              <em>{product.is_visible ? "노출" : "숨김"}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="admin-editor" aria-label={selectedTitle}>
        <div className="admin-section-head">
          <p>Editor</p>
          <h2>{selectedTitle}</h2>
        </div>
        <form onSubmit={submitProduct} className="admin-form">
          <label>
            상품명
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
            />
          </label>
          <div className="admin-two-col">
            <label>
              카테고리
              <select
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value as ProductRow["category"])
                }
              >
                <option value="villas">풀빌라</option>
                <option value="golf">골프</option>
                <option value="guides">가이드</option>
                <option value="taxi">택시</option>
              </select>
            </label>
            <label>
              정렬순서
              <input
                type="number"
                value={form.sort_order}
                onChange={(event) => updateField("sort_order", Number(event.target.value))}
              />
            </label>
          </div>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(event) => updateField("slug", event.target.value)}
              placeholder="english-slug"
              required
            />
          </label>
          <div className="admin-two-col">
            <label>
              위치
              <input
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
              />
            </label>
            <label>
              가격
              <input
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
              />
            </label>
          </div>
          <label>
            대표 이미지 URL
            <input
              value={form.image_url}
              onChange={(event) => updateField("image_url", event.target.value)}
            />
          </label>
          <label>
            대표 이미지 업로드
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                void uploadImage(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          {form.image_url ? (
            <div
              className="admin-image-preview"
              style={{ backgroundImage: `url(${form.image_url})` }}
              aria-label="대표 이미지 미리보기"
            />
          ) : null}
          <label>
            요약
            <textarea
              rows={2}
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
            />
          </label>
          <label>
            상세 설명
            <textarea
              rows={4}
              value={form.detail}
              onChange={(event) => updateField("detail", event.target.value)}
            />
          </label>
          <div className="admin-two-col">
            <label>
              핵심 정보
              <textarea
                rows={5}
                value={form.highlights}
                onChange={(event) => updateField("highlights", event.target.value)}
                placeholder={"한 줄에 하나씩 입력"}
              />
            </label>
            <label>
              포함 및 안내
              <textarea
                rows={5}
                value={form.includes}
                onChange={(event) => updateField("includes", event.target.value)}
                placeholder={"한 줄에 하나씩 입력"}
              />
            </label>
          </div>
          <label>
            예약 전 확인
            <textarea
              rows={3}
              value={form.notice}
              onChange={(event) => updateField("notice", event.target.value)}
            />
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.is_visible}
              onChange={(event) => updateField("is_visible", event.target.checked)}
            />
            홈페이지 노출
          </label>
          {message ? <p className="admin-message">{message}</p> : null}
          <div className="admin-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving ? "저장 중" : "저장"}
            </button>
            {isUploading ? <span className="admin-uploading">이미지 업로드 중</span> : null}
            <button type="button" onClick={() => setForm(emptyForm)}>
              새 상품
            </button>
            {form.id ? (
              <button
                type="button"
                className="danger"
                onClick={() => {
                  const product = products.find((item) => item.id === form.id);
                  if (product) {
                    void deleteProduct(product);
                  }
                }}
              >
                삭제
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
