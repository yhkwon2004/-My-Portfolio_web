"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CursorFollower } from "./CursorFollower";
import { PolygonBackdrop } from "./PolygonBackdrop";
import type { PortfolioContent, PortfolioImage, PortfolioItem } from "@/lib/types";

type Props = {
  initialContent: PortfolioContent;
};

const sections = ["entrance", "intro", "resume", "crossroads", "awards", "projects", "contact"] as const;
type SectionId = (typeof sections)[number];

const navItems: { label: string; target: SectionId }[] = [
  { label: "메인페이지", target: "entrance" },
  { label: "대표 프로젝트", target: "resume" },
  { label: "수상", target: "awards" },
  { label: "프로젝트", target: "projects" },
  { label: "연락", target: "contact" }
];

const sectionLabels: Record<SectionId, string> = {
  entrance: "메인페이지",
  intro: "소개",
  resume: "대표 프로젝트",
  crossroads: "갈림길",
  awards: "수상",
  projects: "프로젝트",
  contact: "연락"
};

const typeLabels: Record<PortfolioItem["type"], string> = {
  profile: "소개",
  award: "수상",
  project: "프로젝트",
  education: "학력",
  experience: "경력",
  certification: "자격",
  archive: "기록"
};

function koText(item: PortfolioItem, field: "title" | "summary") {
  return field === "title" ? item.titleKo : item.summaryKo;
}

function detailEntries(item: PortfolioItem) {
  return Object.entries(item.details ?? {}).filter(([, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return Boolean(value);
  });
}

function splitAwardTitle(title: string) {
  const separators = [" · ", " - ", " `"];
  for (const separator of separators) {
    const index = title.lastIndexOf(separator);
    if (index > 0) {
      const name = title.slice(0, index).replace(/`/g, "").trim();
      const prize = title.slice(index + separator.length).replace(/`/g, "").trim();
      if (prize && /(상|표창|입선|대상|최우수|우수|장려)/.test(prize)) {
        return { name, prize };
      }
    }
  }

  return { name: title, prize: "" };
}

function sortFeatured(items: PortfolioItem[]) {
  return [...items].sort((a, b) => a.featuredRank - b.featuredRank || (b.year ?? "").localeCompare(a.year ?? ""));
}

function sectionIndex(section: SectionId) {
  return sections.indexOf(section);
}

function resolveBucketYear(year?: string) {
  const matches = year?.match(/20\d{2}/g);
  return matches?.at(-1) ?? null;
}

function resolveProjectVisual(item: PortfolioItem) {
  const cover = item.images.find((image) => image.role === "cover") ?? item.images[0];
  if (cover?.url) return cover.url;

  if (item.id.includes("autonomous") || item.id.includes("handmade-car")) {
    return "/assets/evidence/project-car-1.jpg";
  }

  if (item.id.includes("upcycle")) {
    return "/assets/evidence/project-upcycle-1.jpg";
  }

  if (item.id.includes("kakao") || item.id.includes("farm-app")) {
    return "/assets/evidence/project-app-screen-2.png";
  }

  if (item.id.includes("gantts")) {
    return "/assets/generated/growth-corridor.png";
  }

  if (item.id.includes("rehab")) {
    return "/assets/generated/project-lab.png";
  }

  if (item.tags.includes("AI")) {
    return "/assets/generated/growth-corridor.png";
  }

  if (item.tags.includes("Mobility")) {
    return "/assets/evidence/project-car-1.jpg";
  }

  return "/assets/generated/project-lab.png";
}

function projectGalleryImages(item: PortfolioItem) {
  const coverUrl = resolveProjectVisual(item);
  const seen = new Set([coverUrl]);
  return item.images.filter((image) => {
    if (!image.url || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

function projectVideoLinks(item: PortfolioItem) {
  return (item.links ?? []).filter((link) => /video|youtu\.be|youtube|shorts/i.test(`${link.label} ${link.url}`));
}

function useLightweightMobileMode() {
  const [lightweight, setLightweight] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 980px), (pointer: coarse), (prefers-reduced-motion: reduce)");
    const update = () => setLightweight(query.matches);

    update();
    query.addEventListener?.("change", update);
    return () => {
      query.removeEventListener?.("change", update);
    };
  }, []);

  return lightweight;
}

export function PortfolioExperience({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const wheelLockRef = useRef(false);
  const projectTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    localStorage.setItem("portfolio-locale", "ko");
    localStorage.setItem("portfolio-theme", "dark");
  }, []);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : initialContent))
      .then(setContent)
      .catch(() => setContent(initialContent));
  }, [initialContent]);

  useEffect(() => {
    const resetActiveScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      const activeScene = document.querySelector<HTMLElement>(`.scene.${sections[active]}.active`);
      activeScene?.scrollTo({ top: 0, left: 0, behavior: "auto" });

      activeScene
        ?.querySelectorAll<HTMLElement>(".content-panel, .awards-toggle-board, .award-list-stack, .featured-project-shell")
        .forEach((node) => {
          node.scrollTo({ top: 0, left: 0, behavior: "auto" });
        });
    };

    resetActiveScroll();
    const frame = window.requestAnimationFrame(resetActiveScroll);
    const timer = window.setTimeout(resetActiveScroll, 120);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active]);

  const selectItem = useCallback((item: PortfolioItem) => {
    startTransition(() => {
      setSelected(item);
    });
  }, []);

  const closeSelected = useCallback(() => {
    startTransition(() => {
      setSelected(null);
    });
  }, []);

  const setSection = useCallback((section: SectionId) => {
    startTransition(() => {
      setSelected(null);
      setNavOpen(false);
      setActive(sectionIndex(section));
    });
  }, []);

  const goBack = useCallback(() => {
    startTransition(() => {
      setSelected(null);
      setActive((value) => {
        const current = sections[value];
        if (current === "awards" || current === "projects" || current === "contact") return sectionIndex("crossroads");
        return Math.max(0, value - 1);
      });
    });
  }, []);

  const goForward = useCallback(() => {
    startTransition(() => {
      setSelected(null);
      setActive((value) => {
        const current = sections[value];
        if (current === "entrance") return sectionIndex("intro");
        if (current === "intro") return sectionIndex("resume");
        if (current === "resume") return sectionIndex("crossroads");
        return value;
      });
    });
  }, []);

  const goPreviousPage = useCallback(() => {
    startTransition(() => {
      setSelected(null);
      setNavOpen(false);
      setActive((value) => Math.max(0, value - 1));
    });
  }, []);

  const goNextPage = useCallback(() => {
    startTransition(() => {
      setSelected(null);
      setNavOpen(false);
      setActive((value) => Math.min(sections.length - 1, value + 1));
    });
  }, []);

  useEffect(() => {
    const canScrollInside = (node: HTMLElement | null, delta: number) => {
      if (!node || Math.abs(delta) < 4) return false;
      const maxScroll = node.scrollHeight - node.clientHeight;
      if (maxScroll <= 8) return false;

      const atStart = node.scrollTop <= 8;
      const atEnd = node.scrollTop >= maxScroll - 8;
      return delta > 0 ? !atEnd : !atStart;
    };

    const navigate = (direction: 1 | -1) => {
      if (wheelLockRef.current || selected) return;
      wheelLockRef.current = true;
      if (direction > 0) {
        goForward();
      } else {
        goBack();
      }
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 920);
    };

    const onWheel = (event: WheelEvent) => {
      const phase = sections[active];
      const target = event.target instanceof Element ? event.target : null;
      const track = target?.closest<HTMLElement>(".showcase-track");

      if (selected) {
        const modalScrollRoot = target?.closest<HTMLElement>(".expanded-copy");
        if (canScrollInside(modalScrollRoot ?? null, event.deltaY)) {
          return;
        }
        event.preventDefault();
        return;
      }

      if (phase === "awards") {
        const awardScrollRoot =
          target?.closest<HTMLElement>(".award-list-stack") ??
          target?.closest<HTMLElement>(".awards-toggle-board");
        const scrollRoot = document.querySelector<HTMLElement>(".scene.awards.active");
        const delta = event.deltaY;
        if (!scrollRoot || Math.abs(delta) < 18) return;

        if (canScrollInside(awardScrollRoot ?? null, delta) || canScrollInside(scrollRoot, delta)) {
          return;
        }

        event.preventDefault();
        return;
      }

      if (phase === "projects") {
        const activeTrack = track ?? projectTrackRef.current;
        if (!activeTrack) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        const delta = event.deltaX || event.deltaY;
        if (Math.abs(delta) < 12) return;

        const maxScroll = activeTrack.scrollWidth - activeTrack.clientWidth;
        const atEnd = activeTrack.scrollLeft >= maxScroll - 8;
        const atStart = activeTrack.scrollLeft <= 8;

        if (delta > 0) {
          if (atEnd) {
            return;
          }
          activeTrack.scrollBy({ left: Math.min(Math.max(Math.abs(delta), 260), window.innerWidth * 0.62), behavior: "smooth" });
          return;
        }

        if (delta < 0) {
          if (atStart) {
            return;
          }
          activeTrack.scrollBy({ left: -Math.min(Math.max(Math.abs(delta), 260), window.innerWidth * 0.62), behavior: "smooth" });
          return;
        }

        return;
      }

      if (Math.abs(event.deltaY) < 24) {
        return;
      }

      const scrollablePanel = target?.closest<HTMLElement>(
        ".content-panel, .intro-panel, .awards-toggle-board, .featured-project-shell, .contact-deck, .expanded-copy"
      );
      if (canScrollInside(scrollablePanel ?? null, event.deltaY)) {
        return;
      }

      const activeScene = target?.closest<HTMLElement>(".scene.active");
      if (canScrollInside(activeScene ?? null, event.deltaY)) {
        return;
      }

      event.preventDefault();
      navigate(event.deltaY > 0 ? 1 : -1);
    };

    const onKey = (event: KeyboardEvent) => {
      const phase = sections[active];
      if (selected) {
        if (event.key === "Escape") closeSelected();
        return;
      }
      if (phase === "projects" && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Backspace"].includes(event.key)) {
        const track = projectTrackRef.current;
        if (track) {
          const maxScroll = track.scrollWidth - track.clientWidth;
          const atEnd = track.scrollLeft >= maxScroll - 8;
          const atStart = track.scrollLeft <= 8;
          const forward = ["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key);
          const backward = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(event.key);

          if (forward) {
            event.preventDefault();
            if (atEnd) {
              return;
            } else {
              track.scrollBy({ left: Math.min(window.innerWidth * 0.62, 860), behavior: "smooth" });
            }
            return;
          }

          if (backward) {
            event.preventDefault();
            if (atStart) {
              return;
            } else {
              track.scrollBy({ left: -Math.min(window.innerWidth * 0.62, 860), behavior: "smooth" });
            }
            return;
          }
        }
      }
      if (phase === "awards" && ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Backspace"].includes(event.key)) {
        const scrollRoot = document.querySelector<HTMLElement>(".scene.awards.active");
        if (!scrollRoot) return;
        const maxScroll = scrollRoot.scrollHeight - scrollRoot.clientHeight;
        const atEnd = scrollRoot.scrollTop >= maxScroll - 8;
        const atStart = scrollRoot.scrollTop <= 8;
        if (["ArrowDown", "PageDown", " "].includes(event.key) && atEnd) {
          event.preventDefault();
          return;
        }
        if (["ArrowUp", "PageUp", "Backspace"].includes(event.key) && atStart) {
          event.preventDefault();
          return;
        }
      }
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        navigate(1);
      }
      if (["ArrowUp", "PageUp", "Backspace"].includes(event.key)) {
        event.preventDefault();
        navigate(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [active, selected, goBack, goForward, closeSelected]);

  const visibleItems = useMemo(() => content.items.filter((item) => item.visible), [content.items]);
  const awards = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "award")), [visibleItems]);
  const projects = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "project")), [visibleItems]);
  const education = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "education")), [visibleItems]);
  const experience = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "experience")), [visibleItems]);
  const certifications = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "certification")), [visibleItems]);
  const featuredProjects = useMemo(() => projects.filter((item) => item.featured).slice(0, 5), [projects]);
  const phase = sections[active] as SectionId;
  const activeNavTarget = useMemo(() => (navItems.some((item) => item.target === phase) ? phase : undefined), [phase]);
  const previousSection = sections[Math.max(active - 1, 0)];
  const nextSection = sections[Math.min(active + 1, sections.length - 1)];
  const awardBuckets = useMemo(
    () =>
      ["2023", "2024", "2025", "2026"].map((year) => ({
        year,
        items: awards.filter((item) => resolveBucketYear(item.year) === year)
      })),
    [awards]
  );

  return (
    <main className={`experience-shell phase-${phase} entered ${selected ? "has-modal" : ""}`}>
      <CursorFollower />
      <PolygonBackdrop active />
      <div className="time-layer" aria-hidden="true" />

      <header className={`topbar site-nav ${navOpen ? "open" : ""}`}>
        {active > 0 ? (
          <button className="topbar-back magnetic" onClick={goBack} aria-label="이전 페이지">
            ←
          </button>
        ) : null}
        <nav className="primary-nav" aria-label="빠른 이동">
          {navItems.map((item) => (
            <button
              key={item.target}
              className={`icon-button magnetic ${activeNavTarget === item.target ? "active" : ""}`}
              onClick={() => setSection(item.target)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="nav-toggle-wrap">
          <button className="menu-toggle magnetic" onClick={() => setNavOpen((value) => !value)} aria-label="메뉴 열기" aria-expanded={navOpen}>
            ☰
          </button>
          <div className="nav-menu-panel">
            <div className="nav-menu-links">
              {navItems.map((item) => (
                <button
                  key={item.target}
                  className={`icon-button magnetic ${activeNavTarget === item.target ? "active" : ""}`}
                  onClick={() => setSection(item.target)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <a className="icon-button magnetic admin-link" href="/admin">
              Admin
            </a>
          </div>
        </div>
      </header>

      <nav className="mobile-page-controls" aria-label="모바일 페이지 이동">
        <button type="button" className="mobile-page-button magnetic" onClick={goPreviousPage} disabled={active === 0}>
          <span>이전</span>
          <small>{sectionLabels[previousSection]}</small>
        </button>
        <div className="mobile-page-status" aria-live="polite">
          <span>{String(active + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}</span>
          <strong>{sectionLabels[phase]}</strong>
        </div>
        <button type="button" className="mobile-page-button next magnetic" onClick={goNextPage} disabled={active === sections.length - 1}>
          <span>다음</span>
          <small>{sectionLabels[nextSection]}</small>
        </button>
      </nav>

      <div className="scene-stack">
        <section className={`scene entrance ${active === 0 ? "active" : ""}`}>
          <div className="hero-copy">
            <p className="eyebrow">KWON YONGHYUN / CYBER JOURNEY PORTFOLIO</p>
            <h1 className="gradient-title">{content.settings.ownerKo}</h1>
            <h2>{content.settings.headlineKo}</h2>
            <p className="quote">"{content.settings.quoteKo}"</p>
            <button className="primary-cta magnetic" onClick={() => setSection("intro")}>
              START JOURNEY
            </button>
          </div>
          <div className="hud-note">Scroll / Backspace / Top navigation</div>
        </section>

        <section className={`scene intro ${active === 1 ? "active" : ""}`}>
          <div className="content-panel intro-panel">
            <p className="eyebrow">ENTRY PROFILE</p>
            <div className="intro-grid">
              <article className="large-statement impact-statement">
                <h2>
                  <span>현장문제를 이해하고</span>
                  <span>아이디어를 빠르게 검증하는</span>
                  <span className="gradient-line">개발자 권용현입니다.</span>
                </h2>
                <p>문제를 관찰하고, 작동하는 형태로 만들고, 검증된 결과를 다음 도전으로 연결합니다.</p>
              </article>
              <div className="strategy-stack">
                {["문제 관찰", "빠른 검증", "작동하는 제품", "공유와 확장"].map((step, index) => (
                  <span key={step}>
                    <b>0{index + 1}</b>
                    {step}
                  </span>
                ))}
              </div>
            </div>
            <div className="intro-detail-dock">
              <IntroColumn title="학력" items={education} onSelect={selectItem} />
              <IntroColumn title="경력" items={experience} onSelect={selectItem} />
              <IntroColumn title="자격" items={certifications} onSelect={selectItem} />
            </div>
          </div>
        </section>

        <section className={`scene resume ${active === 2 ? "active" : ""}`}>
          <div className="resume-fullscreen featured-project-shell">
            <div className="resume-heading">
              <p className="eyebrow">CURATED WORKS</p>
              <h2 className="panel-title">대표 프로젝트</h2>
              <p className="featured-project-intro">문제 인식부터 구현, 검증까지 가장 선명하게 남은 프로젝트를 한 화면에 정리했습니다.</p>
            </div>
            <div className="featured-project-layout">
              {featuredProjects[0] ? (
                <ProjectNewsCard
                  item={featuredProjects[0]}
                  index={0}
                  total={featuredProjects.length}
                  onSelect={selectItem}
                  large
                  fallbackImage="/assets/evidence/project-car-1.jpg"
                />
              ) : null}
              <div className="featured-project-grid">
                {featuredProjects.slice(1).map((item, index) => (
                  <ProjectNewsCard
                    key={item.id}
                    item={item}
                    index={index + 1}
                    total={featuredProjects.length}
                    onSelect={selectItem}
                    fallbackImage="/assets/evidence/project-car-1.jpg"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`scene crossroads ${active === 3 ? "active" : ""}`}>
          <div className="crossroad-grid">
            <button className="path-card awards-path magnetic" onClick={() => setSection("awards")}>
              <img src="/assets/evidence/award-collection.svg" alt="수상 기록 대표 이미지" />
              <span>AWARD ROUTE</span>
              <strong>수상 기록</strong>
              <small>도전이 외부의 인정으로 남은 기록을 확인합니다.</small>
            </button>
            <button className="path-card projects-path magnetic" onClick={() => setSection("projects")}>
              <img src="/assets/evidence/project-car-1.jpg" alt="자작차량 제작 프로젝트" />
              <span>PROJECT ROUTE</span>
              <strong>프로젝트 기록</strong>
              <small>아이디어가 실제 결과물로 검증된 과정을 탐색합니다.</small>
            </button>
            <button className="path-card contact-path magnetic" onClick={() => setSection("contact")}>
              <div className="path-glow" aria-hidden="true" />
              <span>CONTACT ROUTE</span>
              <strong>연결 지점</strong>
              <small>깃허브, 이메일, 블로그 등 외부 채널로 이어지는 마지막 연결 지점입니다.</small>
            </button>
          </div>
        </section>

        <section className={`scene awards ${active === 4 ? "active" : ""}`}>
          <AwardsYearBoard buckets={awardBuckets} onSelect={selectItem} />
        </section>

        <section className={`scene projects ${active === 5 ? "active" : ""}`}>
          <div className="project-stage carousel-mode">
            <div className="project-stage-header">
              <div>
                <p className="eyebrow">PROJECT SHOWCASE</p>
                <h2 className="panel-title">프로젝트 기록</h2>
              </div>
            </div>

            <ShowcaseDeck
              compact
              variant="project"
              eyebrow="DRAG TO EXPLORE"
              title=""
              items={projects}
              trackRef={projectTrackRef}
              onSelect={selectItem}
            />
          </div>
        </section>

        <section className={`scene contact ${active === 6 ? "active" : ""}`}>
          <Panel title="연결 지점" eyebrow="NEXT DESTINATION">
            <ContactDeck />
          </Panel>
        </section>
      </div>

      <AnimatePresence>
        {selected ? <ExpandedCard key={selected.id} item={selected} onClose={closeSelected} /> : null}
      </AnimatePresence>
    </main>
  );
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="content-panel">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="panel-title">{title}</h2>
      {children}
    </div>
  );
}

function IntroColumn({ title, items, onSelect }: { title: string; items: PortfolioItem[]; onSelect: (item: PortfolioItem) => void }) {
  return (
    <section>
      <h3>{title}</h3>
      {items.map((item) => (
        <button key={item.id} className="intro-detail-item magnetic" onClick={() => onSelect(item)}>
          <span>{item.year}</span>
          <strong>{koText(item, "title")}</strong>
        </button>
      ))}
    </section>
  );
}

function ResumeRail({
  title,
  items,
  onSelect
}: {
  title: string;
  items: PortfolioItem[];
  onSelect: (item: PortfolioItem) => void;
}) {
  return (
    <section className="resume-rail">
      <header>
        <span>{String(items.length).padStart(2, "0")}</span>
        <h3>{title}</h3>
      </header>
      <div className="resume-rail-list">
        {items.map((item) => (
          <button key={item.id} className="resume-chip magnetic" onClick={() => onSelect(item)}>
            <span>{item.year}</span>
            <strong>{koText(item, "title")}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function SpotlightRail({ label, title, items, onSelect }: { label: string; title: string; items: PortfolioItem[]; onSelect: (item: PortfolioItem) => void }) {
  return (
    <section className="spotlight-rail">
      <p>{label}</p>
      <h3>{title}</h3>
      <div>
        {items.map((item, index) => (
          <button key={item.id} className="spotlight-chip magnetic" onClick={() => onSelect(item)}>
            <span>{String(index + 1).padStart(2, "0")} / {item.year}</span>
            <strong>{koText(item, "title")}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function AwardsYearBoard({
  buckets,
  onSelect
}: {
  buckets: { year: string; items: PortfolioItem[] }[];
  onSelect: (item: PortfolioItem) => void;
}) {
  const initialYear = buckets.find((bucket) => bucket.items.length)?.year ?? buckets[0]?.year ?? "2025";
  const [activeYear, setActiveYear] = useState(initialYear);
  const simpleMobileList = useLightweightMobileMode();

  useEffect(() => {
    if (!buckets.some((bucket) => bucket.year === activeYear && bucket.items.length)) {
      startTransition(() => {
        setActiveYear(initialYear);
      });
    }
  }, [activeYear, buckets, initialYear]);

  const activeBucket = buckets.find((bucket) => bucket.year === activeYear) ?? buckets[0];

  return (
    <div className="content-panel awards-toggle-board">
      <div className="showcase-header">
        <div>
          <p className="eyebrow">AWARD ARCHIVE</p>
          <h2 className="panel-title">수상 기록</h2>
        </div>
        <span>2023 / 2024 / 2025 / 2026</span>
      </div>
      <div className="award-year-tabs" role="tablist" aria-label="연도별 수상 기록">
        {buckets.map((bucket) => (
          <button
            key={bucket.year}
            className={`magnetic ${bucket.year === activeYear ? "active" : ""}`}
            onClick={() => {
              startTransition(() => {
                setActiveYear(bucket.year);
              });
            }}
            role="tab"
            aria-selected={bucket.year === activeYear}
          >
            <strong>{bucket.year}</strong>
            <span>{bucket.items.length}개</span>
          </button>
        ))}
      </div>
      <section className="award-list-board">
        <header className="award-list-header">
          <div>
            <span>{activeBucket?.year}</span>
            <strong>{activeBucket?.items.length ?? 0}개 수상 기록</strong>
          </div>
          <p>좁은 칼럼 대신 연도별 기록을 넓은 리스트로 정리했습니다.</p>
        </header>
        <div className="award-list-stack">
          {activeBucket?.items.length ? (
            activeBucket.items.map((item, index) => (
              <AwardRecordCard key={item.id} item={item} index={index} onSelect={onSelect} simpleList={simpleMobileList} />
            ))
          ) : (
            <div className="award-empty-card">
              <strong>{activeBucket?.year}</strong>
              <p>아직 연결된 수상 기록이 없습니다.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function AwardRecordCard({
  item,
  index,
  onSelect,
  simpleList
}: {
  item: PortfolioItem;
  index: number;
  onSelect: (item: PortfolioItem) => void;
  simpleList: boolean;
}) {
  const awardTitle = splitAwardTitle(koText(item, "title"));
  const certificate = item.images.find((entry) => entry.role === "certificate") ?? item.images[0];

  return (
    <button
      className={`award-record-card magnetic ${certificate && !simpleList ? "has-certificate" : ""} ${simpleList ? "simple-list" : ""}`}
      onClick={() => onSelect(item)}
    >
      <div className="award-record-index">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <small>{item.year}</small>
      </div>
      {certificate && !simpleList ? (
        <div className="award-record-certificate" aria-hidden="true">
          <img src={certificate.url} alt="" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <div className="award-record-main">
        <strong>
          <span className="award-record-name">{awardTitle.name}</span>
          {awardTitle.prize ? <span className="award-prize-badge">{awardTitle.prize}</span> : null}
        </strong>
        <p>{koText(item, "summary")}</p>
      </div>
      <div className="award-record-tags">
        {item.tags.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </button>
  );
}

function ShowcaseDeck({
  eyebrow,
  title,
  items,
  trackRef,
  onSelect,
  fallbackImage,
  compact,
  variant
}: {
  eyebrow: string;
  title: string;
  items: PortfolioItem[];
  trackRef: RefObject<HTMLDivElement | null>;
  onSelect: (item: PortfolioItem) => void;
  fallbackImage?: string;
  compact?: boolean;
  variant?: "default" | "project";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const rafRef = useRef(0);
  const scrollSettleRef = useRef(0);
  const lightweightProjectMode = useLightweightMobileMode();
  const activeItem = items[Math.min(activeIndex, items.length - 1)];
  const activeVisual = activeItem ? resolveProjectVisual(activeItem) : "";

  const focusCard = (index: number) => {
    startTransition(() => {
      setActiveIndex(index);
    });
    window.requestAnimationFrame(() => {
      itemRefs.current[index]?.scrollIntoView({
        behavior: lightweightProjectMode ? "auto" : "smooth",
        inline: "center",
        block: "nearest"
      });
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActive = () => {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      itemRefs.current.forEach((node, index) => {
        if (!node) return;
        const nodeRect = node.getBoundingClientRect();
        const nodeCenter = nodeRect.left + nodeRect.width / 2;
        const distance = Math.abs(center - nodeCenter);
        if (distance < closestDistance) {
          closest = index;
          closestDistance = distance;
        }
      });
      setActiveIndex((value) => (value === closest ? value : closest));
    };

    const onScroll = () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(scrollSettleRef.current);
      if (variant === "project" && lightweightProjectMode) {
        scrollSettleRef.current = window.setTimeout(updateActive, 90);
        return;
      }
      rafRef.current = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActive);
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(scrollSettleRef.current);
    };
  }, [items, trackRef, variant, lightweightProjectMode]);

  return (
    <div className={`showcase-stage ${compact ? "compact" : ""} ${variant === "project" ? "project-reel-stage" : ""}`}>
      <div className="showcase-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          {title ? <h2 className="panel-title">{title}</h2> : null}
        </div>
        <span>DRAG / SCROLL</span>
      </div>
      {variant === "project" && activeItem ? (
        <div className="project-cinematic-shell">
          {lightweightProjectMode ? (
            <div className="project-background-stage project-background-stage-static">
              <img src={activeVisual} alt={koText(activeItem, "title")} loading="eager" decoding="async" />
              <div className="project-background-overlay" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <motion.div
                key={`${activeItem.id}-${activeVisual}`}
                className="project-background-stage"
                style={{ backgroundImage: `url(${activeVisual})` }}
                initial={{
                  opacity: 0,
                  scale: 0.42,
                  x: 250,
                  y: 170,
                  clipPath: "inset(42% 5% 8% 58% round 26px)"
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                  clipPath: "inset(0% 0% 0% 0% round 32px)"
                }}
                exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)", transition: { duration: 0.22 } }}
                transition={{ duration: 0.46, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <motion.img
                  key={activeVisual}
                  src={activeVisual}
                  alt={koText(activeItem, "title")}
                  initial={{ scale: 1.14 }}
                  animate={{ scale: 1.02 }}
                  exit={{ scale: 1.12 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="project-background-overlay" />
              </motion.div>
            </AnimatePresence>
          )}

          <aside className="project-story-panel">
            <span>
              {String(Math.min(activeIndex + 1, items.length)).padStart(2, "0")} / {String(items.length).padStart(2, "0")} · {activeItem.year}
            </span>
            <strong>{koText(activeItem, "title")}</strong>
            <p>{koText(activeItem, "summary")}</p>
            <div className="tag-row project-story-tags">
              {activeItem.tags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="project-story-actions">
              <button className="primary-cta magnetic" onClick={() => onSelect(activeItem)}>
                자세히 보기
              </button>
            </div>
          </aside>

          <div className="project-cards-dock">
            <div className={`showcase-track project-card-strip`} ref={trackRef} aria-label="프로젝트 카드 목록">
              {items.map((item, index) => (
                <CompactProjectCard
                  key={item.id}
                  item={item}
                  index={index}
                  total={items.length}
                  active={activeIndex === index}
                  register={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  onFocusCard={() => focusCard(index)}
                  onSelect={onSelect}
                  lightweight={lightweightProjectMode}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {variant !== "project" ? (
        <>
          <div className="showcase-track" ref={trackRef}>
            {items.map((item, index) => (
              <ReelsCard
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                onSelect={onSelect}
                fallbackImage={fallbackImage}
                active={activeIndex === index}
                register={(node) => {
                  itemRefs.current[index] = node;
                }}
                onFocusCard={() => focusCard(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function clickCardOnKey(event: ReactKeyboardEvent<HTMLElement>, onActivate: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onActivate();
  }
}

function ReelsCard({
  item,
  index,
  total,
  active,
  onSelect,
  onFocusCard,
  register,
  fallbackImage
}: {
  item: PortfolioItem;
  index: number;
  total: number;
  active: boolean;
  onSelect: (item: PortfolioItem) => void;
  onFocusCard: () => void;
  register: (node: HTMLElement | null) => void;
  fallbackImage?: string;
}) {
  const image = item.images[0]?.url ?? fallbackImage;
  const alt = item.images[0]?.altKo ?? koText(item, "title");

  const handleClick = () => {
    if (active) {
      onSelect(item);
      return;
    }
    onFocusCard();
  };

  return (
    <motion.article
      ref={register}
      className={`reels-card magnetic ${active ? "active" : ""}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => clickCardOnKey(event, handleClick)}
      animate={{
        scale: active ? 1.11 : 0.92,
        opacity: active ? 1 : 0.58,
        zIndex: active ? 5 : 1
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.8 }}
    >
      <motion.div className="reels-card-media">
        {image ? <img src={image} alt={alt} /> : <div className="image-placeholder" />}
      </motion.div>
      <motion.div className="reels-card-copy">
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <h3>{koText(item, "title")}</h3>
        <p>{koText(item, "summary")}</p>
        <div className="tag-row">{item.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <strong>{active ? "TAP TO OPEN" : "CENTER ME"}</strong>
      </motion.div>
    </motion.article>
  );
}

function CompactProjectCard({
  item,
  index,
  total,
  active,
  onSelect,
  onFocusCard,
  register,
  lightweight
}: {
  item: PortfolioItem;
  index: number;
  total: number;
  active: boolean;
  onSelect: (item: PortfolioItem) => void;
  onFocusCard: () => void;
  register: (node: HTMLElement | null) => void;
  lightweight: boolean;
}) {
  const image = resolveProjectVisual(item);
  const handleClick = () => {
    if (active) {
      onSelect(item);
      return;
    }
    onFocusCard();
  };
  const motionProps = lightweight
    ? {}
    : {
        animate: { opacity: active ? 1 : 0.54, y: active ? -12 : 4, scale: active ? 1.04 : 0.94 },
        transition: { type: "spring" as const, stiffness: 240, damping: 24, mass: 0.8 }
      };

  return (
    <motion.button
      ref={register}
      type="button"
      className={`project-rail-card magnetic ${active ? "active" : ""}`}
      onClick={handleClick}
      onKeyDown={(event) => clickCardOnKey(event, handleClick)}
      {...motionProps}
    >
      <motion.div className="project-rail-media">
        <img src={image} alt={koText(item, "title")} loading={index < 6 ? "eager" : "lazy"} decoding="async" />
      </motion.div>
      <div className="project-rail-copy">
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <strong>{koText(item, "title")}</strong>
      </div>
    </motion.button>
  );
}

function ProjectNewsCard({
  item,
  index,
  total,
  onSelect,
  large,
  fallbackImage
}: {
  item: PortfolioItem;
  index: number;
  total: number;
  onSelect: (item: PortfolioItem) => void;
  large?: boolean;
  fallbackImage?: string;
}) {
  const image = item.images[0]?.url ?? fallbackImage;
  const alt = item.images[0]?.altKo ?? koText(item, "title");

  return (
    <article
      className={`project-news-card magnetic ${large ? "large" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(event) => clickCardOnKey(event, () => onSelect(item))}
    >
      <div className="project-news-media">
        {image ? <img src={image} alt={alt} /> : <div className="image-placeholder" />}
      </div>
      <div className="project-news-copy">
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <h3>{koText(item, "title")}</h3>
        <p>{koText(item, "summary")}</p>
        <div className="tag-row">{item.tags.slice(0, large ? 5 : 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <button
          className="primary-cta magnetic"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(item);
          }}
        >
          자세히 보기
        </button>
      </div>
    </article>
  );
}

function ExpandedCard({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  const cover = item.images.find((entry) => entry.role === "cover") ?? item.images[0];
  const image = cover?.url ?? (item.type === "award" ? "/assets/evidence/award-collection.svg" : undefined);
  const alt = cover?.altKo ?? koText(item, "title");
  const entries = detailEntries(item);
  const hasDeepInfo = entries.length > 0 || Boolean(item.links?.length);
  const galleryImages = item.type === "project" ? projectGalleryImages(item) : item.images.filter((entry) => entry.url !== image);
  const videoLinks = item.type === "project" ? projectVideoLinks(item) : [];
  const hasMediaWall = galleryImages.length > 0 || videoLinks.length > 0;
  const copyRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({ active: false, startY: 0, scrollTop: 0 });
  const [copyDragging, setCopyDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<PortfolioImage | null>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const handleCopyPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, a, summary, img")) return;
    const node = copyRef.current;
    if (!node) return;
    dragStateRef.current = { active: true, startY: event.clientY, scrollTop: node.scrollTop };
    setCopyDragging(true);
    node.setPointerCapture?.(event.pointerId);
  };

  const handleCopyPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const node = copyRef.current;
    const state = dragStateRef.current;
    if (!node || !state.active) return;
    event.preventDefault();
    node.scrollTop = state.scrollTop - (event.clientY - state.startY);
  };

  const stopCopyDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    setCopyDragging(false);
    if (event && copyRef.current?.hasPointerCapture?.(event.pointerId)) {
      copyRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <motion.div
      className="expanded-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.article
        className="expanded-card"
        initial={{ opacity: 0, scale: 0.97, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 12 }}
        onClick={(event) => event.stopPropagation()}
        transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <motion.div className="expanded-media">
          {image ? <img src={image} alt={alt} /> : <div className="image-placeholder" />}
        </motion.div>
        <motion.div
          ref={copyRef}
          className={`expanded-copy ${copyDragging ? "dragging" : ""}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.12, duration: 0.28 }}
          onPointerDown={handleCopyPointerDown}
          onPointerMove={handleCopyPointerMove}
          onPointerUp={stopCopyDrag}
          onPointerCancel={stopCopyDrag}
        >
          <button
            type="button"
            className="modal-close magnetic"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            Close
          </button>
          <p className="eyebrow">{typeLabels[item.type].toUpperCase()} / {item.year}</p>
          <h2>{koText(item, "title")}</h2>
          <p>{koText(item, "summary")}</p>
          <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          {hasMediaWall ? (
            <div className="project-modal-media-wall">
              {galleryImages.length ? (
                <div className="modal-gallery expanded-gallery">
                  {galleryImages.slice(0, 6).map((galleryImage) => (
                    <button
                      type="button"
                      key={galleryImage.url}
                      className="gallery-zoom magnetic"
                      onClick={() => setPreviewImage(galleryImage)}
                    >
                      <img src={galleryImage.url} alt={galleryImage.altKo} />
                    </button>
                  ))}
                </div>
              ) : null}
              {videoLinks.length ? (
                <div className="modal-video-grid">
                  {videoLinks.map((link) => (
                    <a key={link.url} className="modal-video-card magnetic" href={link.url} target="_blank" rel="noreferrer">
                      <span>VIDEO</span>
                      <strong>{link.label}</strong>
                      <em>열어서 보기</em>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          {hasDeepInfo ? (
            <details className="detail-disclosure" open={item.type === "project"}>
              <summary>자세히 보기</summary>
              <div className="detail-stack">
                {entries.map(([label, value]) => (
                  <section key={label} className="detail-section">
                    <span>{label}</span>
                    {Array.isArray(value) ? (
                      <ul>
                        {value.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{value}</p>
                    )}
                  </section>
                ))}
                {item.links?.length ? (
                  <section className="detail-section">
                    <span>바로가기</span>
                    <div className="link-row">
                      {item.links.map((link) => (
                        <a key={link.url} className="button-link magnetic" href={link.url} target="_blank" rel="noreferrer">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            </details>
          ) : null}
        </motion.div>
      </motion.article>
      <AnimatePresence>
        {previewImage ? (
          <motion.div
            className="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(event) => {
              event.stopPropagation();
              setPreviewImage(null);
            }}
          >
            <button
              type="button"
              className="modal-close image-lightbox-close magnetic"
              onClick={(event) => {
                event.stopPropagation();
                setPreviewImage(null);
              }}
            >
              Close
            </button>
            <motion.img
              src={previewImage.url}
              alt={previewImage.altKo}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 190, damping: 22 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

function ContactDeck() {
  const contacts = [
    { label: "GitHub", value: "github.com/yhkwon2004", href: "https://github.com/yhkwon2004" },
    { label: "Instagram", value: "@dydgus_.0802", href: "https://www.instagram.com/dydgus_.0802/" },
    { label: "Email", value: "yhkwon2004@gmail.com", href: "mailto:yhkwon2004@gmail.com" },
    {
      label: "Naver Profile",
      value: "네이버 인물정보",
      href: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&mra=bjky&x_csa=%7B%22fromUi%22%3A%22kb%22%7D&pkid=1&os=40980397&qvt=0&query=%EA%B6%8C%EC%9A%A9%ED%98%84"
    },
    { label: "Blog", value: "blog.naver.com/procmd", href: "https://blog.naver.com/procmd" }
  ];

  return (
    <div className="contact-deck">
      <article className="contact-message">
        <h3>다음 도전은 연결되는 순간부터 시작됩니다.</h3>
        <p>관리자 CMS에서 실제 링크와 연락처를 추가하면 이 마지막 페이지가 외부 채널 허브로 확장됩니다.</p>
      </article>
      <div className="contact-grid">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            className="contact-card magnetic"
            href={contact.href}
            target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={contact.href.startsWith("mailto:") ? undefined : "noreferrer"}
          >
            <span>{contact.label}</span>
            <strong>{contact.value}</strong>
            <em>OPEN</em>
          </a>
        ))}
      </div>
    </div>
  );
}

function DetailModal({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <article className="detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close magnetic" onClick={onClose}>Close</button>
        <p className="eyebrow">{typeLabels[item.type].toUpperCase()} / {item.year}</p>
        <h2>{koText(item, "title")}</h2>
        <p>{koText(item, "summary")}</p>
        {item.images.length ? (
          <div className="modal-gallery">
            {item.images.map((image) => (
              <img key={image.url} src={image.url} alt={image.altKo} />
            ))}
          </div>
        ) : null}
        {item.links?.length ? (
          <div className="link-row">
            {item.links.map((link) => (
              <a key={link.url} className="button-link magnetic" href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
        <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </article>
    </div>
  );
}
