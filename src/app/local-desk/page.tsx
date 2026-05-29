import Link from "next/link";
import { LocalDesk } from "@/components/LocalDesk";
import { listAdminReservations } from "@/lib/admin-reservations";
import { listAdminProducts } from "@/lib/admin-products";
import {
  defaultHomeHeroSettings,
  getHomeHeroSettings,
  type HomeHeroSettings,
} from "@/lib/site-settings";
import type { ProductRow, ReservationRow } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function LocalDeskPage() {
  let products: ProductRow[] = [];
  let reservations: ReservationRow[] = [];
  let homeHeroSettings: HomeHeroSettings = defaultHomeHeroSettings;
  let errorMessage = "";

  try {
    [products, reservations, homeHeroSettings] = await Promise.all([
      listAdminProducts(),
      listAdminReservations(),
      getHomeHeroSettings(),
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
          homeHeroSettings={homeHeroSettings}
          products={products}
          reservations={reservations}
        />
      )}
    </main>
  );
}
