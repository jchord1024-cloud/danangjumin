"use client";

import { useState } from "react";
import { AdminProducts } from "@/components/AdminProducts";
import { AdminReservations } from "@/components/AdminReservations";
import type { ProductRow, ReservationRow } from "@/lib/supabase";

export function LocalDesk({
  products,
  reservations,
}: {
  products: ProductRow[];
  reservations: ReservationRow[];
}) {
  const [tab, setTab] = useState<"products" | "reservations">("products");

  return (
    <>
      <div className="admin-tabs" role="tablist" aria-label="관리 메뉴">
        <button
          type="button"
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          상품관리
        </button>
        <button
          type="button"
          className={tab === "reservations" ? "active" : ""}
          onClick={() => setTab("reservations")}
        >
          예약관리
        </button>
      </div>
      {tab === "products" ? (
        <AdminProducts initialProducts={products} />
      ) : (
        <AdminReservations initialReservations={reservations} />
      )}
    </>
  );
}
