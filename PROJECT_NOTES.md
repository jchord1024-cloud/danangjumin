# 다낭주민센터 프로젝트 노트

이 문서는 PC를 바꾸거나 새 Codex 대화에서 이어서 작업할 때 먼저 읽기 위한 인수인계 문서입니다. 새 환경에서는 이 파일을 먼저 읽고 현재 구조와 최근 변경사항을 파악하세요.

## 프로젝트 개요

- 프로젝트명: `prime-reservation`
- 서비스명: 다낭주민센터
- 사이트: `danangjumin.com`
- 저장소 브랜치: `main`
- 프레임워크: Next.js App Router
- 주요 목적: 다낭 여행 예약몰. 풀빌라, 골프, 가이드, 택시 상품을 보여주고 카카오톡 문의 및 예약조회/관리 기능을 제공.

## 실행 방법

```bash
npm install
npm.cmd run dev
```

로컬 확인 URL:

```text
http://127.0.0.1:3000
```

빌드 확인:

```bash
npm.cmd run build
```

배포는 `main` 브랜치에 push하면 Vercel이 자동 배포하는 흐름으로 사용 중입니다.

## 현재 구현 상태

- 홈 화면 구현 완료
- 홈 메인 히어로 이미지/영상 슬라이더 구현 완료
- 홈 히어로 문구, 중간 문구, 슬라이드 이미지/영상, 슬라이드 전환 시간을 관리자 화면에서 수정 가능
- 홈 중간 문구는 흰 배경 위에 박히는 형태로 배치
- 홈 중간 문구 글씨체는 붓글씨 느낌의 `Nanum Brush Script` 적용
- 홈 카테고리 4개 카드 구현 완료: 풀빌라, 골프, 가이드, 택시
- 상품 목록/상세 페이지 구현 완료
- 상품 상세 페이지는 대표 이미지, 상세 갤러리, 요약 정보, 안내 섹션 포함
- 상품 데이터는 Supabase DB와 연결 가능하며, fallback 데이터는 `src/lib/products.ts`에 있음
- 상품 이미지 업로드는 Supabase Storage `product-images` public bucket 사용
- 관리자 화면 경로: `/local-desk`
- 관리자 화면은 `ADMIN_USERNAME`, `ADMIN_PASSWORD` 환경변수 기반 Basic Auth로 보호
- 관리자 화면에서 상품 관리, 예약 관리, 홈 화면 관리 가능
- 예약조회 페이지는 고객명/연락처로 예약 조회
- 카카오톡 문의 플로팅 버튼 구현 완료
- 카카오 로그인 API route 및 세션 처리 코드 있음

## 최근 작업 내역

최근 커밋 기준:

- `5a87e08 Add brush style home message`
  - 홈 중간 문구에 붓글씨 느낌 폰트 적용
  - `Nanum Brush Script` Google Font import 추가
  - 중간 문구 크기와 줄간격 조정

- `ff5371d Polish home hero spacing`
  - 홈 중간 문구 뒤 네모 박스, 테두리, 그림자 제거
  - 중간 문구가 흰 배경 영역에 자연스럽게 들어가도록 변경
  - 메인 이미지 아래에서 텍스트까지 약 86px, 텍스트 아래에서 카드까지 약 70px 여백 확인
  - 홈 이미지 어두운 오버레이 완화
  - 카테고리 카드 이미지 오버레이 완화
  - 슬라이드 전환 기본값을 2초로 변경
  - 관리자 홈 설정에 `슬라이드 전환 시간(초)` 입력 추가

- `fddebe8 Fix home hero settings persistence`
  - 홈 히어로 설정 저장/조회 관련 수정

- `70c22e8 Add home slider controls`
  - 홈 슬라이더 이전/다음 버튼 및 점 표시 추가

- `a870167 Add editable home hero slider`
  - 관리자에서 홈 히어로 슬라이더 이미지/영상과 문구 편집 가능하도록 구현

- `f8e79f2 Add product gallery images`
  - 상품 상세 갤러리 이미지 지원

- `6f01160 Redesign product detail pages`
  - 상품 상세 페이지 디자인 개편

- `6cd49d4 Use name and phone for reservation lookup`
  - 예약조회 방식을 고객명/연락처 기반으로 변경

## 주요 파일

- `src/app/page.tsx`
  - 홈 페이지
  - `HomeHero` 렌더링
  - 홈 중간 문구와 카테고리 4개 카드 렌더링

- `src/components/HomeHero.tsx`
  - 홈 메인 히어로 슬라이더
  - `settings.slideDurationMs`로 자동 전환 시간 제어
  - 이전/다음 버튼과 점 표시 포함

- `src/components/AdminHomeSettings.tsx`
  - 관리자 홈 화면 설정 폼
  - 히어로 문구, 중간 문구, 슬라이드 URL, 이미지/영상 업로드, 슬라이드 시간 관리

- `src/lib/site-settings.ts`
  - 홈 화면 설정 타입과 기본값
  - Supabase `site_settings` 테이블에서 설정 조회/저장
  - `slideDurationMs` 기본값은 `2000`

- `src/app/api/admin/site-settings/home-hero/route.ts`
  - 관리자 홈 설정 저장 API

- `src/app/globals.css`
  - 전체 CSS
  - 홈 히어로, 중간 문구, 카테고리 카드, 상세 페이지, 관리자 화면 스타일 포함

- `src/components/LocalDesk.tsx`
  - 관리자 화면 탭 구성

- `src/components/AdminProducts.tsx`
  - 관리자 상품 관리

- `src/components/AdminReservations.tsx`
  - 관리자 예약 관리

- `src/app/products/[slug]/page.tsx`
  - 상품 상세 페이지

- `src/lib/product-queries.ts`
  - 상품 조회 로직

- `src/lib/admin-products.ts`
  - 관리자 상품 CRUD 관련 로직

- `src/lib/admin-reservations.ts`
  - 관리자 예약 CRUD 관련 로직

- `src/app/reservation/page.tsx`
  - 예약조회 페이지

- `src/components/ReservationLookup.tsx`
  - 고객명/연락처 예약조회 UI

- `src/app/api/reservations/lookup/route.ts`
  - 예약조회 API

- `src/components/KakaoContact.tsx`
  - 카카오톡 문의 플로팅 버튼

- `src/lib/kakao-auth.ts`
  - 카카오 OAuth, 세션, 사용자 정보 처리

## 환경변수

실제 `.env.local`은 GitHub에 올리지 않습니다. 새 PC나 Vercel에는 아래 값을 별도로 설정해야 합니다.

```env
NEXT_PUBLIC_KAKAO_CHANNEL_URL=https://open.kakao.com/o/sP9ik6wi
KAKAO_REST_API_KEY=your_kakao_rest_api_key
KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/kakao/callback
KAKAO_CLIENT_SECRET=your_optional_kakao_client_secret
KAKAO_SESSION_SECRET=your_random_session_secret

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

ADMIN_USERNAME=kimjun5027
ADMIN_PASSWORD=your_admin_password
```

배포 환경에서는 `KAKAO_REDIRECT_URI`를 운영 도메인 콜백 주소로 설정해야 합니다.

```text
https://danangjumin.com/api/auth/kakao/callback
```

## Supabase 메모

홈 화면 설정용 테이블:

```sql
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

상품 상세 갤러리용 컬럼:

```sql
alter table products
add column if not exists gallery_images text[] default '{}';
```

홈 히어로 설정은 `site_settings` 테이블의 `key = 'home_hero'` 값에 JSON으로 저장됩니다. 현재 구조는 대략 아래 형태입니다.

```json
{
  "eyebrow": "Da Nang Local Reservation Center",
  "title": "다낭 여행, 현지처럼 편하게.",
  "description": "풀빌라, 골프, 가이드, 택시까지 필요한 일정만 골라 다낭주민센터에서 빠르게 상담하세요.",
  "middleText": "다낭의 하루를 더 편하게, 현지 감각으로 예약하세요.",
  "slideDurationMs": 2000,
  "mediaItems": [
    {
      "url": "https://...",
      "type": "image"
    }
  ]
}
```

## 디자인 관련 현재 결정사항

- 홈 메인 이미지는 기존보다 덜 어둡게 처리
- 홈 중간 문구는 별도 카드/박스 없이 흰 배경 위 텍스트로 처리
- 홈 중간 문구 폰트는 붓글씨 느낌
- 카드 UI는 과도하게 둥글지 않게 8px radius 기준
- 카테고리 카드 이미지는 텍스트 가독성을 위해 약한 어두운 그라데이션만 유지
- 전체 사이트는 여행 예약몰 느낌이 나도록 이미지 중심으로 구성

## 주의사항

- 사용자 변경사항을 임의로 되돌리지 말 것
- 작업 전 `git status --short`로 변경사항 확인
- 원격이 앞서 있을 수 있으므로 필요하면 `git pull --ff-only`로 최신화
- 파일 수정은 가능하면 `apply_patch` 사용
- 빌드 확인은 `npm.cmd run build`
- 배포 반영은 `git push` 후 Vercel 자동 배포 대기
- `PROJECT_NOTES.md`는 새 작업 후 계속 갱신할 것

## 다음 작업 후보

- 실제 운영 도메인에서 Vercel 배포 완료 여부 확인
- 홈 중간 붓글씨 폰트가 실제 배포 환경에서 의도대로 로드되는지 확인
- 모바일 홈 화면에서 히어로, 중간 문구, 카드 간격 재확인
- 관리자 홈 설정에서 슬라이드 시간 저장 후 운영 DB에 정상 반영되는지 확인
- 상품/예약 Supabase 데이터 정리
- 카카오 로그인 운영 redirect URI 최종 확인
- Vercel 환경변수 누락 여부 점검

## 새 Codex 대화에서 시작할 때 요청 예시

```text
이 프로젝트는 다낭주민센터 예약몰입니다.
먼저 PROJECT_NOTES.md를 읽고 현재 상태를 파악한 뒤 이어서 작업해줘.
작업 전 git status와 최근 커밋도 확인해줘.
```
