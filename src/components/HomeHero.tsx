"use client";

import { useEffect, useState } from "react";
import type { HomeHeroSettings } from "@/lib/site-settings";

export function HomeHero({ settings }: { settings: HomeHeroSettings }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mediaItems = settings.mediaItems.length > 0 ? settings.mediaItems : [];
  const slideCount = mediaItems.length;
  const visibleIndex = slideCount > 0 ? activeIndex % slideCount : 0;
  const slideDurationMs = Math.max(settings.slideDurationMs || 2000, 1000);

  useEffect(() => {
    if (slideCount < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, slideDurationMs);

    return () => window.clearInterval(timer);
  }, [slideCount, slideDurationMs]);

  function showPreviousSlide() {
    setActiveIndex((current) => (current - 1 + slideCount) % slideCount);
  }

  function showNextSlide() {
    setActiveIndex((current) => (current + 1) % slideCount);
  }

  return (
    <section className="home-hero">
      <div
        className="home-hero-media"
        style={{
          width: `${Math.max(slideCount, 1) * 100}%`,
          transform: `translateX(-${(visibleIndex * 100) / Math.max(slideCount, 1)}%)`,
        }}
        aria-hidden="true"
      >
        {mediaItems.map((item, index) => (
          <div
            key={`${item.url}-${index}`}
            style={{ flexBasis: `${100 / Math.max(slideCount, 1)}%` }}
          >
            {item.type === "video" ? (
              <video src={item.url} autoPlay muted loop playsInline />
            ) : (
              <span style={{ backgroundImage: `url(${item.url})` }} />
            )}
          </div>
        ))}
      </div>
      <div className="home-hero-shade" />
      {slideCount > 1 ? (
        <div className="home-hero-controls" aria-label="메인 슬라이드 조작">
          <button type="button" onClick={showPreviousSlide} aria-label="이전 슬라이드">
            &lt;
          </button>
          <span>
            {visibleIndex + 1} / {slideCount}
          </span>
          <button type="button" onClick={showNextSlide} aria-label="다음 슬라이드">
            &gt;
          </button>
          <div className="home-hero-dots" aria-label="메인 슬라이드 위치">
            {mediaItems.map((item, index) => (
              <button
                key={`${item.url}-dot-${index}`}
                type="button"
              className={index === visibleIndex ? "active" : ""}
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}번 슬라이드 보기`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
