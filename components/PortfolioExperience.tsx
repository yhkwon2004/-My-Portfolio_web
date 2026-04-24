"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CursorFollower } from "./CursorFollower";
import { UnicornBackdrop } from "./UnicornBackdrop";
import type { PortfolioContent, PortfolioItem } from "@/lib/types";

type Props = {
  initialContent: PortfolioContent;
};

type ProjectView = "carousel" | "grid";

const sections = ["entrance", "intro", "resume", "crossroads", "awards", "projects", "contact"] as const;
type SectionId = (typeof sections)[number];

const navItems: { label: string; target: SectionId }[] = [
  { label: "메인페이지", target: "entrance" },
  { label: "이력", target: "resume" },
  { label: "수상", target: "awards" },
  { label: "프로젝트", target: "projects" },
  { label: "연락", target: "contact" }
];

const sectionLabels: Record<SectionId, string> = {
  entrance: "메인페이지",
  intro: "소개",
  resume: "이력",
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

export function PortfolioExperience({ initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [projectView, setProjectView] = useState<ProjectView>("carousel");
  const [showIntroDetails, setShowIntroDetails] = useState(false);
  const wheelLockRef = useRef(false);
  const awardTrackRef = useRef<HTMLDivElement | null>(null);
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

      if (phase === "awards" || phase === "projects") {
        if (track) {
          event.preventDefault();
          const delta = event.deltaX + event.deltaY;
          const maxScroll = track.scrollWidth - track.clientWidth;
          const atEnd = track.scrollLeft >= maxScroll - 8;
          const atStart = track.scrollLeft <= 8;

          if (delta > 0 && atEnd) {
            if (!wheelLockRef.current) {
              wheelLockRef.current = true;
              setSection("contact");
              window.setTimeout(() => {
                wheelLockRef.current = false;
              }, 920);
            }
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
  }, [active, selected]);

  const visibleItems = useMemo(() => content.items.filter((item) => item.visible), [content.items]);
  const awards = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "award")), [visibleItems]);
  const projects = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "project")), [visibleItems]);
  const education = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "education")), [visibleItems]);
  const experience = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "experience")), [visibleItems]);
  const certifications = useMemo(() => sortFeatured(visibleItems.filter((item) => item.type === "certification")), [visibleItems]);
  const featuredProjects = projects.filter((item) => item.featured).slice(0, 5);
  const featuredAwards = awards.filter((item) => item.featured).slice(0, 4);
  const phase = sections[active] as SectionId;
  const currentLabel = sectionLabels[phase];
  const activeNavTarget = navItems.some((item) => item.target === phase) ? phase : undefined;

  const scrollTrack = (ref: RefObject<HTMLDivElement | null>, direction: 1 | -1) => {
    ref.current?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.82, 1040), behavior: "smooth" });
  };

  return (
    <main className={`experience-shell phase-${phase}`}>
      <CursorFollower />
      <UnicornBackdrop />
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
        <div className="current-page-chip" aria-live="polite">
          <span>CURRENT</span>
          <strong>{currentLabel}</strong>
        </div>
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
                <p className="hello-kicker">안녕하세요.</p>
                <h2>
                  <span>현장문제를 이해하고</span>
                  <span>아이디어를 빠르게 검증하는</span>
                  <span className="gradient-line">개발자 권용현입니다.</span>
                </h2>
                <p>문제를 관찰하고, 작동하는 형태로 만들고, 검증된 결과를 다음 도전으로 연결합니다.</p>
                <button className="primary-cta magnetic" onClick={() => setShowIntroDetails((value) => !value)}>
                  {showIntroDetails ? "CLOSE DETAILS" : "상세 정보 보기"}
                </button>
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
            {showIntroDetails ? (
              <div className="intro-detail-dock">
                <IntroColumn title="EDUCATION" items={education} onSelect={setSelected} />
                <IntroColumn title="EXPERIENCE" items={experience} onSelect={setSelected} />
                <IntroColumn title="CERTIFICATION" items={certifications} onSelect={setSelected} />
              </div>
            ) : null}
          </div>
        </section>

        <section className={`scene resume ${active === 2 ? "active" : ""}`}>
          <div className="resume-fullscreen">
            <div className="resume-heading">
              <p className="eyebrow">ROUTE LOG</p>
              <h2 className="panel-title">이력</h2>
            </div>
            <div className="resume-spotlight">
              <SpotlightRail label="FEATURED AWARDS" title="대표 수상" items={featuredAwards} onSelect={setSelected} />
              <SpotlightRail label="FEATURED PROJECTS" title="대표 프로젝트" items={featuredProjects} onSelect={setSelected} />
            </div>
            <div className="resume-map compact-map">
              <ResumeRail title="학력" items={education} onSelect={setSelected} />
              <ResumeRail title="경력" items={experience} onSelect={setSelected} />
              <ResumeRail title="자격" items={certifications} onSelect={setSelected} />
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
          </div>
        </section>

        <section className={`scene awards ${active === 4 ? "active" : ""}`}>
          <BackArrow onClick={() => setSection("crossroads")} />
          <ShowcaseDeck
            eyebrow="AWARD SHOWCASE"
            title="수상 기록"
            items={awards}
            trackRef={awardTrackRef}
            onSelect={setSelected}
            onPrev={() => scrollTrack(awardTrackRef, -1)}
            onNext={() => scrollTrack(awardTrackRef, 1)}
            onExitEnd={() => setSection("contact")}
            fallbackImage="/assets/evidence/award-collection.svg"
          />
        </section>

        <section className={`scene projects ${active === 5 ? "active" : ""}`}>
          <BackArrow onClick={() => setSection("crossroads")} />
          <div className="project-stage">
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
                onExitEnd={() => setSection("contact")}
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

function ShowcaseDeck({
  eyebrow,
  title,
  items,
  trackRef,
  onSelect,
  onPrev,
  onNext,
  onExitEnd,
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
  onExitEnd?: () => void;
  fallbackImage?: string;
  compact?: boolean;
  variant?: "default" | "project";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const rafRef = useRef(0);
  const activeItem = items[Math.min(activeIndex, items.length - 1)];

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
        <div className="project-reel-banner">
          <div className="project-reel-copy">
            <span>
              {String(Math.min(activeIndex + 1, items.length)).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <strong>{koText(activeItem, "title")}</strong>
            <p>{koText(activeItem, "summary")}</p>
          </div>
          <div className="project-reel-meta">
            {activeItem.tags.slice(0, 4).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      ) : null}
      <div className={`showcase-track ${variant === "project" ? "project-track" : ""}`} ref={trackRef}>
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
            onFocusCard={() => {
              itemRefs.current[index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }}
          />
        ))}
        {onExitEnd ? (
          <ReelsExitCard
            active={activeIndex === items.length}
            register={(node) => {
              itemRefs.current[items.length] = node;
            }}
            onFocusCard={() => {
              itemRefs.current[items.length]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }}
            onExit={onExitEnd}
          />
        ) : null}
      </div>
      <div className="project-controls">
        <button className="magnetic" onClick={onPrev}>PREV</button>
        <button className="magnetic" onClick={onNext}>NEXT</button>
      </div>
    </div>
  );
}

function ReelsExitCard({
  active,
  register,
  onFocusCard,
  onExit
}: {
  active: boolean;
  register: (node: HTMLElement | null) => void;
  onFocusCard: () => void;
  onExit: () => void;
}) {
  const handleClick = () => {
    if (active) {
      onExit();
      return;
    }
    onFocusCard();
  };

  return (
    <motion.article
      ref={register}
      className={`reels-card reels-exit-card magnetic ${active ? "active" : ""}`}
      onClick={handleClick}
      animate={{
        scale: active ? 1.08 : 0.9,
        opacity: active ? 1 : 0.56,
        zIndex: active ? 5 : 1
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.8 }}
    >
      <div className="reels-exit-orbit" aria-hidden="true" />
      <div className="reels-card-copy">
        <span>NEXT DESTINATION</span>
        <h3>연락 페이지로 이동</h3>
        <p>이 기록의 끝에서 다음 연결 지점으로 이동합니다.</p>
        <strong>{active ? "TAP TO ENTER" : "CENTER ME"}</strong>
      </div>
    </motion.article>
  );
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
      onClick={handleClick}
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
    <article className={`project-news-card ${large ? "large" : ""}`}>
      <div className="project-news-media">
        {image ? <img src={image} alt={alt} /> : <div className="image-placeholder" />}
      </div>
      <div className="project-news-copy">
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <h3>{koText(item, "title")}</h3>
        <p>{koText(item, "summary")}</p>
        <div className="tag-row">{item.tags.slice(0, large ? 5 : 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <button className="primary-cta magnetic" onClick={() => onSelect(item)}>자세히 보기</button>
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
