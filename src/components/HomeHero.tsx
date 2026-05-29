"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomeHeroSettings } from "@/lib/site-settings";

export function HomeHero({ settings }: { settings: HomeHeroSettings }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mediaItems = settings.mediaItems.length > 0 ? settings.mediaItems : [];

  useEffect(() => {
    if (mediaItems.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % mediaItems.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [mediaItems.length]);

  return (
    <section className="home-hero">
      <div
        className="home-hero-media"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        aria-hidden="true"
      >
        {mediaItems.map((item, index) => (
          <div key={`${item.url}-${index}`}>
            {item.type === "video" ? (
              <video src={item.url} autoPlay muted loop playsInline />
            ) : (
              <span style={{ backgroundImage: `url(${item.url})` }} />
            )}
          </div>
        ))}
      </div>
      {mediaItems.length > 1 ? (
        <div className="home-hero-dots" aria-label="메인 슬라이드 위치">
          {mediaItems.map((item, index) => (
            <button
              key={`${item.url}-dot-${index}`}
              type="button"
              className={index === activeIndex ? "active" : ""}
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}번 슬라이드 보기`}
            />
          ))}
        </div>
      ) : null}
      <div className="home-hero-shade" />
      <div className="hero-copy">
        <p>{settings.eyebrow}</p>
        <h1>{settings.title}</h1>
        <span>{settings.description}</span>
      </div>
      <div className="hero-actions">
        <Link href="/villas">상품 둘러보기</Link>
        <Link href="/reservation">예약정보 확인</Link>
      </div>
    </section>
  );
}
