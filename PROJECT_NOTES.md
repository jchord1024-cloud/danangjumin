# 다낭주민쎈타 프로젝트 노트

Next.js 기반 다낭 여행 프리미엄 예약몰입니다. 새 컴퓨터나 새 Codex 대화에서 이어서 작업할 때 이 파일을 먼저 읽으면 됩니다.

## 현재 브랜드

- 사이트 이름: 다낭주민쎈타
- 보조 브랜드 문구: Joomin CCenter
- 콘셉트: 다낭 현지 예약센터 느낌의 프리미엄 예약몰

## 메뉴 구성

- 홈
- 풀빌라
- 골프
- 가이드
- 택시
- 예약정보

## 현재 구현 상태

- Next.js App Router 프로젝트 생성 완료
- 반응형 웹 1차 구현 완료
- 홈 화면 구현 완료
- 풀빌라, 골프, 가이드, 택시 카테고리 페이지 구현 완료
- 상품 상세 페이지 구현 완료
- 상세 페이지 퀄리티 개선 완료
- 카카오톡 문의 버튼 UI 구현 완료
- 카카오 로그인 API route 실제 OAuth 흐름 구현 완료
- 예약정보 페이지 1차 UI 구현 완료
- 상품 데이터는 임시로 `src/lib/products.ts`에서 관리 중
- Supabase DB는 상품/예약/프로필 관리 코드에 연결 가능
- 관리 데스크 경로는 `/local-desk`
- 관리 데스크는 `ADMIN_USERNAME`, `ADMIN_PASSWORD` 환경변수로 Basic Auth 보호
- 상품 이미지는 Supabase Storage `product-images` public bucket 사용
- 관리 데스크에서 상품관리, 예약관리 가능
- 예약정보 페이지는 카카오 로그인 후 오픈채팅 상담 시 남긴 예약자명/연락처로 예약 조회
- 상품 상세 갤러리는 `products.gallery_images` 컬럼에 여러 이미지 URL을 저장

## 주요 파일

- `src/app/page.tsx`: 홈
- `src/app/villas/page.tsx`: 풀빌라
- `src/app/golf/page.tsx`: 골프
- `src/app/guides/page.tsx`: 가이드
- `src/app/taxi/page.tsx`: 택시
- `src/app/reservation/page.tsx`: 예약정보
- `src/app/products/[slug]/page.tsx`: 상품 상세
- `src/lib/products.ts`: 임시 상품 데이터
- `src/components/Header.tsx`: 상단 메뉴
- `src/components/KakaoContact.tsx`: 카카오톡 문의 플로팅 버튼
- `src/app/api/auth/kakao/route.ts`: 카카오 로그인 시작 route
- `src/app/api/auth/kakao/callback/route.ts`: 카카오 로그인 callback 처리
- `src/app/api/auth/logout/route.ts`: 카카오 로그인 세션 삭제
- `src/lib/kakao-auth.ts`: 카카오 토큰 교환, 사용자 정보, 세션 쿠키, 예약 조회
- `src/app/globals.css`: 전체 디자인 CSS

## 예정 기능

1. Supabase DB 연동
2. 관리 데스크 보호 기능 추가
3. 관리 데스크에서 상품 등록, 수정, 삭제
4. 상품 목록과 상세 페이지를 `src/lib/products.ts`가 아니라 Supabase DB에서 불러오도록 변경
5. 카카오 로그인 배포 환경 테스트
6. 고객별 예약정보 DB 연동
7. Vercel 배포
8. 도메인 연결

## 추천 DB 구조 초안

- `products`
  - id
  - slug
  - category
  - title
  - location
  - price
  - summary
  - image_url
  - gallery_images
  - detail
  - highlights
  - includes
  - notice
  - is_visible
  - created_at
  - updated_at

- `profiles`
  - id
  - kakao_id
  - name
  - phone
  - email
  - role
  - created_at

- `reservations`
  - id
  - user_id
  - product_id
  - customer_name
  - travel_date
  - people_count
  - status
  - memo
  - created_at
  - updated_at

## 필요한 환경변수

실제 `.env` 파일은 GitHub에 올리지 않습니다. 배포할 때 Vercel 환경변수에도 같은 값을 넣어야 합니다.

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

## Supabase SQL 메모

상품별 상세 갤러리 이미지를 사용하려면 Supabase SQL Editor에서 아래 컬럼을 추가합니다.

```sql
alter table products
add column if not exists gallery_images text[] default '{}';
```

## 새 컴퓨터에서 이어서 작업하는 법

1. GitHub 저장소를 clone 또는 download
2. 프로젝트 폴더에서 `npm install`
3. 필요한 경우 `.env` 생성
4. `npm.cmd run dev` 실행
5. 브라우저에서 `http://127.0.0.1:3000` 확인

## 새 Codex 대화에서 요청 예시

```text
이 프로젝트는 다낭주민쎈타 예약몰이야.
PROJECT_NOTES.md를 먼저 읽고 현재 상태를 파악해줘.
다음 작업은 Vercel 배포 도메인 연결 카카오 로그인
```
