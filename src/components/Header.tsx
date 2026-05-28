import Link from "next/link";

const menu = [
  { href: "/", label: "홈" },
  { href: "/villas", label: "풀빌라" },
  { href: "/golf", label: "골프" },
  { href: "/guides", label: "가이드" },
  { href: "/taxi", label: "택시" },
  { href: "/reservation", label: "예약정보" },
];

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="홈으로 이동">
        <span>Da Nang Local Desk</span>
        <strong>다낭주민쎈타</strong>
      </Link>
      <nav className="main-nav" aria-label="주요 메뉴">
        {menu.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="login-button" href="/api/auth/kakao">
        카카오 로그인
      </Link>
    </header>
  );
}
