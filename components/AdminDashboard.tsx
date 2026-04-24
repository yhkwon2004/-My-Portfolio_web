"use client";

import { useMemo, useState } from "react";
import type { ItemType, PortfolioContent, PortfolioImage, PortfolioItem } from "@/lib/types";

type Props = {
  initialContent: PortfolioContent;
  userName: string;
};

const itemTypes: ItemType[] = ["profile", "award", "project", "education", "experience", "certification", "archive"];

function emptyItem(): PortfolioItem {
  const id = `item-${crypto.randomUUID()}`;
  return {
    id,
    type: "project",
    titleKo: "새 항목",
    titleEn: "New item",
    summaryKo: "",
    summaryEn: "",
    year: "",
    tags: [],
    featured: false,
    featuredRank: 99,
    visible: true,
    images: []
  };
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function stringifyLinks(links?: { label: string; url: string }[]) {
  return (links ?? []).map((link) => `${link.label}|${link.url}`).join("\n");
}

function parseLinks(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return {
        label: label.trim() || "Link",
        url: rest.join("|").trim()
      };
    })
    .filter((link) => link.url);
}

function stringifyDetails(details?: Record<string, string | string[]>) {
  return Object.entries(details ?? {})
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(" | ") : value}`)
    .join("\n");
}

function parseDetails(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string | string[]>>((acc, line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) {
        return acc;
      }
      const key = line.slice(0, colonIndex).trim();
      const raw = line.slice(colonIndex + 1).trim();
      if (!key || !raw) {
        return acc;
      }
      acc[key] = raw.includes("|") ? raw.split("|").map((part) => part.trim()).filter(Boolean) : raw;
      return acc;
    }, {});
}

export function AdminDashboard({ initialContent, userName }: Props) {
  const [content, setContent] = useState(initialContent);
  const [selectedId, setSelectedId] = useState(initialContent.items[0]?.id ?? "");
  const [filter, setFilter] = useState<ItemType | "all">("all");
  const [status, setStatus] = useState("변경사항을 편집할 수 있습니다.");
  const [saving, setSaving] = useState(false);

  const selected = content.items.find((item) => item.id === selectedId) ?? content.items[0];
  const filtered = useMemo(() => {
    if (filter === "all") {
      return content.items;
    }
    return content.items.filter((item) => item.type === filter);
  }, [content.items, filter]);

  const updateItem = (id: string, patch: Partial<PortfolioItem>) => {
    setContent((value) => ({
      ...value,
      items: value.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    }));
  };

  const updateImage = (index: number, patch: Partial<PortfolioImage>) => {
    if (!selected) {
      return;
    }
    const images = selected.images.map((image, imageIndex) => (imageIndex === index ? { ...image, ...patch } : image));
    updateItem(selected.id, { images });
  };

  const addItem = () => {
    const next = emptyItem();
    setContent((value) => ({ ...value, items: [next, ...value.items] }));
    setSelectedId(next.id);
  };

  const duplicateItem = () => {
    if (!selected) {
      return;
    }
    const copy = { ...selected, id: `item-${crypto.randomUUID()}`, titleKo: `${selected.titleKo} 복사본`, titleEn: `${selected.titleEn} Copy` };
    setContent((value) => ({ ...value, items: [copy, ...value.items] }));
    setSelectedId(copy.id);
  };

  const deleteItem = () => {
    if (!selected) {
      return;
    }
    const remaining = content.items.filter((item) => item.id !== selected.id);
    setContent((value) => ({ ...value, items: remaining }));
    setSelectedId(remaining[0]?.id ?? "");
  };

  const save = async () => {
    setSaving(true);
    setStatus("저장 중...");
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const saved = (await response.json()) as PortfolioContent;
      setContent(saved);
      setStatus("저장 완료. 공개 페이지에 반영되었습니다.");
    } catch (error) {
      setStatus(error instanceof Error ? `저장 실패: ${error.message}` : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!selected) {
      return;
    }
    setStatus("이미지 업로드 중...");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: form });

    if (!response.ok) {
      setStatus("이미지 업로드 실패");
      return;
    }

    const result = (await response.json()) as { url: string };
    updateItem(selected.id, {
      images: [
        ...selected.images,
        {
          url: result.url,
          altKo: selected.titleKo,
          altEn: selected.titleEn,
          role: selected.type === "award" ? "certificate" : "gallery"
        }
      ]
    });
    setStatus("이미지 업로드 완료. 저장 버튼을 눌러 반영하세요.");
  };

  return (
    <main className="admin-workspace">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Portfolio CMS</p>
          <h1>권용현 포트폴리오 관리자</h1>
          <p>{userName} 계정으로 편집 중입니다.</p>
        </div>
        <div className="admin-actions">
          <a className="button-link secondary" href="/">
            공개 페이지
          </a>
          <a className="button-link secondary" href="/api/auth/signout">
            로그아웃
          </a>
          <button className="button-link" onClick={save} disabled={saving}>
            {saving ? "저장 중" : "저장"}
          </button>
        </div>
      </header>

      <p className="admin-status">{status}</p>

      <section className="settings-editor">
        <h2>사이트 기본 설정</h2>
        <div className="form-grid">
          <label>
            이름 KO
            <input value={content.settings.ownerKo} onChange={(event) => setContent({ ...content, settings: { ...content.settings, ownerKo: event.target.value } })} />
          </label>
          <label>
            이름 EN
            <input value={content.settings.ownerEn} onChange={(event) => setContent({ ...content, settings: { ...content.settings, ownerEn: event.target.value } })} />
          </label>
          <label className="wide">
            헤드라인 KO
            <input value={content.settings.headlineKo} onChange={(event) => setContent({ ...content, settings: { ...content.settings, headlineKo: event.target.value } })} />
          </label>
          <label className="wide">
            헤드라인 EN
            <input value={content.settings.headlineEn} onChange={(event) => setContent({ ...content, settings: { ...content.settings, headlineEn: event.target.value } })} />
          </label>
        </div>
      </section>

      <section className="cms-layout">
        <aside className="item-sidebar">
          <div className="sidebar-tools">
            <button onClick={addItem}>추가</button>
            <button onClick={duplicateItem} disabled={!selected}>복제</button>
            <button onClick={deleteItem} disabled={!selected}>삭제</button>
          </div>
          <select value={filter} onChange={(event) => setFilter(event.target.value as ItemType | "all")}>
            <option value="all">전체</option>
            {itemTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="item-list">
            {filtered.map((item) => (
              <button key={item.id} className={item.id === selectedId ? "selected" : ""} onClick={() => setSelectedId(item.id)}>
                <span>{item.type}</span>
                <strong>{item.titleKo}</strong>
                <small>{item.featured ? `대표 #${item.featuredRank}` : item.year}</small>
              </button>
            ))}
          </div>
        </aside>

        {selected ? (
          <article className="editor-panel">
            <div className="editor-topline">
              <h2>{selected.titleKo}</h2>
              <label className="switch">
                <input type="checkbox" checked={selected.visible} onChange={(event) => updateItem(selected.id, { visible: event.target.checked })} />
                공개
              </label>
              <label className="switch">
                <input type="checkbox" checked={selected.featured} onChange={(event) => updateItem(selected.id, { featured: event.target.checked })} />
                대표 노출
              </label>
            </div>

            <div className="form-grid">
              <label>
                유형
                <select value={selected.type} onChange={(event) => updateItem(selected.id, { type: event.target.value as ItemType })}>
                  {itemTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                연도
                <input value={selected.year ?? ""} onChange={(event) => updateItem(selected.id, { year: event.target.value })} />
              </label>
              <label>
                대표 순서
                <input type="number" value={selected.featuredRank} onChange={(event) => updateItem(selected.id, { featuredRank: Number(event.target.value) })} />
              </label>
              <label className="wide">
                제목 KO
                <input value={selected.titleKo} onChange={(event) => updateItem(selected.id, { titleKo: event.target.value })} />
              </label>
              <label className="wide">
                제목 EN
                <input value={selected.titleEn} onChange={(event) => updateItem(selected.id, { titleEn: event.target.value })} />
              </label>
              <label className="wide">
                설명 KO
                <textarea value={selected.summaryKo} onChange={(event) => updateItem(selected.id, { summaryKo: event.target.value })} />
              </label>
              <label className="wide">
                설명 EN
                <textarea value={selected.summaryEn} onChange={(event) => updateItem(selected.id, { summaryEn: event.target.value })} />
              </label>
              <label className="wide">
                태그 (쉼표로 구분)
                <input value={selected.tags.join(", ")} onChange={(event) => updateItem(selected.id, { tags: parseTags(event.target.value) })} />
              </label>
              <label className="wide">
                링크 (한 줄에 `라벨|URL`)
                <textarea
                  value={stringifyLinks(selected.links)}
                  onChange={(event) => updateItem(selected.id, { links: parseLinks(event.target.value) })}
                  placeholder={"Notion|https://www.notion.so/...\nDemo|https://example.com"}
                />
              </label>
              <label className="wide">
                자세히 보기 섹션 (`섹션명: 내용`, 여러 항목은 `|`)
                <textarea
                  value={stringifyDetails(selected.details)}
                  onChange={(event) => updateItem(selected.id, { details: parseDetails(event.target.value) })}
                  placeholder={"한줄소개: 프로젝트를 한 문장으로 설명\n핵심기능: 기능 1 | 기능 2 | 기능 3"}
                />
              </label>
            </div>

            <div className="image-editor">
              <div className="image-editor-header">
                <h3>이미지</h3>
                <label className="upload-button">
                  이미지 업로드
                  <input type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0])} />
                </label>
              </div>
              <div className="editable-images">
                {selected.images.map((image, index) => (
                  <div className="editable-image" key={`${image.url}-${index}`}>
                    <img src={image.url} alt={image.altKo} />
                    <input value={image.url} onChange={(event) => updateImage(index, { url: event.target.value })} />
                    <input value={image.altKo} onChange={(event) => updateImage(index, { altKo: event.target.value })} placeholder="대체 텍스트 KO" />
                    <input value={image.altEn} onChange={(event) => updateImage(index, { altEn: event.target.value })} placeholder="Alt EN" />
                    <button
                      onClick={() => updateItem(selected.id, { images: selected.images.filter((_, imageIndex) => imageIndex !== index) })}
                    >
                      이미지 제거
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="preview-panel">
              <p className="eyebrow">Preview</p>
              <h3>{selected.titleKo}</h3>
              <p>{selected.summaryKo}</p>
              <div className="tag-row">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              {selected.links?.length ? <p>링크 {selected.links.length}개 연결됨</p> : null}
              {selected.details ? <p>상세 섹션 {Object.keys(selected.details).length}개</p> : null}
            </div>
          </article>
        ) : (
          <article className="editor-panel">
            <h2>항목을 추가하세요.</h2>
          </article>
        )}
      </section>
    </main>
  );
}
