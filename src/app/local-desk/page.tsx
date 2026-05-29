import Link from "next/link";
import { LocalDesk } from "@/components/LocalDesk";
import {
  listAdminProfiles,
  listAdminReservations,
} from "@/lib/admin-reservations";
import { listAdminProducts } from "@/lib/admin-products";
import type { ProductRow, ProfileRow, ReservationRow } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function LocalDeskPage() {
  let products: ProductRow[] = [];
  let reservations: ReservationRow[] = [];
  let profiles: ProfileRow[] = [];
  let errorMessage = "";

  try {
    [products, reservations, profiles] = await Promise.all([
      listAdminProducts(),
      listAdminReservations(),
      listAdminProfiles(),
    ]);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "상품 목록을 불러오지 못했습니다.";
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p>Joomin CCenter</p>
          <h1>다낭주민쎈타 관리 센터</h1>
        </div>
        <Link href="/">홈으로</Link>
      </header>

      {errorMessage ? (
        <section className="admin-empty">
          <strong>관리자 연결 설정이 필요합니다.</strong>
          <p>{errorMessage}</p>
        </section>
      ) : (
        <LocalDesk
          products={products}
          reservations={reservations}
          profiles={profiles}
        />
      )}
    </main>
  );
}
