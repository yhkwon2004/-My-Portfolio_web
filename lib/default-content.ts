import type { PortfolioContent, PortfolioItem } from "./types";

const now = new Date().toISOString();

const item = (input: Omit<PortfolioItem, "visible" | "featured" | "featuredRank" | "images" | "tags"> & Partial<PortfolioItem>): PortfolioItem => ({
  visible: true,
  featured: false,
  featuredRank: 99,
  images: [],
  tags: [],
  ...input
});

const awardArchiveImage = {
  url: "/assets/evidence/award-collection.svg",
  altKo: "수상 기록 모음",
  altEn: "Award archive collection",
  role: "certificate" as const
};

export const defaultContent: PortfolioContent = {
  updatedAt: now,
  settings: {
    ownerKo: "권용현",
    ownerEn: "Yonghyun Kwon",
    headlineKo: "도전과 함께 성장하는 문제 해결 기반 성장 전략가",
    headlineEn: "A challenge-driven growth strategist who turns field problems into working products",
    quoteKo: "경험과 도전은 나눔에서 이루어진다",
    quoteEn: "Experience and challenge become meaningful when shared.",
    defaultLocale: "ko",
    defaultTheme: "dark",
    backgrounds: {
      entrance: "/assets/generated/portal-entrance.png",
      growth: "/assets/generated/growth-corridor.png",
      library: "/assets/generated/awards-library.png",
      lab: "/assets/generated/project-lab.png"
    }
  },
  items: [
    item({
      id: "profile-main",
      type: "profile",
      titleKo: "현장 문제를 이해하고, 동작하는 제품으로 빠르게 검증하는 개발자",
      titleEn: "Developer who understands field problems and validates them with working products",
      summaryKo: "컴퓨터 소프트웨어, 스마트 모빌리티, 하드웨어 제작, 펌웨어, 창업 실험을 연결해 실제 문제를 해결하는 프로젝트를 만듭니다.",
      summaryEn: "I connect computer software, smart mobility, hardware prototyping, firmware, and startup experiments to build products that solve real problems.",
      tags: ["Problem Solving", "Mobility", "H/W", "F/W", "AI"],
      featured: true,
      featuredRank: 1
    }),
    item({
      id: "edu-yangji",
      type: "education",
      titleKo: "양지 고등학교",
      titleEn: "Yangji High School",
      summaryKo: "2019 ~ 2022",
      summaryEn: "2019 ~ 2022",
      year: "2019-2022"
    }),
    item({
      id: "edu-wku",
      type: "education",
      titleKo: "원광대학교 컴퓨터 소프트웨어 공학과",
      titleEn: "Wonkwang University, Computer Software Engineering",
      summaryKo: "2023 ~ 2029",
      summaryEn: "2023 ~ 2029",
      year: "2023-2029"
    }),
    item({
      id: "edu-jst",
      type: "education",
      titleKo: "JST 공유대학교 스마트 모빌리티 SW공학과",
      titleEn: "JST Shared University, Smart Mobility Software Engineering",
      summaryKo: "전북대학교 연계 스마트 모빌리티 SW 전공",
      summaryEn: "Smart mobility software program connected with Jeonbuk National University",
      year: "2023-2029",
      tags: ["Smart Mobility"]
    }),
    item({
      id: "exp-gantts",
      type: "experience",
      titleKo: "산학 프로젝트: GAN-TTS 개발 참여",
      titleEn: "Industry-academic project: GAN-TTS development",
      summaryKo: "사투리와 자연스러운 한국어 음성을 지원하는 TTS 모델 연구와 제작에 참여했습니다.",
      summaryEn: "Contributed to a TTS model supporting dialect-aware and natural Korean speech.",
      year: "2023-2024",
      tags: ["AI", "TTS", "Research"]
    }),
    item({
      id: "exp-drone-instructor",
      type: "experience",
      titleKo: "초경량 무인 멀티콥터 지도조종자 | 교육 교관",
      titleEn: "Ultralight multicopter instructor",
      summaryKo: "무인 멀티콥터 조종과 교육 운영 경험을 쌓았습니다.",
      summaryEn: "Built experience in multicopter piloting and instructor-led education.",
      year: "2024-2025",
      tags: ["Drone", "Instruction"]
    }),
    item({
      id: "exp-cnu",
      type: "experience",
      titleKo: "전남대 인턴십 프로그램 1위 평가",
      titleEn: "Top-ranked evaluation in Chonnam National University internship program",
      summaryKo: "문제 해결력과 실행력을 바탕으로 인턴십 프로그램에서 1위 평가를 받았습니다.",
      summaryEn: "Earned the top evaluation based on execution and problem-solving ability.",
      year: "2025-2026",
      featured: true,
      featuredRank: 5
    }),
    item({
      id: "exp-recap",
      type: "experience",
      titleKo: "Re:cap | 대표",
      titleEn: "Re:cap | Founder",
      summaryKo: "업사이클 제품 제작과 사업화를 진행하는 팀을 이끌었습니다.",
      summaryEn: "Led a team building and commercializing upcycled products.",
      year: "2025-2026",
      tags: ["Startup", "Upcycling"],
      featured: true,
      featuredRank: 4
    }),
    item({
      id: "exp-iot-lab",
      type: "experience",
      titleKo: "사물인터넷연구실 | H/W(PCB, 3D) / F/W",
      titleEn: "IoT Lab | Hardware, PCB, 3D, firmware",
      summaryKo: "PCB, 3D 설계, 펌웨어 기반 하드웨어 제품 실험을 진행했습니다.",
      summaryEn: "Worked on hardware product experiments across PCB, 3D design, and firmware.",
      year: "2025-2026",
      tags: ["PCB", "Firmware", "3D"]
    }),
    item({
      id: "cert-drone-1",
      type: "certification",
      titleKo: "초경량 무인 멀티콥터 조종자격 1종",
      titleEn: "Ultralight multicopter pilot certificate, class 1",
      summaryKo: "2018 취득",
      summaryEn: "Earned in 2018",
      year: "2018",
      tags: ["Drone"]
    }),
    item({
      id: "cert-ecommerce",
      type: "certification",
      titleKo: "글로벌 이커머스 전문가 자격",
      titleEn: "Global e-commerce specialist certificate",
      summaryKo: "2023 취득",
      summaryEn: "Earned in 2023",
      year: "2023"
    }),
    item({
      id: "cert-drone-instructor",
      type: "certification",
      titleKo: "초경량 무인멀티콥터 지도조종자(교관)",
      titleEn: "Ultralight multicopter instructor certificate",
      summaryKo: "2024 취득",
      summaryEn: "Earned in 2024",
      year: "2024",
      tags: ["Drone", "Instructor"]
    }),
    item({
      id: "cert-aipot",
      type: "certification",
      titleKo: "AI-POT 2급",
      titleEn: "AI-POT level 2",
      summaryKo: "2025 취득",
      summaryEn: "Earned in 2025",
      year: "2025",
      tags: ["AI"]
    }),
    item({
      id: "cert-3d-printer",
      type: "certification",
      titleKo: "3D Printer User (Inventor 3D)",
      titleEn: "3D Printer User (Inventor 3D)",
      summaryKo: "2025 취득",
      summaryEn: "Earned in 2025",
      year: "2025",
      tags: ["3D", "Inventor"]
    }),
    item({
      id: "award-school-video-2023",
      type: "award",
      titleKo: "슬기로운 학교생활 영상공모전 · 3위",
      titleEn: "School life video contest · 3rd place",
      summaryKo: "드론 촬영 기법과 영상 편집을 결합해 대학교 전경과 시설을 효과적으로 담아낸 학교 홍보 영상을 제작했습니다.",
      summaryEn: "Created a promotional university video using drone cinematography and editing.",
      year: "2023-06-21",
      tags: ["3위", "드론", "영상"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-smart-healthcare-2023",
      type: "award",
      titleKo: "스마트헬스케어 SW비교과 경진대회 · 우수상",
      titleEn: "Smart healthcare SW contest · Excellence Award",
      summaryKo: "C#과 Unity를 활용해 재활 환자의 움직임을 반영하는 VR 헬스케어 게임을 설계하고 구현했습니다.",
      summaryEn: "Built a VR healthcare rehab game with C# and Unity.",
      year: "2023-08-31",
      tags: ["우수상", "VR", "Healthcare"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-job-mock-interview-2023",
      type: "award",
      titleKo: "SW취업컨설팅 및 모의면접 경진대회 · 장려상",
      titleEn: "SW mock interview contest · Encouragement Award",
      summaryKo: "압박면접, 토론면접, PT면접 등 실전형 면접 과정을 수행하며 구조적 전달력과 대응 역량을 강화했습니다.",
      summaryEn: "Strengthened real-world interview, presentation, and response skills.",
      year: "2023-11-14",
      tags: ["장려상", "면접", "커뮤니케이션"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-ticket-dream-2023",
      type: "award",
      titleKo: "Ticket to the Dream 대학생 해커톤 · 최우수상",
      titleEn: "Ticket to the Dream hackathon · Grand Prize",
      summaryKo: "리프트와 집게 메커니즘을 적용한 로봇 밀어내기 프로젝트를 수행하며 3D 모델링, 배선, 제어 앱 개발을 통합했습니다.",
      summaryEn: "Integrated 3D modeling, wiring, and control-app development in a robot hackathon.",
      year: "2023-12-10",
      tags: ["최우수상", "로봇", "Hackathon"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-ros-car-2023",
      type: "award",
      titleKo: "ROS 기반 자율주행 자동차 경진대회 · 우수상",
      titleEn: "ROS autonomous driving contest · Excellence Award",
      summaryKo: "Pixhawk, GPS, Mission Planner와 ROS를 연결해 자율주행 로버와 비행 제어 로직을 설계하고 최적화했습니다.",
      summaryEn: "Built and optimized a ROS-based autonomous rover and flight control system.",
      year: "2023-12-20",
      tags: ["우수상", "ROS", "자율주행"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-adventure-design-2023",
      type: "award",
      titleKo: "Adventure Design 경진대회 · 우수상",
      titleEn: "Adventure Design contest · Excellence Award",
      summaryKo: "자율주행 로직을 중심으로 하드웨어 설계와 소프트웨어 제어를 결합한 시스템 설계를 제안했습니다.",
      summaryEn: "Proposed a system design combining autonomous logic with hardware and software control.",
      year: "2023-12-22",
      tags: ["우수상", "설계", "Mobility"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-sw-startup-2023",
      type: "award",
      titleKo: "실전 SW창업교육 및 창업경진대회 · 최우수상",
      titleEn: "Practical SW startup contest · Grand Prize",
      summaryKo: "글로벌 이커머스 역량을 바탕으로 시장 분석, 타겟 설정, 플랫폼 전략까지 사업화 관점의 기획을 구체화했습니다.",
      summaryEn: "Developed a commercialization-oriented startup concept based on e-commerce strategy.",
      year: "2023-12-28",
      tags: ["최우수상", "창업", "E-commerce"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-product-camp-2024",
      type: "award",
      titleKo: "2023 호남제주권 제품 제작 역량강화 캠프 · 우수상",
      titleEn: "Honam-Jeju product camp · Excellence Award",
      summaryKo: "온도·가스 센서와 외부 환경 데이터를 연동하는 스마트 IoT 선풍기를 제작하며 하드웨어와 임베디드 제어를 통합했습니다.",
      summaryEn: "Built a smart IoT fan by integrating sensors, external data, and embedded control.",
      year: "2024-01-26",
      tags: ["우수상", "IoT", "Embedded"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-educart-2024",
      type: "award",
      titleKo: "에듀카트 기반 비즈니스모델 개발 캠프 · 우수상",
      titleEn: "EduCart business model camp · Excellence Award",
      summaryKo: "아두이노 메가 기반 전원 관리, 브레이크·배터리 센싱, 직관적 조작 인터페이스를 갖춘 실제 탑승형 차량 구조를 개발했습니다.",
      summaryEn: "Developed a rideable vehicle concept with Arduino-based sensing and power control.",
      year: "2024-05-25",
      tags: ["우수상", "Arduino", "Vehicle"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-psst-2024",
      type: "award",
      titleKo: "PSST 창업 시뮬레이션 연합 캠프 · 최우수상",
      titleEn: "PSST startup simulation camp · Grand Prize",
      summaryKo: "복수 쇼핑몰을 하나의 계정으로 연결하는 통합 패션 쇼핑 앱을 기획하며 플랫폼 문제 해결과 창업 모델을 설계했습니다.",
      summaryEn: "Designed a unified fashion shopping app and startup model.",
      year: "2024-05-31",
      tags: ["최우수상", "앱", "플랫폼"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-linc-creative-2024",
      type: "award",
      titleKo: "2024학년도 LINC 3.0 창의대첩 · 대상",
      titleEn: "LINC 3.0 creative competition · Grand Prize",
      summaryKo: "발효 백출 기반 기능성 식혜를 기획하고 브릭스 수치 분석과 실험 데이터 시각화로 최적 제조 조건을 도출했습니다.",
      summaryEn: "Planned a fermented beverage product and derived optimal conditions through data analysis.",
      year: "2024-06-25",
      tags: ["대상", "데이터분석", "기획"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-engineering-idea-2024",
      type: "award",
      titleKo: "제1회 공학혁신인재 아이디어 캠프 · 최우수상",
      titleEn: "Engineering innovation idea camp · Grand Prize",
      summaryKo: "자기 살균 공법과 저온 보관 구조를 결합한 약물 보관 솔루션 아이디어를 설계했습니다.",
      summaryEn: "Designed a medication preservation concept combining sterilization and cooling.",
      year: "2024-06-26",
      tags: ["최우수상", "아이디어", "융합기술"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-triangle-career-2024",
      type: "award",
      titleKo: "Triangle+ 진로설계 전략 캠프 · 최우수상",
      titleEn: "Triangle+ career strategy camp · Grand Prize",
      summaryKo: "강의계획서와 비교과 데이터를 엑셀 수식으로 구조화해 맞춤형 진로 시나리오와 시간 분배 모델을 설계했습니다.",
      summaryEn: "Created a data-based career path and time allocation model.",
      year: "2024-08-20",
      tags: ["최우수상", "Excel", "진로설계"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-mobility-idea-2024",
      type: "award",
      titleKo: "자율주행 로봇제작 및 스마트 모빌리티 아이디어 경진대회 · 우수상",
      titleEn: "Smart mobility idea contest · Excellence Award",
      summaryKo: "EV 차량 구조와 의료 접근성 문제를 연결해 이동형 의료 차량 서비스를 제안하고 실제 도입 가능성을 검토했습니다.",
      summaryEn: "Proposed a smart mobility medical vehicle service with feasibility review.",
      year: "2024-08-31",
      tags: ["우수상", "모빌리티", "의료"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-product-camp-2024-2",
      type: "award",
      titleKo: "2024 호남제주권 제품 제작 역량강화 캠프 · 우수상",
      titleEn: "2024 product fabrication camp · Excellence Award",
      summaryKo: "발받힘대 제품의 하중 데이터를 측정하고 외형 제작과 회로 구성을 완료해 설계·제작 역량을 검증했습니다.",
      summaryEn: "Validated product design and fabrication through load measurement and prototyping.",
      year: "2024-09-06",
      tags: ["우수상", "제품제작", "3D"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-won-story-2024",
      type: "award",
      titleKo: "WON+ 페스티벌 성장 이야기 공모전 · 우수상",
      titleEn: "WON+ growth story contest · Excellence Award",
      summaryKo: "협업 과정의 갈등 조율과 문제 해결 경험을 수기 에세이로 정리해 가치관과 성장 과정을 전달했습니다.",
      summaryEn: "Captured teamwork, conflict resolution, and growth in an essay.",
      year: "2024-10-31",
      tags: ["우수상", "에세이", "성장"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-energy-startup-2024",
      type: "award",
      titleKo: "생활 속 에너지 창업 아이디어 경진대회 · 장려상",
      titleEn: "Energy startup idea contest · Encouragement Award",
      summaryKo: "펠티어 소자를 활용한 노트북 쿨러 아이디어를 제안하고, 열을 전기와 쿨링으로 재활용하는 구조를 구상했습니다.",
      summaryEn: "Proposed a laptop cooler concept using Peltier-based energy recycling.",
      year: "2024-11-02",
      tags: ["장려상", "Energy", "Hardware"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-portfolio-2024",
      type: "award",
      titleKo: "대학생활설계 포트폴리오 경진대회 · 우수상 / 장려상",
      titleEn: "University portfolio contest · Excellence / Encouragement",
      summaryKo: "마이크로 디그리 기반 학습 경로와 진로 연계 포트폴리오를 직접 설계해 자기주도적 성장 구조를 제시했습니다.",
      summaryEn: "Designed a self-directed learning and career portfolio path.",
      year: "2024-11-13",
      tags: ["우수상", "장려상", "포트폴리오"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-my-money-my-startup-2024",
      type: "award",
      titleKo: "전북권 대학 연합 내 돈내산 창업캠프 · 장려상",
      titleEn: "Startup camp · Encouragement Award",
      summaryKo: "예산군 유휴 공간을 사과 아이덴티티 기반 체류형 숙소로 재해석하는 공간 창업 아이디어를 구체화했습니다.",
      summaryEn: "Designed a region-based stay concept from underused local space.",
      year: "2024-11-21",
      tags: ["장려상", "창업", "공간기획"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-gstartup-2024",
      type: "award",
      titleKo: "2024 G-Startup 아이디어 캠프 · 최우수상",
      titleEn: "G-Startup idea camp · Grand Prize",
      summaryKo: "수분 기반 자가발전 구조와 제습 기능을 결합한 시스템 아이디어를 발전시켜 적용 가능성을 탐색했습니다.",
      summaryEn: "Explored a self-powering dehumidification system concept.",
      year: "2024-12-06",
      tags: ["최우수상", "아이디어", "에너지"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-region-problem-2024",
      type: "award",
      titleKo: "제1회 전북권 지역 문제 해결 아이디어 경진대회 · 우수상",
      titleEn: "Regional problem-solving contest · Excellence Award",
      summaryKo: "실리카겔 기반 제습과 수분 자가발전을 결합한 구조를 3D 설계로 구체화하며 실현 가능성을 높였습니다.",
      summaryEn: "Improved feasibility of a silica gel and self-power generation system through 3D design.",
      year: "2024-12-19",
      tags: ["우수상", "지역문제", "3D설계"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-linc-creative-2024-2",
      type: "award",
      titleKo: "2024학년도 2학기 LINC 3.0 창의대첩 · 최우수상",
      titleEn: "LINC 3.0 creative competition 2H · Grand Prize",
      summaryKo: "PTC 도자기 발열체와 저전압 기반 재생 구조를 적용해 이전 제습 시스템 아이디어의 안정성을 개선했습니다.",
      summaryEn: "Improved safety and sustainability of the prior dehumidification system concept.",
      year: "2024-12-24",
      tags: ["최우수상", "LINC", "고도화"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-national-scholar",
      type: "award",
      titleKo: "국가우수 이공계 장학생",
      titleEn: "National scholarship for outstanding science and engineering students",
      summaryKo: "정보통신부장관 명의 국가우수 이공계 장학생으로 선정되며 학업과 프로젝트 성과를 공식적으로 인정받았습니다.",
      summaryEn: "Selected as a national science and engineering scholarship recipient.",
      year: "2025-01-01",
      tags: ["국가장학", "장학생", "대표수상"],
      featured: true,
      featuredRank: 1,
      images: [{ url: "/assets/evidence/award-national-scholarship.jpg", altKo: "국가우수 이공계 장학생 상장", altEn: "National scholarship certificate", role: "certificate" }]
    }),
    item({
      id: "award-future-mobility-2025",
      type: "award",
      titleKo: "미래수송기기 아이디어 해커톤 경진대회 · 우수상",
      titleEn: "Future mobility hackathon · Excellence Award",
      summaryKo: "기계공학과와 협업해 자율주행 이동형 의료 차량 아이디어를 기획하고 심부전 환자 이송 구조를 설계했습니다.",
      summaryEn: "Proposed an autonomous medical mobility vehicle with engineering collaboration.",
      year: "2025-02-14",
      tags: ["우수상", "해커톤", "의료모빌리티"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-company-analysis-2025",
      type: "award",
      titleKo: "기업분석경진대회 · 장려상",
      titleEn: "Company analysis contest · Encouragement Award",
      summaryKo: "현대자동차의 핵심 가치와 미래 전략을 분석하고 전공·프로젝트 경험과의 연관성을 정량·정성적으로 도출했습니다.",
      summaryEn: "Analyzed Hyundai's strategy and linked it to personal project experience.",
      year: "2025-05-12",
      tags: ["장려상", "분석", "현대자동차"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-learning-essay-2025",
      type: "award",
      titleKo: "제20회 학습공모전 · 입선",
      titleEn: "Learning essay contest · Honorable Mention",
      summaryKo: "KPT 회고법 기반으로 팀 갈등 해결과 협업 구조 개선 경험을 수필로 정리해 생산성 향상 사례를 제시했습니다.",
      summaryEn: "Documented a KPT-based conflict resolution and productivity improvement story.",
      year: "2025-06-04",
      tags: ["입선", "회고", "협업"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-do-dream-2025",
      type: "award",
      titleKo: "JST Do-Dream 챌린지 해커톤 · 최우수상",
      titleEn: "JST Do-Dream challenge · Grand Prize",
      summaryKo: "공공데이터 기반 농업 환경 분석과 특허·기술 동향을 결합한 스마트팜 웹 플랫폼을 설계했습니다.",
      summaryEn: "Designed a smart farming platform combining public data and technology trends.",
      year: "2025-07-04",
      tags: ["최우수상", "스마트팜", "데이터"],
      featured: true,
      featuredRank: 5,
      images: [awardArchiveImage]
    }),
    item({
      id: "award-energy-up-2025",
      type: "award",
      titleKo: "Energy Up! 아이디어 경진대회 · 우수상",
      titleEn: "Energy Up idea contest · Excellence Award",
      summaryKo: "한옥 구조에 맞춰 벽지와 문을 배터리 팩처럼 활용하는 ESS 아이디어를 제안하며 전통 건축과 에너지 기술의 접점을 탐색했습니다.",
      summaryEn: "Explored an ESS concept tailored to hanok architecture.",
      year: "2025-07-18",
      tags: ["우수상", "ESS", "한옥"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-driveup",
      type: "award",
      titleKo: "2025 전북권 Drive Up 창업캠프 · 대상 (전북도지사 표창)",
      titleEn: "Drive Up startup camp · Grand Prize",
      summaryKo: "폐키보드를 전북현대 모터스 굿즈로 업사이클링해 실제 입점까지 연계했고, 수익을 기부로 연결한 지속가능 창업 모델을 구현했습니다.",
      summaryEn: "Built an upcycling startup model that reached real product placement and donation impact.",
      year: "2025-08-07",
      tags: ["대상", "전북도지사상", "업사이클"],
      featured: true,
      featuredRank: 2,
      images: [{ url: "/assets/evidence/award-driveup-governor.jpg", altKo: "Drive Up 창업캠프 전북도지사 표창", altEn: "Drive Up startup camp certificate", role: "certificate" }]
    }),
    item({
      id: "award-gangneung",
      type: "award",
      titleKo: "근거기반 지역문제 해결 캠프 in 강릉 · 대상 (강릉시장 표창)",
      titleEn: "Gangneung problem-solving camp · Grand Prize",
      summaryKo: "강릉 커피축제의 커피박 문제를 현장 조사와 AI 기반 자료 제작으로 검증하며 지역문제 해결 대안을 제시했습니다.",
      summaryEn: "Proposed a data-backed local solution to coffee waste in Gangneung.",
      year: "2025-08-29",
      tags: ["대상", "강릉시장상", "지역문제"],
      featured: true,
      featuredRank: 3,
      images: [{ url: "/assets/evidence/award-gangneung-mayor.jpg", altKo: "강릉시장 표창 상장", altEn: "Gangneung Mayor Award certificate", role: "certificate" }]
    }),
    item({
      id: "award-jeonju-startup-2025",
      type: "award",
      titleKo: "전주 청년 창업경진대회 · 최우수상 (전북중기청장 표창)",
      titleEn: "Jeonju youth startup contest · Grand Prize",
      summaryKo: "커피박 친환경 패키징 솔루션을 금형 기반 시제품까지 연결하며 제조 가능성과 사업화 가능성을 함께 검증했습니다.",
      summaryEn: "Validated manufacturability and business potential of coffee-ground packaging.",
      year: "2025-09-16",
      tags: ["최우수상", "패키징", "창업"],
      featured: true,
      featuredRank: 4,
      images: [awardArchiveImage]
    }),
    item({
      id: "award-honam-jeju-startup-2025",
      type: "award",
      titleKo: "호남·제주권 대학 연합 창업경진대회 · 장려상",
      titleEn: "Honam-Jeju startup contest · Encouragement Award",
      summaryKo: "커피박 업사이클링 프로젝트의 원료 수거와 가공, 제품화 흐름을 실제 운영 가능한 공급 체계로 확장했습니다.",
      summaryEn: "Expanded the coffee-ground upcycling project into an operational supply chain.",
      year: "2025-10-24",
      tags: ["장려상", "창업", "공급체계"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-innovation-league-2025",
      type: "award",
      titleKo: "도전! 생활혁신 아이디어 리그 · 최우수상",
      titleEn: "Life innovation idea league · Grand Prize",
      summaryKo: "신인 웹툰 작가의 자금·진입 장벽 문제를 해결하기 위한 클라우드 펀딩 기반 창작 생태계 플랫폼을 제안했습니다.",
      summaryEn: "Proposed a crowdfunding platform for emerging webtoon creators.",
      year: "2025-10-31",
      tags: ["최우수상", "플랫폼", "콘텐츠"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-hollim-2025",
      type: "award",
      titleKo: "홀림 공모전 · 장려상",
      titleEn: "Hollim writing contest · Encouragement Award",
      summaryKo: "실패를 성장 과정으로 재해석한 수필 형식의 소설을 통해 도전과 회복의 과정을 문학적으로 풀어냈습니다.",
      summaryEn: "Turned failure and recovery into a literary growth narrative.",
      year: "2025-11-13",
      tags: ["장려상", "글쓰기", "스토리텔링"],
      images: [awardArchiveImage]
    }),
    item({
      id: "award-region-problem-2025",
      type: "award",
      titleKo: "제2회 전북권 지역문제 해결 아이디어 경진대회 · 대상",
      titleEn: "Regional problem-solving contest II · Grand Prize",
      summaryKo: "자동차 불량 부품과 PLA 펠릿을 활용한 3D 프린터용 필라멘트 재가공 아이디어를 제안하며 업사이클링의 사업화 가능성을 확장했습니다.",
      summaryEn: "Expanded upcycling into a filament and goods business model using industrial waste parts.",
      year: "2025-12-02",
      tags: ["대상", "3D프린팅", "업사이클"],
      images: [awardArchiveImage]
    }),
    item({
      id: "project-autonomous",
      type: "project",
      titleKo: "자율주행 프로젝트",
      titleEn: "Autonomous driving projects",
      summaryKo: "Pixhawk, ROS2 Nav2, Gazebo, CARLA 시뮬레이션을 사용해 자율주행 드론과 차량 제어를 실습했습니다.",
      summaryEn: "Practiced autonomous drone and vehicle control using Pixhawk, ROS2 Nav2, Gazebo, and CARLA.",
      year: "2024",
      tags: ["ROS2", "CARLA", "Pixhawk", "Mobility"],
      featured: true,
      featuredRank: 1,
      images: [{ url: "/assets/evidence/project-car-1.jpg", altKo: "자율주행 및 차량 제작 현장", altEn: "Autonomous driving and vehicle project scene", role: "evidence" }],
      links: [
        { label: "CARLA 시뮬레이터 활용 자율주행", url: "https://www.notion.so/CARLA-333faf73802f8099b798ca6b64f6b3c1?pvs=21" },
        { label: "ROS2 자율주행 스터디", url: "https://www.notion.so/ROS2-330faf73802f80da9529d35696f4588d?pvs=21" },
        { label: "픽스호크활용 자율주행", url: "https://www.notion.so/333faf73802f802788f4ecc0ff3e2dea?pvs=21" },
        { label: "자율주행 경진대회", url: "https://www.notion.so/333faf73802f806da756fdaadd4f250c?pvs=21" }
      ],
      details: {
        한줄소개: "시뮬레이션과 실제 제어를 함께 다루며 자율주행 시스템의 전체 흐름을 익힌 프로젝트 묶음입니다.",
        핵심기술: ["Pixhawk", "ROS2 Nav2", "Gazebo", "CARLA", "Mission Planner", "GPS"],
        진행포인트: [
          "자율주행 드론과 로버를 모두 다루며 하드웨어 제어와 시뮬레이션을 병행",
          "센서 입력, 경로 추종, 위치 추정, 비행 제어 로직을 실제 환경 기준으로 학습",
          "이론 학습에 그치지 않고 대회와 스터디 기록으로 확장"
        ],
        배운점: [
          "센서와 제어 알고리즘은 단독이 아니라 전체 시스템 관점에서 연결되어야 한다는 점",
          "시뮬레이션과 실제 환경의 차이를 줄이는 튜닝 경험",
          "모빌리티 문제를 소프트웨어만이 아니라 하드웨어 제약과 함께 바라보는 시각"
        ]
      }
    }),
    item({
      id: "project-handmade-car",
      type: "project",
      titleKo: "자작차량 제작 프로젝트",
      titleEn: "Hand-built electric vehicle project",
      summaryKo: "국산 전동기 자작차 경진대회 참여를 통해 실제 자동차 제작 공정, 조향장치, 제어 로직을 경험했습니다.",
      summaryEn: "Joined a self-built car competition and worked through real vehicle fabrication, steering, and control logic.",
      year: "2025",
      tags: ["Mobility", "Arduino", "Hardware"],
      featured: true,
      featuredRank: 2,
      images: [{ url: "/assets/evidence/project-car-1.jpg", altKo: "자작차량 제작 현장", altEn: "Hand-built car fabrication", role: "evidence" }]
    }),
    item({
      id: "project-gantts",
      type: "project",
      titleKo: "생동감 있는 GAN-TTS 제작",
      titleEn: "Lively GAN-TTS voice generation",
      summaryKo: "사투리와 자연스러운 한국어를 지원하는 TTS 봇과 직접 학습 가능한 음성 모델 개발 연구에 참여했습니다.",
      summaryEn: "Contributed to research on a Korean TTS bot and trainable voice model supporting more natural speech.",
      year: "2023",
      tags: ["AI", "TTS", "Python", "Linux"],
      featured: true,
      featuredRank: 3,
      images: [{ url: "/assets/generated/growth-corridor.png", altKo: "GAN-TTS 연구를 상징하는 배경 이미지", altEn: "GAN-TTS project background", role: "cover" }],
      details: {
        프로젝트설명:
          "TTS(Text-to-Speech) 기술은 사람이 읽는 것처럼 자연스러운 발음과 감정을 담아 텍스트를 음성으로 변환하는 기술이며, 현실감 있는 GAN-TTS 모델은 사용자 경험과 접근성, 다양한 산업 활용 측면에서 중요성이 계속 커지고 있습니다.",
        필요성: [
          "더 자연스럽고 인간다운 음성을 통해 사용자 경험 향상",
          "시각장애인과 독서 약자를 돕는 보조 기술로의 확장",
          "광고, 오디오북, 게임, 교육, 고객 지원 등 다양한 산업 적용",
          "다양한 언어와 방언을 지원하는 음성 콘텐츠 기반 확장"
        ],
        핵심주제: ["음성 합성을 위한 GAN-TTS 개발", "Ubuntu / Anaconda 환경 구축", "PyTorch 학습", "wav 데이터 제작"],
        진행타임라인: [
          "2023.04 카카오 공공 GPU 접속 테스트 및 개발 환경 구축",
          "2023.05 Anaconda 및 Ubuntu 환경 구축, PyTorch 학습",
          "2023.06 wav 파일 제작과 레퍼지토리 기반 응용 학습",
          "2023.07 목소리 학습 및 TTS 개발 착수",
          "2023.08~10 문제 해결 및 연구 과제 진행"
        ],
        막혔던부분과극복: [
          "대학 진학 직후 프로젝트에 합류해 선배 중심 팀 커뮤니케이션 구조에 적응하는 데 어려움이 있었지만 조언을 받아 빠르게 적응",
          "처음 접하는 Ubuntu, Anaconda, CUDA, PyTorch 환경 구성에서 시행착오를 겪으며 개발 환경 세팅 역량 확보",
          "단순 모델 사용이 아니라 데이터 준비와 실험 환경 구축까지 직접 다루며 연구형 프로젝트의 기본기를 습득"
        ],
        환경구축메모: [
          "CUDA 12.0 설치 및 WSL-Ubuntu 기반 개발 환경 구성",
          "TensorFlowTTS, PyTorch, wav 데이터 제작 파이프라인 실습",
          "리포지토리 기반 응용 제작과 학습 환경 반복 세팅"
        ]
      },
      links: [
        { label: "AWS 클라우드 활용 퍼스널컬러 챗봇 제작", url: "https://www.notion.so/AWS-333faf73802f80a99356c92f666342f7?pvs=21" },
        { label: "AI탐지기 제작", url: "https://www.notion.so/AI-333faf73802f8065a100d74d1503d5c4?pvs=21" }
      ]
    }),
    item({
      id: "project-upcycle",
      type: "project",
      titleKo: "업사이클 프로젝트",
      titleEn: "Upcycling commercialization projects",
      summaryKo: "커피박 상자, 폐키보드 굿즈, 폐플라스틱 필라멘트 등 버려지는 자원을 제품화와 판매까지 연결했습니다.",
      summaryEn: "Turned discarded resources into products, including coffee-ground boxes, keyboard goods, and recycled plastic filament.",
      year: "2025-2026",
      tags: ["Startup", "Upcycling", "Re:cap"],
      featured: true,
      featuredRank: 4,
      images: [
        { url: "/assets/evidence/project-upcycle-1.jpg", altKo: "업사이클 제작물", altEn: "Upcycled product", role: "evidence" },
        { url: "/assets/evidence/project-upcycle-2.jpg", altKo: "업사이클 활동 현장", altEn: "Upcycling activity scene", role: "gallery" }
      ]
    }),
    item({
      id: "project-iot-ring",
      type: "project",
      titleKo: "스마트 IoT 링거대",
      titleEn: "Smart IoT IV pole",
      summaryKo: "GTT 알고리즘 기반 수액 측정 모듈로 환자 관리와 의료사고 문제를 해결하려는 프로젝트입니다.",
      summaryEn: "A GTT algorithm-based IV monitoring solution for patient management and medical safety.",
      year: "2026",
      tags: ["Altium", "ESP32", "PCB", "3D"],
      featured: false
    }),
    item({
      id: "project-farm-app",
      type: "project",
      titleKo: "농림축산식품 공공데이터 APP 개발",
      titleEn: "Agricultural public-data app",
      summaryKo: "농림축산식품 공공데이터를 활용해 초보 농민을 위한 재배 캘린더와 성장 예측 앱을 기획하고 구현했습니다.",
      summaryEn: "Planned and built a cultivation calendar and AI growth prediction service for beginning farmers.",
      year: "2024",
      tags: ["App", "Public Data", "농업", "UX"],
      images: [
        { url: "/assets/evidence/project-app-screen-1.png", altKo: "앱 화면", altEn: "App screen", role: "gallery" },
        { url: "/assets/evidence/project-app-screen-2.png", altKo: "앱 화면", altEn: "App screen", role: "gallery" }
      ],
      links: [{ label: "Notion", url: "https://www.notion.so/333faf73802f80efa7eec4ec444c1d6a" }],
      details: {
        한줄소개: "공공데이터를 실제 농업 사용자 관점의 앱 경험으로 전환한 프로젝트입니다.",
        목표: [
          "초보 농민이 필요한 재배 정보를 빠르게 찾을 수 있도록 설계",
          "공공데이터를 일정형 캘린더와 예측형 정보로 재구성",
          "현장에서 이해하기 쉬운 모바일 흐름을 만드는 데 집중"
        ],
        역할: "서비스 기획, 데이터 연결 구조 설계, 앱 화면 구상 및 개발",
        바로가기: ["노션 원문에서 상세 구조와 자료를 확인할 수 있습니다."]
      }
    }),
    item({
      id: "project-posture-ios",
      type: "project",
      titleKo: "노동자를 위한 자세감지 APP (iOS)",
      titleEn: "Posture-detection iOS app for workers",
      summaryKo: "실시간 객체 인식으로 노동자의 안전을 지원하는 HUSS AI 경진대회 출품작입니다.",
      summaryEn: "A HUSS AI competition project using real-time object detection for worker safety.",
      year: "2025",
      tags: ["Swift", "Python", "Object Detection"]
    }),
    item({
      id: "project-ess",
      type: "project",
      titleKo: "한옥형 ESS 설계",
      titleEn: "ESS design for hanok",
      summaryKo: "태양광 발전과 저장시스템 부족을 해결하기 위한 시설 아이디어 설계 프로젝트입니다.",
      summaryEn: "A facility concept for solar generation and energy storage gaps in hanok environments.",
      year: "2025",
      tags: ["Energy", "Design"]
    }),
    item({
      id: "project-ai-detector",
      type: "project",
      titleKo: "AI 생성물 탐지기 제작",
      titleEn: "AI-generated content detector",
      summaryKo: "물리적 특성 추출을 활용해 AI 생성물 여부를 판별하는 탐지 인터페이스를 설계하고 구현했습니다.",
      summaryEn: "A project detecting AI-generated content through physical characteristic extraction.",
      year: "2026",
      tags: ["AI", "Detection", "Computer Vision"],
      links: [
        { label: "Notion", url: "https://www.notion.so/333faf73802f8065a100d74d1503d5c4" },
        { label: "Demo", url: "https://3000-ii7n0v0uca8g55c0qrqox-583b4d74.sandbox.novita.ai" }
      ],
      details: {
        한줄소개: "AI 생성 결과물의 흔적을 물리적 특징으로 분석해 판별 가능성을 실험한 프로젝트입니다.",
        핵심포인트: [
          "AI 생성물 탐지용 입력-분석-결과 확인 흐름 설계",
          "물리적 특성 추출 기반 판별 아이디어 검증",
          "웹 기반 시연 환경으로 빠르게 프로토타이핑"
        ],
        역할: "프로토타입 설계, 탐지 흐름 기획, 인터페이스 구현"
      }
    }),
    item({
      id: "project-dontstarve",
      type: "project",
      titleKo: "결식 아동을 위한 예약결제 서비스 APP",
      titleEn: "Reservation payment app for children facing food insecurity",
      summaryKo: "결식카드 사용 가능 식당과 착한식당 정보를 지도 기반으로 제공하고, 비대면 예약·결제로 심리적 부담을 줄이려 한 서비스입니다.",
      summaryEn: "A map-based service for children facing food insecurity to find supported restaurants and reduce payment friction.",
      year: "2024",
      tags: ["FastAPI", "Kakao Map API", "MariaDB", "ESG"],
      images: [{ url: "/assets/evidence/project-app-screen-1.png", altKo: "예약결제 서비스 앱 화면", altEn: "Reservation payment app screen", role: "gallery" }],
      links: [
        { label: "Notion", url: "https://www.notion.so/330faf73802f8007b1b5f8f59cc56b92" },
        { label: "Video", url: "https://youtu.be/7oQWhoboMmE?si=scPsr8Ue6Lt67gqq" }
      ],
      details: {
        프로젝트명: "DontStarve (GFOOD)",
        핵심기능: [
          "Kakao Map API 기반 지도 조회",
          "결식카드 가맹점과 착한식당 필터링",
          "가게 상세 정보 모달 조회",
          "비대면 예약·결제 확장 가능 구조 설계"
        ],
        기술스택: ["HTML/CSS/JavaScript", "FastAPI", "MariaDB", "Kakao Map API"],
        문제해결: [
          "결제 과정에서 느끼는 심리적 부담을 줄이기 위해 비대면 경험을 기획",
          "CSV 공공데이터를 좌표 기반 지도 서비스로 전환",
          "store_id 기반 마커-상세 모달 연결 구조 설계"
        ]
      }
    }),
    item({
      id: "project-kakao-fin-next",
      type: "project",
      titleKo: "kakao FIN:NEXT 프로젝트",
      titleEn: "kakao FIN:NEXT project",
      summaryKo: "웹툰의 영상화 과정에서 발생하는 불투명한 수익 분배 문제를 해결하기 위해, 팬 참여형 투자 플랫폼 Kakao FANance를 기획·구현했습니다.",
      summaryEn: "Built Kakao FANance, a fan-participation investment platform for fairer creator revenue distribution.",
      year: "2025",
      tags: ["Next.js 15", "TypeScript", "Supabase", "Fintech"],
      featured: true,
      featuredRank: 5,
      images: [{ url: "/assets/evidence/project-app-screen-2.png", altKo: "Kakao FANance 화면 예시", altEn: "Kakao FANance interface", role: "gallery" }],
      links: [
        { label: "Notion", url: "https://www.notion.so/333faf73802f804db2a7e52ae01b5142" },
        { label: "Demo", url: "https://kakaofanance.vercel.app/" },
        { label: "Video", url: "https://youtube.com/shorts/NZwp7W0fqdU?feature=share" }
      ],
      details: {
        한줄소개: "팬이 곧 투자자가 되는 문화투자 플랫폼을 팀 프로젝트로 구현했습니다.",
        역할: "프론트엔드 개발, Supabase 연동, UI/UX 구현",
        핵심기능: [
          "웹툰 상세 투자 페이지와 자산 관리 흐름 구현",
          "Supabase 기반 인증·DB·스토리지 연결",
          "Recharts 기반 수익률 시각화",
          "shadcn/ui와 Radix UI로 확장 가능한 컴포넌트 시스템 구축"
        ],
        기술스택: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Supabase", "Zod", "Vercel"],
        팀구성: ["컴퓨터공학과 1명", "경영학부 2명"],
        배운점: [
          "최신 App Router 구조에서의 서비스 설계 경험",
          "타입 안정성과 빠른 UI 확장을 동시에 잡는 방법 학습",
          "투자 흐름을 사용자 친화적으로 풀어내는 프론트엔드 설계 경험"
        ]
      }
    }),
    item({
      id: "project-climate-dashboard",
      type: "project",
      titleKo: "영농 기후 기술 데이터 시각화 웹",
      titleEn: "Climate tech data visualization web app",
      summaryKo: "Python과 Streamlit으로 기후기술 데이터를 통합 분석하는 인터랙티브 대시보드를 제작했습니다.",
      summaryEn: "Built an interactive climate-tech dashboard with Python and Streamlit.",
      year: "2025",
      tags: ["Python", "Streamlit", "Plotly", "Dashboard"],
      images: [{ url: "/assets/evidence/project-app-screen-1.png", altKo: "데이터 시각화 대시보드 예시", altEn: "Dashboard example", role: "gallery" }],
      links: [{ label: "Notion", url: "https://www.notion.so/333faf73802f8032b436e33d1cb71028" }],
      details: {
        한줄소개: "정책·산업·연구 데이터를 한 화면에서 읽을 수 있는 기후기술 분석 플랫폼입니다.",
        분석모듈: [
          "기후기술 분류체계 분석",
          "기관 현황 분석",
          "특허 현황 분석",
          "기술 수명주기 분석",
          "해외 진출 분석",
          "데이터 관리 시스템"
        ],
        기술스택: ["Python", "Streamlit", "Pandas", "Plotly", "Folium", "BeautifulSoup", "Selenium"],
        성과: [
          "인터랙티브 차트와 세계 지도 시각화 구현",
          "캐싱 기반 성능 최적화",
          "모듈형 페이지 구조로 확장성 확보"
        ]
      }
    }),
    item({
      id: "project-retrofit-game",
      type: "project",
      titleKo: "레트로핏 윈도우 게임",
      titleEn: "Retrofit Windows game package",
      summaryKo: "여러 미니게임을 통합한 레트로 윈도우 게임 패키지를 제작하며, 모듈화 구조와 GitHub 협업 흐름을 경험했습니다.",
      summaryEn: "Built a retro Windows mini-game package with modular architecture and GitHub collaboration.",
      year: "2024",
      tags: ["C#", "Windows Forms", ".NET", "GitHub"],
      links: [
        { label: "Notion", url: "https://www.notion.so/333faf73802f8075b43de45fc2584d76" },
        { label: "Video", url: "https://youtu.be/PEcXeQw4Ipo" }
      ],
      details: {
        한줄소개: "독립 구동 게임을 하나의 패키지로 묶은 레트로 미니게임 프로젝트입니다.",
        역할: ["숫자야구 게임", "뱀 게임", "지뢰찾기", "테트리스"],
        기술스택: ["C#", "Windows Forms", ".NET Framework", "Visual Studio", "GitHub"],
        핵심포인트: [
          "로그인·회원가입·점수 기록 시스템 구성",
          "게임별 모듈 분리로 확장 가능 구조 설계",
          "feature / develop / main 기반 협업 브랜치 전략 실습"
        ]
      }
    }),
    item({
      id: "project-rehab-game",
      type: "project",
      titleKo: "스마트 헬스케어 재활 치료 게임",
      titleEn: "Smart healthcare rehabilitation game",
      summaryKo: "재활 치료 경험을 더 능동적이고 몰입감 있게 만들기 위한 스마트 헬스케어 게임형 인터페이스를 탐구한 프로젝트입니다.",
      summaryEn: "Explored a game-based interface for more engaging rehabilitation therapy.",
      year: "2025",
      tags: ["Healthcare", "Game UX", "Interactive"],
      links: [{ label: "Notion", url: "https://www.notion.so/335faf73802f80699aa2c5c408e89ab0" }],
      details: {
        한줄소개: "치료와 게임의 경계를 줄여 사용자의 몰입을 높이는 방향을 실험했습니다.",
        포인트: [
          "헬스케어와 게임 UX를 결합한 인터페이스 탐색",
          "재활 상황에 맞는 몰입형 시나리오 구상",
          "시각 자료와 프로토타입 중심으로 개념 검증"
        ]
      }
    })
  ]
};
