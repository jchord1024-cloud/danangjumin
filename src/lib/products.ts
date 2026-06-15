export type ProductCategory = "villas" | "golf" | "guides" | "taxi";

export type Product = {
  slug: string;
  category: ProductCategory;
  title: string;
  location: string;
  address?: string;
  price: string;
  summary: string;
  image: string;
  galleryImages?: string[];
  highlights: string[];
  includes: string[];
  notice: string;
  detail: string;
};

export const categories: Record<
  ProductCategory,
  {
    label: string;
    href: string;
    eyebrow: string;
    description: string;
    image: string;
  }
> = {
  villas: {
    label: "풀빌라",
    href: "/villas",
    eyebrow: "Private Stay",
    description: "가족, 친구, 단체 여행에 맞춘 다낭 프리미엄 풀빌라",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
  },
  golf: {
    label: "골프",
    href: "/golf",
    eyebrow: "Golf Booking",
    description: "다낭 주요 골프장 라운딩과 차량 동선까지 편하게",
    image:
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1400&q=80",
  },
  guides: {
    label: "가이드",
    href: "/guides",
    eyebrow: "Local Guide",
    description: "가족 여행, 자유여행, 투어 일정에 맞춘 한국어 가이드",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  },
  taxi: {
    label: "택시",
    href: "/taxi",
    eyebrow: "Private Transfer",
    description: "공항 픽업부터 하루 차량까지 필요한 이동만 깔끔하게",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80",
  },
};

export const products: Product[] = [
  {
    slug: "ocean-signature-villa",
    category: "villas",
    title: "오션 시그니처 풀빌라",
    location: "미케비치 인근",
    price: "1박 520,000원부터",
    summary: "4룸 독채, 프라이빗 풀, 조식 요청 가능",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    highlights: ["4룸 5베드", "프라이빗 풀", "공항 픽업 선택"],
    includes: ["체크인 안내", "전용 수영장", "주방 및 세탁 시설", "카카오톡 현지 상담"],
    notice: "성수기, 주말, 연휴에는 요금과 가능 객실이 달라질 수 있습니다.",
    detail:
      "해변 접근성과 독립적인 휴식 동선을 함께 원하는 가족 여행객에게 맞춘 풀빌라입니다.",
  },
  {
    slug: "riverside-family-villa",
    category: "villas",
    title: "리버사이드 패밀리 빌라",
    location: "한강변",
    price: "1박 390,000원부터",
    summary: "3룸 구성, 조용한 주거 지역, 장기 숙박 추천",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    highlights: ["3룸 4베드", "주방 완비", "단독 체크인"],
    includes: ["장기 숙박 상담", "단독 체크인", "취사 가능", "차량 연결 가능"],
    notice: "숙박 인원과 체크인 시간에 따라 추가 안내가 필요할 수 있습니다.",
    detail:
      "번화가와 적당히 떨어진 조용한 숙소로, 아이 동반 가족과 장기 일정에 어울립니다.",
  },
  {
    slug: "ba-na-hills-golf",
    category: "golf",
    title: "바나힐 골프 클럽",
    location: "바나힐 방면",
    price: "그린피 별도 문의",
    summary: "18홀 라운딩, 왕복 차량, 티타임 상담",
    image:
      "https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1200&q=80",
    highlights: ["티타임 확인", "차량 연결", "동반자 일정 상담"],
    includes: ["티타임 확인", "왕복 차량 상담", "동반자 인원 체크", "골프장별 요금 안내"],
    notice: "골프장 정책과 예약 상황에 따라 티타임 및 요금이 변동될 수 있습니다.",
    detail:
      "다낭 대표 골프장 중 하나로, 선호 시간대와 인원에 맞춰 예약 가능 여부를 확인합니다.",
  },
  {
    slug: "montgomerie-links",
    category: "golf",
    title: "몽고메리 링크스",
    location: "다낭 남부",
    price: "패키지 문의",
    summary: "휴양지형 코스, 호텔 이동 동선 설계",
    image:
      "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80",
    highlights: ["프리미엄 코스", "단체 라운딩", "차량 패키지"],
    includes: ["라운딩 상담", "차량 동선 설계", "단체 일정 조율", "호텔 픽업 상담"],
    notice: "희망 날짜, 인원, 숙소 위치를 알려주시면 가장 빠르게 확인할 수 있습니다.",
    detail:
      "호이안과 다낭 남부 숙소 일정에 맞추기 좋은 골프 상품입니다.",
  },
  {
    slug: "danang-city-guide",
    category: "guides",
    title: "다낭 시티 한국어 가이드",
    location: "다낭 시내",
    price: "반일 120,000원부터",
    summary: "맛집, 쇼핑, 관광지를 일정에 맞춰 동행",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    highlights: ["한국어 소통", "반일/종일 선택", "가족 일정 추천"],
    includes: ["한국어 가이드", "반일/종일 코스", "맛집 추천", "쇼핑 동선 상담"],
    notice: "정확한 요금은 일정 시간, 이동 범위, 인원에 따라 안내됩니다.",
    detail:
      "처음 방문하는 여행객이 낯선 동선을 줄이고 편하게 움직이도록 돕는 가이드 상품입니다.",
  },
  {
    slug: "hoi-an-night-guide",
    category: "guides",
    title: "호이안 야경 가이드",
    location: "호이안 올드타운",
    price: "일정별 문의",
    summary: "올드타운 산책, 포토 스팟, 현지 맛집 추천",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
    highlights: ["야경 코스", "포토 스팟", "차량 연계 가능"],
    includes: ["올드타운 코스", "포토 스팟 안내", "맛집 동선 추천", "차량 연계 상담"],
    notice: "호이안 야간 시간대는 교통 상황에 따라 이동 시간이 달라질 수 있습니다.",
    detail:
      "호이안 야경과 식사 동선을 편하게 묶고 싶은 여행객에게 맞춘 코스입니다.",
  },
  {
    slug: "airport-pickup",
    category: "taxi",
    title: "다낭 공항 픽업",
    location: "다낭 국제공항",
    price: "편도 25,000원부터",
    summary: "도착 시간 맞춤 대기, 숙소까지 단독 이동",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
    highlights: ["항공편 확인", "단독 차량", "야간 도착 가능"],
    includes: ["항공편 시간 확인", "공항 대기", "숙소 드롭", "카카오톡 도착 안내"],
    notice: "항공편명과 도착 시간을 알려주시면 픽업 시간을 맞춰드립니다.",
    detail:
      "공항 도착 후 바로 숙소로 이동할 수 있도록 항공편 시간에 맞춰 차량을 연결합니다.",
  },
  {
    slug: "day-private-car",
    category: "taxi",
    title: "하루 단독 차량",
    location: "다낭/호이안",
    price: "8시간 95,000원부터",
    summary: "관광, 쇼핑, 골프 이동을 한 번에 묶는 차량",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
    highlights: ["8시간 기준", "일정 맞춤", "기사 포함"],
    includes: ["기사 포함", "8시간 기준", "다낭/호이안 이동", "일정별 동선 상담"],
    notice: "이용 시간 초과, 장거리 이동, 야간 운행은 추가 요금이 있을 수 있습니다.",
    detail:
      "여러 장소를 하루에 이동해야 하는 일정에 적합한 단독 차량 상품입니다.",
  },
];

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
