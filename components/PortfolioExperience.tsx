"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CursorFollower } from "./CursorFollower";
import { PolygonBackdrop } from "./PolygonBackdrop";
import type { PortfolioContent, PortfolioItem } from "@/lib/types";

type Props = {
  initialContent: PortfolioContent;
};

type ProjectView = "carousel" | "grid";

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
  if (item.images[0]?.url) return item.images[0].url;

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

export function PortfolioExperience({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [projectView, setProjectView] = useState<ProjectView>("carousel");
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

  const setSection = (section: SectionId) => {
    setSelected(null);
    setNavOpen(false);
    setActive(sectionIndex(section));
  };

  const goBack = () => {
    setSelected(null);
    setActive((value) => {
      const current = sections[value];
      if (current === "awards" || current === "projects") return value;
      if (current === "contact") return sectionIndex("crossroads");
      return Math.max(0, value - 1);
    });
  };

  const goForward = () => {
    setSelected(null);
    setActive((value) => {
      const current = sections[value];
      if (current === "entrance") return sectionIndex("intro");
      if (current === "intro") return sectionIndex("resume");
      if (current === "resume") return sectionIndex("crossroads");
      return value;
    });
  };

  useEffect(() => {
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
      const grid = target?.closest<HTMLElement>(".project-news-grid");

      if (selected) {
        event.preventDefault();
        return;
      }

      if (phase === "awards") {
        return;
      }

      if (phase === "projects") {
        if (projectView === "grid") {
          return;
        }
        if (track) {
          event.preventDefault();
          const delta = event.deltaX + event.deltaY;
          const maxScroll = track.scrollWidth - track.clientWidth;
          const atEnd = track.scrollLeft >= maxScroll - 8;
          const atStart = track.scrollLeft <= 8;

          if (delta > 0 && atEnd) {
            return;
          }

          if (delta < 0 && atStart) {
            return;
          }

          track.scrollBy({ left: delta, behavior: "smooth" });
          return;
        }
        if (grid) {
          return;
        }
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < 24) {
        return;
      }
      event.preventDefault();
      navigate(event.deltaY > 0 ? 1 : -1);
    };

    const onKey = (event: KeyboardEvent) => {
      const phase = sections[active];
      if (selected) {
        if (event.key === "Escape") setSelected(null);
        return;
      }
      if ((phase === "awards" || phase === "projects") && ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " ", "Backspace"].includes(event.key)) {
        if (phase === "projects" && projectView === "grid") {
          return;
        }
        event.preventDefault();
        return;
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
  }, [active, selected, projectView]);

  const visibleItems = useMemo(() => content.items.filter((item) => item.visible), [content.items]);
  const awards = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "award")), [visibleItems]);
  const projects = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "project")), [visibleItems]);
  const education = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "education")), [visibleItems]);
  const experience = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "experience")), [visibleItems]);
  const certifications = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "certification")), [visibleItems]);
  const featuredProjects = projects.filter((item) => item.featured).slice(0, 5);
  const phase = sections[active] as SectionId;
  const activeNavTarget = navItems.some((item) => item.target === phase) ? phase : undefined;
  const awardBuckets = useMemo(
    () =>
      ["2023", "2024", "2025", "2026"].map((year) => ({
        year,
        items: awards.filter((item) => resolveBucketYear(item.year) === year)
      })),
    [awards]
  );

  const scrollTrack = (ref: RefObject<HTMLDivElement | null>, direction: 1 | -1) => {
    ref.current?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.82, 1040), behavior: "smooth" });
  };

  return (
    <main className={`experience-shell phase-${phase} entered`}>
      <CursorFollower />
      <PolygonBackdrop active />
      <div className="time-layer" aria-hidden="true" />

      <header className={`topbar site-nav ${navOpen ? "open" : ""}`}>
        <button className="menu-toggle magnetic" onClick={() => setNavOpen((value) => !value)} aria-label="메뉴 열기">
          ☰
        </button>
        <nav aria-label="빠른 이동">
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
        <a className="icon-button magnetic admin-link" href="/admin">
          Admin
        </a>
      </header>

      {active > 0 ? (
        <button className="prev-route magnetic" onClick={goBack} aria-label="이전 페이지">
          ←
        </button>
      ) : null}

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
              <IntroColumn title="학력" items={education} onSelect={setSelected} />
              <IntroColumn title="경력" items={experience} onSelect={setSelected} />
              <IntroColumn title="자격" items={certifications} onSelect={setSelected} />
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
                  onSelect={setSelected}
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
                    onSelect={setSelected}
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
          <BackArrow onClick={() => setSection("crossroads")} />
          <AwardsYearBoard buckets={awardBuckets} onSelect={setSelected} />
        </section>

        <section className={`scene projects ${active === 5 ? "active" : ""} ${projectView === "grid" ? "grid-view" : ""}`}>
          <BackArrow onClick={() => setSection("crossroads")} />
          <div className={`project-stage ${projectView === "grid" ? "grid-mode" : "carousel-mode"}`}>
            <div className="project-stage-header">
              <div>
                <p className="eyebrow">PROJECT SHOWCASE</p>
                <h2 className="panel-title">프로젝트 기록</h2>
              </div>
              <div className="project-view-toggle" role="tablist" aria-label="프로젝트 보기 방식">
                <button className={projectView === "carousel" ? "active" : ""} onClick={() => setProjectView("carousel")}>
                  CAROUSEL
                </button>
                <button className={projectView === "grid" ? "active" : ""} onClick={() => setProjectView("grid")}>
                  ALL CARDS
                </button>
              </div>
            </div>

            {projectView === "carousel" ? (
              <ShowcaseDeck
                compact
                variant="project"
                eyebrow="DRAG TO EXPLORE"
                title=""
                items={projects}
                trackRef={projectTrackRef}
                onSelect={setSelected}
                onPrev={() => scrollTrack(projectTrackRef, -1)}
                onNext={() => scrollTrack(projectTrackRef, 1)}
              />
            ) : (
              <div className="project-news-grid">
                {projects.map((item, index) => (
                  <ProjectNewsCard key={item.id} item={item} index={index} total={projects.length} onSelect={setSelected} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={`scene contact ${active === 6 ? "active" : ""}`}>
          <Panel title="연결 지점" eyebrow="NEXT DESTINATION">
            <ContactDeck />
          </Panel>
        </section>
      </div>

      <AnimatePresence>
        {selected ? <ExpandedCard key={selected.id} item={selected} onClose={() => setSelected(null)} /> : null}
      </AnimatePresence>
    </main>
  );
}

function BackArrow({ onClick }: { onClick: () => void }) {
  return (
    <button className="route-back-arrow magnetic" onClick={onClick} aria-label="갈림길로 돌아가기">
      ⌫
    </button>
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

  useEffect(() => {
    if (!buckets.some((bucket) => bucket.year === activeYear && bucket.items.length)) {
      setActiveYear(initialYear);
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
            onClick={() => setActiveYear(bucket.year)}
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
              <button key={item.id} className="award-record-card magnetic" onClick={() => onSelect(item)}>
                <div className="award-record-index">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{item.year}</small>
                </div>
                <div className="award-record-main">
                  <strong>{koText(item, "title")}</strong>
                  <p>{koText(item, "summary")}</p>
                </div>
                <div className="award-record-tags">
                  {item.tags.slice(0, 4).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </button>
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

function ShowcaseDeck({
  eyebrow,
  title,
  items,
  trackRef,
  onSelect,
  onPrev,
  onNext,
  fallbackImage,
  compact,
  variant
}: {
  eyebrow: string;
  title: string;
  items: PortfolioItem[];
  trackRef: RefObject<HTMLDivElement | null>;
  onSelect: (item: PortfolioItem) => void;
  onPrev: () => void;
  onNext: () => void;
  fallbackImage?: string;
  compact?: boolean;
  variant?: "default" | "project";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const rafRef = useRef(0);
  const activeItem = items[Math.min(activeIndex, items.length - 1)];
  const nextItem = items.length > 1 ? items[(activeIndex + 1) % items.length] : activeItem;

  const focusCard = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActive = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      itemRefs.current.forEach((node, index) => {
        if (!node) return;
        const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
        const distance = Math.abs(center - nodeCenter);
        if (distance < closestDistance) {
          closest = index;
          closestDistance = distance;
        }
      });
      setActiveIndex(closest);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActive);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [items, trackRef]);

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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              className="project-background-stage"
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
              exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
              transition={{ duration: 0.68, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <motion.img
                src={resolveProjectVisual(activeItem)}
                alt={koText(activeItem, "title")}
                initial={{ scale: 1.14 }}
                animate={{ scale: 1.02 }}
                exit={{ scale: 1.12 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="project-background-overlay" />
            </motion.div>
          </AnimatePresence>

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
                />
              ))}
            </div>
            <div className="project-controls floating">
              <button className="magnetic" onClick={onPrev}>PREV</button>
              <button className="magnetic" onClick={onNext}>NEXT</button>
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
          <div className="project-controls">
            <button className="magnetic" onClick={onPrev}>PREV</button>
            <button className="magnetic" onClick={onNext}>NEXT</button>
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
      layoutId={`portfolio-card-${item.id}`}
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
      <motion.div className="reels-card-media" layoutId={`portfolio-card-media-${item.id}`}>
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
  register
}: {
  item: PortfolioItem;
  index: number;
  total: number;
  active: boolean;
  onSelect: (item: PortfolioItem) => void;
  onFocusCard: () => void;
  register: (node: HTMLElement | null) => void;
}) {
  const image = resolveProjectVisual(item);
  const handleClick = () => {
    if (active) {
      onSelect(item);
      return;
    }
    onFocusCard();
  };

  return (
    <motion.button
      ref={register}
      type="button"
      layoutId={`portfolio-card-${item.id}`}
      className={`project-rail-card magnetic ${active ? "active" : ""}`}
      onClick={handleClick}
      onKeyDown={(event) => clickCardOnKey(event, handleClick)}
      animate={{ opacity: active ? 1 : 0.54, y: active ? -12 : 4, scale: active ? 1.04 : 0.94 }}
      transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.8 }}
    >
      <motion.div className="project-rail-media" layoutId={`portfolio-card-media-${item.id}`}>
        <img src={image} alt={koText(item, "title")} />
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
  const image = item.images[0]?.url ?? (item.type === "award" ? "/assets/evidence/award-collection.svg" : undefined);
  const alt = item.images[0]?.altKo ?? koText(item, "title");
  const entries = detailEntries(item);
  const hasDeepInfo = entries.length > 0 || Boolean(item.links?.length);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

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
        layoutId={`portfolio-card-${item.id}`}
        onClick={(event) => event.stopPropagation()}
        transition={{ type: "spring", stiffness: 210, damping: 26, mass: 0.95 }}
      >
        <motion.div className="expanded-media" layoutId={`portfolio-card-media-${item.id}`}>
          {image ? <img src={image} alt={alt} /> : <div className="image-placeholder" />}
        </motion.div>
        <motion.div
          className="expanded-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.12, duration: 0.28 }}
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
          {item.images.length > 1 ? (
            <div className="modal-gallery expanded-gallery">
              {item.images.slice(1).map((galleryImage) => (
                <img key={galleryImage.url} src={galleryImage.url} alt={galleryImage.altKo} />
              ))}
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
    </motion.div>
  );
}

function ContactDeck() {
  const contacts = [
    { label: "GitHub", value: "깃허브 링크 연결 공간" },
    { label: "Instagram", value: "인스타그램 링크 연결 공간" },
    { label: "Email", value: "이메일 주소 연결 공간" },
    { label: "Naver Profile", value: "네이버 인물정보 링크 공간" },
    { label: "Blog", value: "블로그 링크 연결 공간" }
  ];

  return (
    <div className="contact-deck">
      <article className="contact-message">
        <h3>다음 도전은 연결되는 순간부터 시작됩니다.</h3>
        <p>관리자 CMS에서 실제 링크와 연락처를 추가하면 이 마지막 페이지가 외부 채널 허브로 확장됩니다.</p>
      </article>
      <div className="contact-grid">
        {contacts.map((contact) => (
          <div key={contact.label} className="contact-card">
            <span>{contact.label}</span>
            <strong>{contact.value}</strong>
          </div>
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
