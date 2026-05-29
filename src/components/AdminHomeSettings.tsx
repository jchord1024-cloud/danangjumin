"use client";

import { useState } from "react";
import type { HomeHeroMediaItem, HomeHeroSettings } from "@/lib/site-settings";

function parseMediaUrls(value: string): HomeHeroMediaItem[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [typeValue, ...urlParts] = line.includes("|")
        ? line.split("|")
        : ["image", line];
      const type: HomeHeroMediaItem["type"] =
        typeValue.trim() === "video" ? "video" : "image";
      return { type, url: urlParts.join("|").trim() };
    })
    .filter((item) => item.url);
}

function mediaItemsToText(items: HomeHeroMediaItem[]) {
  return items.map((item) => `${item.type}|${item.url}`).join("\n");
}

export function AdminHomeSettings({
  initialSettings,
}: {
  initialSettings: HomeHeroSettings;
}) {
  const [form, setForm] = useState(initialSettings);
  const [mediaText, setMediaText] = useState(
    mediaItemsToText(initialSettings.mediaItems),
  );
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function updateField<K extends keyof HomeHeroSettings>(
    key: K,
    value: HomeHeroSettings[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadMedia(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    setIsUploading(true);
    setMessage("");
    const uploadedItems: HomeHeroMediaItem[] = [];

    for (const file of Array.from(files)) {
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

      if (!response.ok || !result.ok || !result.url) {
        setIsUploading(false);
        setMessage(result.message || "파일 업로드에 실패했습니다.");
        return;
      }

      uploadedItems.push({
        url: result.url,
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    }

    setIsUploading(false);
    const nextItems = [...parseMediaUrls(mediaText), ...uploadedItems];
    setMediaText(mediaItemsToText(nextItems));
    setForm((current) => ({ ...current, mediaItems: nextItems }));
    setMessage(`${uploadedItems.length}개 슬라이드가 추가되었습니다.`);
  }

  function updateMediaText(value: string) {
    setMediaText(value);
    setForm((current) => ({ ...current, mediaItems: parseMediaUrls(value) }));
  }

  async function submitSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const response = await fetch("/api/admin/site-settings/home-hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        mediaItems: parseMediaUrls(mediaText),
      }),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };

    setIsSaving(false);

    if (!response.ok || !result.ok) {
      setMessage(result.message || "저장에 실패했습니다.");
      return;
    }

    setMessage("홈 화면 설정이 저장되었습니다.");
  }

  return (
    <div className="admin-layout single">
      <section className="admin-editor" aria-label="홈 화면 관리">
        <div className="admin-section-head">
          <p>Home Editor</p>
          <h2>홈 화면 관리</h2>
        </div>
        <form onSubmit={submitSettings} className="admin-form">
          <label>
            상단 작은 문구
            <input
              value={form.eyebrow}
              onChange={(event) => updateField("eyebrow", event.target.value)}
            />
          </label>
          <label>
            메인 제목
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </label>
          <label>
            메인 설명
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
          </label>
          <label>
            카테고리 위 중간 문구
            <input
              value={form.middleText}
              onChange={(event) => updateField("middleText", event.target.value)}
            />
          </label>
          <label>
            슬라이드 전환 시간(초)
            <input
              type="number"
              min="1"
              max="30"
              step="0.5"
              value={(form.slideDurationMs || 2000) / 1000}
              onChange={(event) =>
                updateField(
                  "slideDurationMs",
                  Math.round(Number(event.target.value || 2) * 1000),
                )
              }
            />
          </label>
          <label>
            메인 슬라이드 URL
            <textarea
              rows={6}
              value={mediaText}
              onChange={(event) => updateMediaText(event.target.value)}
              placeholder={"image|https://...\nvideo|https://..."}
            />
          </label>
          <label>
            메인 슬라이드 이미지/동영상 업로드
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(event) => {
                void uploadMedia(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
          {form.mediaItems.length > 0 ? (
            <div className="admin-home-preview-grid">
              {form.mediaItems.map((item, index) => (
                <div key={`${item.url}-${index}`}>
                  {item.type === "video" ? (
                    <video src={item.url} muted playsInline controls />
                  ) : (
                    <span style={{ backgroundImage: `url(${item.url})` }} />
                  )}
                  <strong>{index + 1}</strong>
                </div>
              ))}
            </div>
          ) : null}
          {message ? <p className="admin-message">{message}</p> : null}
          <div className="admin-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving ? "저장 중" : "저장"}
            </button>
            {isUploading ? <span className="admin-uploading">업로드 중</span> : null}
          </div>
        </form>
      </section>
    </div>
  );
}
