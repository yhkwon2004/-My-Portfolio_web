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
      id: "award-national-scholar",
      type: "award",
      titleKo: "국가우수 이공계 장학생",
      titleEn: "National scholarship for outstanding science and engineering students",
      summaryKo: "정보통신부장관 명의 국가 우수 이공계 장학생으로 선정되었습니다.",
      summaryEn: "Selected as an outstanding science and engineering scholarship recipient.",
      year: "2025",
      tags: ["Scholarship", "National"],
      featured: true,
      featuredRank: 1,
      images: [{ url: "/assets/evidence/award-national-scholarship.jpg", altKo: "국가우수 이공계 장학생 상장", altEn: "National scholarship certificate", role: "certificate" }]
    }),
    item({
      id: "award-gangneung",
      type: "award",
      titleKo: "강릉시장상",
      titleEn: "Gangneung Mayor Award",
      summaryKo: "강릉에서 시작한 문제 해결 활동의 성과를 인정받은 주요 수상입니다.",
      summaryEn: "A major award recognizing problem-solving activity that began in Gangneung.",
      year: "2025",
      tags: ["Award", "Gangneung"],
      featured: true,
      featuredRank: 2,
      images: [{ url: "/assets/evidence/award-gangneung-mayor.jpg", altKo: "강릉시장상 상장", altEn: "Gangneung Mayor Award certificate", role: "certificate" }]
    }),
    item({
      id: "award-driveup",
      type: "award",
      titleKo: "DriveUp 창업 경진대회 전북도지사상",
      titleEn: "DriveUp startup competition, Jeonbuk Governor Award",
      summaryKo: "업사이클 및 사업화 프로젝트 성과로 전북도지사상을 수상했습니다.",
      summaryEn: "Received the Jeonbuk Governor Award for upcycling and commercialization work.",
      year: "2026",
      tags: ["Startup", "Governor Award"],
      featured: true,
      featuredRank: 3,
      images: [{ url: "/assets/evidence/award-driveup-governor.jpg", altKo: "DriveUp 창업 경진대회 상장", altEn: "DriveUp startup competition certificate", role: "certificate" }]
    }),
    item({
      id: "award-cnu-intern",
      type: "award",
      titleKo: "전남대 인턴십 프로그램 1위 평가",
      titleEn: "Top-ranked Chonnam National University internship evaluation",
      summaryKo: "실행력, 협업, 문제 해결 역량을 기반으로 프로그램 내 최고 평가를 받았습니다.",
      summaryEn: "Received the top evaluation for execution, collaboration, and problem-solving.",
      year: "2025-2026",
      tags: ["Internship", "Evaluation"],
      featured: true,
      featuredRank: 4
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
      featuredRank: 1
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
      featuredRank: 3
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
