import type { PortfolioImage, PortfolioItem } from "./types";

function image(url: string, altKo: string, role: PortfolioImage["role"] = "gallery"): PortfolioImage {
  return {
    url,
    altKo,
    altEn: altKo,
    role
  };
}

function project(input: Omit<PortfolioItem, "type" | "visible" | "featured" | "featuredRank" | "images" | "tags" | "titleEn" | "summaryEn"> & Partial<PortfolioItem>): PortfolioItem {
  return {
    type: "project",
    visible: true,
    featured: false,
    featuredRank: 99,
    images: [],
    tags: [],
    titleEn: input.titleKo,
    summaryEn: input.summaryKo,
    ...input
  };
}

export const notionProjectOverrides: PortfolioItem[] = [
  project({
    id: "project-autonomous",
    titleKo: "자율주행 프로젝트",
    summaryKo: "Pixhawk, ROS2 Nav2, Gazebo, CARLA 시뮬레이션을 넘나들며 드론과 차량의 자율주행 로직을 실습하고 검증한 프로젝트 묶음입니다.",
    year: "2024-2025",
    featured: true,
    featuredRank: 1,
    tags: ["ROS2", "CARLA", "Pixhawk", "Mobility", "Simulation"],
    images: [
      image("/assets/notion-projects/carla-cover.png", "CARLA 자율주행 시뮬레이션 커버", "cover"),
      image("/assets/notion-projects/ros2-gazebo.png", "ROS2 Gazebo 실습 화면"),
      image("/assets/notion-projects/pixhawk-cover.png", "픽스호크 자율주행 실습 장면")
    ],
    links: [
      { label: "CARLA 자율주행", url: "https://www.notion.so/333faf73802f8099b798ca6b64f6b3c1" },
      { label: "ROS2 스터디", url: "https://www.notion.so/330faf73802f80da9529d35696f4588d" },
      { label: "픽스호크 활용 자율주행", url: "https://www.notion.so/333faf73802f802788f4ecc0ff3e2dea" },
      { label: "자율주행 경진대회", url: "https://www.notion.so/333faf73802f806da756fdaadd4f250c" }
    ],
    details: {
      프로젝트개요:
        "실제 주행 환경과 시뮬레이션 환경을 오가며 자율주행의 센서 처리, 경로 추종, 비행 제어, 차량 제어를 모두 경험한 포트폴리오 축입니다.",
      핵심포인트: [
        "ROS2 Nav2 기반 경로 계획과 Gazebo 실습",
        "CARLA를 활용한 end-to-end 자율주행 시뮬레이션 검증",
        "Pixhawk와 Mission Planner 기반 드론 자율비행 테스트",
        "대회형 환경에서 제어 안정성과 실전 대응 방식 확인"
      ],
      배운점: [
        "자율주행은 알고리즘 하나가 아니라 센서, 제어, 환경 제약을 함께 다뤄야 한다는 점",
        "시뮬레이터와 실제 장비 사이의 오차를 줄이는 튜닝 감각",
        "소프트웨어와 하드웨어가 만나는 현장에서의 문제 해결 방식"
      ]
    }
  }),
  project({
    id: "project-handmade-car",
    titleKo: "자작차량 제작 프로젝트",
    summaryKo: "원광대학교 자작차 동아리 메카니즘에서 BAJA, EV, Formula 차량 설계와 제작, 주행 테스트까지 전 과정에 참여한 장기 프로젝트입니다.",
    year: "2025",
    featured: true,
    featuredRank: 2,
    tags: ["Mobility", "CATIA", "Vehicle", "Hardware", "Teamwork"],
    images: [
      image("/assets/notion-projects/handmade-car-cover.png", "자작차량 제작 프로젝트 커버", "cover"),
      image("/assets/notion-projects/handmade-car-intro.png", "자작차량 제작 소개 화면"),
      image("/assets/notion-projects/handmade-car-workshop.jpg", "자작차량 제작 작업 현장"),
      image("/assets/notion-projects/handmade-car-catia.jpg", "CATIA 기반 설계 장면"),
      image("/assets/notion-projects/handmade-car-driving.jpg", "자작차량 주행 사진")
    ],
    links: [
      { label: "Notion 원문", url: "https://www.notion.so/330faf73802f80c7b854e0317d7e8c56" },
      { label: "관련 기사", url: "http://www.gocarnet.co.kr/motorsports_tunning/2025/09/105170" }
    ],
    details: {
      활동기간: ["2024.03 ~ 2024.12", "원광대학교 기계공학과 자작차 동아리 메카니즘"],
      프로젝트개요: [
        "실제 주행 가능한 자작자동차를 설계부터 제작, 주행 테스트까지 경험",
        "소프트웨어 전공자로서 하드웨어 제작 현장에 직접 참여해 End-to-End 제작 흐름 체득",
        "이론, 설계, 가공, 조립, 테스트가 한 프로젝트 안에서 어떻게 연결되는지 체험"
      ],
      주요기술활동: [
        "선반, 밀링, 그라인더, 용접기 등 정밀 가공 장비 운용",
        "CATIA 기반 차량 프레임 및 주요 부품 설계",
        "BAJA, EV, Formula 차량 제작 참여로 구조별 특성 이해"
      ],
      문제해결과리더십: [
        "팀 내 교류 부족으로 소통이 끊긴 상황에서 단체 모임을 직접 제안",
        "작업 정보 공유와 역할 조율이 자연스럽게 이뤄지도록 분위기 개선",
        "실제 작업 속도와 완성도 향상으로 이어지는 협업 경험 확보"
      ],
      배운점: [
        "1mm 오차가 전체 구조를 흔든다는 정밀 엔지니어링 감각",
        "하드웨어와 소프트웨어가 만나는 지점에 대한 실질적 이해",
        "융합 프로젝트에서 커뮤니케이션이 기술만큼 중요하다는 점"
      ]
    }
  }),
  project({
    id: "project-gantts",
    titleKo: "생동감있는 GAN-TTS 제작",
    summaryKo: "더 자연스러운 한국어와 사투리를 지원하는 TTS-GAN 모델을 연구하며, 환경 구축부터 음성 데이터 제작, 오류 해결, 학습 흐름까지 직접 따라간 연구형 프로젝트입니다.",
    year: "2023",
    featured: true,
    featuredRank: 3,
    tags: ["AI", "TTS", "Python", "Linux", "Research"],
    images: [
      image("/assets/generated/growth-corridor.png", "GAN-TTS 프로젝트 대표 배경", "cover"),
      image("/assets/notion-projects/gantts-grid.png", "GAN-TTS TextGrid 결과 화면")
    ],
    links: [
      { label: "Notion 원문", url: "https://www.notion.so/330faf73802f805ca96efd0a52460091" },
      { label: "참고 레포", url: "https://huggingface.co/tensorspeech/tts-mb_melgan-kss-ko" },
      { label: "MeCab 오류 참고", url: "https://sosomemo.tistory.com/30" }
    ],
    details: {
      프로젝트설명:
        "TTS는 사람이 읽는 것처럼 자연스러운 발음과 감정을 담아 텍스트를 음성으로 변환하는 기술입니다. 이 프로젝트에서는 더 현실감 있는 한국어 음성 합성을 목표로 GAN-TTS 모델을 연구했습니다.",
      필요성: [
        "사용자 경험 향상",
        "시각장애인과 독서 약자를 위한 보조 기술 확장",
        "광고, 오디오북, 게임, 교육, 고객지원 등 산업 활용",
        "다양한 언어와 방언 지원 가능성"
      ],
      역할: ["학부연구생", "환경 구축", "wav 데이터 제작", "음성 학습 흐름 파악", "오류 해결 지원"],
      진행타임라인: [
        "2023.04 카카오 공공 GPU 접속 테스트 및 개발 환경 구축",
        "2023.05 anaconda, Ubuntu, PyTorch 학습",
        "2023.06 wav 파일 제작과 레포지토리 기반 응용 학습",
        "2023.07 실제 목소리 학습과 TTS 개발 착수",
        "2023.08~10 문제 해결과 연구 과제 진행"
      ],
      막혔던부분과해결: [
        "Ubuntu, anaconda, CUDA, PyTorch 환경을 처음 접하면서 초기 세팅에서 반복적으로 막힘",
        "konlpy / MeCab 관련 오류를 인터넷 탐색과 자료 조사로 해결",
        "학년 차이가 큰 팀 환경에서도 조언을 받아가며 빠르게 적응"
      ],
      환경구축메모: [
        "CUDA 12.0 설치",
        "WSL Ubuntu 기반 개발 환경 구성",
        "TensorFlowTTS 설치",
        "TextGrid 기반 음성 정렬 결과 확인"
      ]
    }
  }),
  project({
    id: "project-upcycle",
    titleKo: "업사이클 프로젝트",
    summaryKo: "폐키보드, 폐플라스틱, 커피박처럼 버려지는 자원을 상품화와 사업화로 연결한 업사이클 프로젝트 축입니다.",
    year: "2025-2026",
    featured: true,
    featuredRank: 4,
    tags: ["Startup", "Upcycling", "Re:cap", "Product"],
    images: [
      image("/assets/evidence/project-upcycle-1.jpg", "업사이클 프로젝트 대표 제품", "cover"),
      image("/assets/notion-projects/jbmotors-upcycle-cover.png", "전북현대모터스 FC 업사이클 프로젝트"),
      image("/assets/notion-projects/givingplus-upcycle-cover.png", "기빙플러스 업사이클 프로젝트"),
      image("/assets/notion-projects/coffee-box-cover.jpg", "커피박 상자 제작 프로젝트")
    ],
    links: [
      { label: "전북현대모터스 FC 협력", url: "https://www.notion.so/330faf73802f808eb0caea4524c71e63" },
      { label: "기빙플러스 입점", url: "https://www.notion.so/330faf73802f80708574fdc86e452c38" },
      { label: "커피박 상자 제작", url: "https://www.notion.so/333faf73802f80cea845ee4a96cd48dd" }
    ],
    details: {
      핵심축: [
        "폐기물 수거 -> 분해/가공 -> 굿즈/제품 제작 -> 판매 및 사업화 연결",
        "브랜드 협업과 실제 입점 경험 확보",
        "기술, 디자인, 사회적 가치가 함께 작동하는 구조 설계"
      ],
      대표프로젝트: [
        "전북현대모터스 FC 협력 업사이클 제품 제작 및 사업화",
        "기빙플러스 입점형 업사이클 제품 제작",
        "커피박 업사이클 상자 제작"
      ]
    }
  }),
  project({
    id: "project-iot-ring",
    titleKo: "스마트 IoT 링거폴대",
    summaryKo: "간호 인력 부족과 환자 관리 부담을 줄이기 위해, 수액 흐름과 임의 조작을 모니터링하는 GTT 기반 스마트 링거폴대를 설계한 프로젝트입니다.",
    year: "2026",
    tags: ["Altium", "ESP32", "PCB", "3D", "IoT"],
    images: [image("/assets/notion-projects/iot-ring-cover.png", "스마트 IOT 링거폴대 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/330faf73802f80988cdbcf9b9b8d0ee0" }],
    details: {
      협업: ["권용현", "정익상", "최이지", "한우진"],
      역할: ["3D 설계", "PCB / 회로 설계", "회계 관리"],
      문제정의:
        "수액과 약물 투여 과정에서 발생할 수 있는 환자 임의 조작과 의료사고 리스크를 줄이고, 간호사의 반복 관리 업무를 보조하기 위한 프로젝트입니다."
    }
  }),
  project({
    id: "project-farm-app",
    titleKo: "농림축산식품 공공데이터 APP 개발",
    summaryKo: "초보 농민을 위한 영농 재배력 캘린더와 AI 성장률 예측 흐름을 모바일 경험으로 풀어낸 공공데이터 기반 앱 프로젝트입니다.",
    year: "2024",
    tags: ["App", "Public Data", "농업", "AI", "UX"],
    images: [
      image("/assets/notion-projects/farm-app-cover.png", "농림축산식품 공공데이터 앱 커버", "cover"),
      image("/assets/notion-projects/farm-app-screen-1.png", "농림축산식품 공공데이터 앱 화면 1"),
      image("/assets/notion-projects/farm-app-screen-2.png", "농림축산식품 공공데이터 앱 화면 2"),
      image("/assets/notion-projects/farm-app-screen-3.png", "농림축산식품 공공데이터 앱 화면 3")
    ],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f80efa7eec4ec444c1d6a" }],
    details: {
      협업: ["강세창", "손석민"],
      핵심기능: [
        "영농 재배력 캘린더",
        "작물 성장률 예측",
        "초보 농민이 이해하기 쉬운 정보 구조",
        "공공데이터 기반 작물 정보 연결"
      ]
    }
  }),
  project({
    id: "project-ai-detector",
    titleKo: "AI 생성물 탐지기 제작",
    summaryKo: "물리적 특성 추출 기반으로 AI 생성물 여부를 판별하는 탐지 인터페이스를 설계하고, 빠른 프로토타이핑으로 검증한 프로젝트입니다.",
    year: "2026",
    tags: ["AI", "Detection", "Computer Vision"],
    images: [image("/assets/notion-projects/ai-detector-cover.png", "AI 생성물 탐지기 커버", "cover")],
    links: [
      { label: "Notion 원문", url: "https://www.notion.so/333faf73802f8065a100d74d1503d5c4" },
      { label: "Demo", url: "https://3000-ii7n0v0uca8g55c0qrqox-583b4d74.sandbox.novita.ai" }
    ],
    details: {
      프로젝트개요: "AI 생성 결과물의 흔적을 물리적 특징 기반으로 분해해 판별 가능성을 검증한 프로젝트입니다.",
      진행포인트: [
        "입력 -> 분석 -> 결과 확인 흐름 설계",
        "탐지 아이디어의 초기 검증과 인터페이스 프로토타입 구축",
        "실제 사용 흐름을 상상한 UX 정리"
      ]
    }
  }),
  project({
    id: "project-dontstarve",
    titleKo: "결식 아동을 위한 예약결제 서비스 APP",
    summaryKo: "결식 아동이 직접 카드를 내밀며 결제해야 하는 부담을 줄이기 위해, 위치 기반 정보와 비대면 예약결제를 연결한 서비스입니다.",
    year: "2024",
    tags: ["FastAPI", "Kakao Map API", "MariaDB", "ESG"],
    images: [
      image("/assets/notion-projects/dontstarve-cover.png", "결식 아동 예약결제 서비스 커버", "cover"),
      image("/assets/notion-projects/dontstarve-map.png", "결식 아동 예약결제 지도 화면"),
      image("/assets/notion-projects/dontstarve-detail.png", "결식 아동 예약결제 상세 화면")
    ],
    links: [
      { label: "Notion 원문", url: "https://www.notion.so/330faf73802f8007b1b5f8f59cc56b92" },
      { label: "Video", url: "https://youtu.be/7oQWhoboMmE?si=scPsr8Ue6Lt67gqq" }
    ],
    details: {
      핵심기능: [
        "Kakao Map API 기반 지도 조회",
        "결식카드 가맹점과 착한식당 레이어",
        "상세 정보 모달",
        "비대면 예약결제 확장 구조"
      ]
    }
  }),
  project({
    id: "project-kakao-fin-next",
    titleKo: "kakao FIN:NEXT 프로젝트",
    summaryKo: "웹툰 창작자 수익 구조 문제를 클라우드 펀딩과 팬 참여 투자 모델로 풀어낸 서비스형 프로젝트입니다.",
    year: "2025",
    featured: true,
    featuredRank: 5,
    tags: ["Next.js 15", "TypeScript", "Supabase", "Fintech"],
    images: [
      image("/assets/notion-projects/kakao-fin-cover.png", "kakao FIN:NEXT 프로젝트 커버", "cover"),
      image("/assets/notion-projects/kakao-fin-screen.png", "kakao FIN:NEXT 화면")
    ],
    links: [
      { label: "Notion 원문", url: "https://www.notion.so/333faf73802f804db2a7e52ae01b5142" },
      { label: "Demo", url: "https://kakaofanance.vercel.app/" },
      { label: "Video", url: "https://youtube.com/shorts/NZwp7W0fqdU?feature=share" }
    ],
    details: {
      역할: ["프론트엔드 개발", "Supabase 연동", "UI/UX 구현"],
      핵심기능: [
        "팬 참여형 투자 플랫폼 UX",
        "프로젝트 상세 페이지와 자산 흐름 시각화",
        "Supabase 기반 인증/저장 구조",
        "Next.js 15 App Router 기반 서비스 구성"
      ]
    }
  }),
  project({
    id: "project-climate-dashboard",
    titleKo: "영농 기후 기술을 활용한 데이터 시각화 웹제작",
    summaryKo: "Python 기반 분석과 Streamlit/시각화 도구를 활용해 기후 기술 데이터를 한 화면에서 탐색할 수 있도록 설계한 프로젝트입니다.",
    year: "2025",
    tags: ["Python", "Streamlit", "Plotly", "Dashboard"],
    images: [
      image("/assets/notion-projects/climate-cover.png", "영농 기후 기술 데이터 시각화 커버", "cover"),
      image("/assets/notion-projects/climate-screen-1.png", "영농 기후 기술 데이터 시각화 화면 1"),
      image("/assets/notion-projects/climate-screen-2.png", "영농 기후 기술 데이터 시각화 화면 2"),
      image("/assets/notion-projects/climate-screen-3.png", "영농 기후 기술 데이터 시각화 화면 3")
    ],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f8032b436e33d1cb71028" }],
    details: {
      분석모듈: [
        "기후기술 분류체계 분석",
        "국가 현황 분석",
        "분야 현황 분석",
        "기술 생애주기 분석",
        "해외 진출 분석"
      ],
      기술스택: ["Python", "Streamlit", "Pandas", "Plotly", "Folium", "BeautifulSoup", "Selenium"]
    }
  }),
  project({
    id: "project-retrofit-game",
    titleKo: "레트로핏 윈도우 게임",
    summaryKo: "여러 미니게임을 하나의 패키지로 묶고, GitHub 협업 흐름까지 경험한 레트로 윈도우 게임 프로젝트입니다.",
    year: "2024",
    tags: ["C#", "Windows Forms", ".NET", "GitHub"],
    images: [
      image("/assets/notion-projects/retrofit-cover.png", "레트로핏 윈도우 게임 커버", "cover"),
      image("/assets/notion-projects/retrofit-gameplay.jpg", "레트로핏 윈도우 게임 화면")
    ],
    links: [
      { label: "Notion 원문", url: "https://www.notion.so/333faf73802f8075b43de45fc2584d76" },
      { label: "Video", url: "https://youtu.be/PEcXeQw4Ipo" }
    ]
  }),
  project({
    id: "project-rehab-game",
    titleKo: "스마트 헬스케어 재활 치료 게임",
    summaryKo: "재활 치료 경험을 더 능동적이고 몰입감 있게 만들기 위한 게임형 인터페이스를 기획하고, 화면 시안까지 정리한 프로젝트입니다.",
    year: "2025",
    tags: ["Healthcare", "Game UX", "Interactive"],
    images: [
      image("/assets/notion-projects/rehab-game-cover.png", "스마트 헬스케어 재활 치료 게임 커버", "cover"),
      image("/assets/notion-projects/rehab-game-screen-1.png", "재활 치료 게임 화면 1"),
      image("/assets/notion-projects/rehab-game-screen-2.png", "재활 치료 게임 화면 2")
    ],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/335faf73802f80699aa2c5c408e89ab0" }],
    details: {
      프로젝트개요: "재활 치료와 인터랙티브 게임 UX의 경계를 줄여 치료 참여도를 높이기 위한 방향을 탐색했습니다.",
      핵심포인트: [
        "재활 상황에 맞춘 게임형 인터페이스 시안",
        "사용자의 몰입감을 높이는 피드백 구조 고민",
        "헬스케어와 게임 UX의 접점을 시각적으로 검토"
      ]
    }
  })
];

export const notionProjectAdditions: PortfolioItem[] = [
  project({
    id: "project-ros2-study",
    titleKo: "ROS2 자율주행 스터디",
    summaryKo: "ROS2 Nav2와 Gazebo 환경에서 경로 계획과 자율주행 기초를 반복 실습한 스터디형 프로젝트입니다.",
    year: "2024",
    tags: ["ROS2", "Nav2", "Gazebo"],
    images: [
      image("/assets/notion-projects/ros2-cover.png", "ROS2 자율주행 스터디 커버", "cover"),
      image("/assets/notion-projects/ros2-gazebo.png", "Gazebo 자율주행 실습 화면")
    ],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/330faf73802f80da9529d35696f4588d" }]
  }),
  project({
    id: "project-pixhawk-autonomy",
    titleKo: "픽스호크 활용 자율주행",
    summaryKo: "픽스호크와 미션플래너를 활용해 자율주행 드론 제어 흐름을 익히고 실습한 프로젝트입니다.",
    year: "2024",
    tags: ["Pixhawk", "Mission Planner", "Drone"],
    images: [image("/assets/notion-projects/pixhawk-cover.png", "픽스호크 자율주행 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f802788f4ecc0ff3e2dea" }]
  }),
  project({
    id: "project-autonomous-competition",
    titleKo: "자율주행 경진대회",
    summaryKo: "산업부 주관 자율주행 경진대회 환경에서 실제 대회형 주행과 제어 튜닝을 경험한 프로젝트입니다.",
    year: "2024",
    tags: ["Autonomous", "Competition", "Mobility"],
    images: [image("/assets/notion-projects/carla-cover.png", "자율주행 경진대회 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f806da756fdaadd4f250c" }]
  }),
  project({
    id: "project-upcycle-jbmotors",
    titleKo: "전북현대모터스 FC 협력 업사이클",
    summaryKo: "폐키보드를 전북현대모터스 FC 굿즈로 재가공해 실제 판매와 사업화 흐름까지 연결한 프로젝트입니다.",
    year: "2026",
    tags: ["Upcycling", "Brand", "Goods"],
    images: [
      image("/assets/notion-projects/jbmotors-upcycle-cover.png", "전북현대모터스 FC 업사이클 커버", "cover"),
      image("/assets/notion-projects/jbmotors-upcycle-1.png", "전북현대모터스 FC 업사이클 제품")
    ],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/330faf73802f808eb0caea4524c71e63" }]
  }),
  project({
    id: "project-upcycle-givingplus",
    titleKo: "기빙플러스 업사이클 제품 입점",
    summaryKo: "산업단지 폐플라스틱을 필라멘트와 굿즈로 가공해 입점형 상품화 경험까지 이어간 프로젝트입니다.",
    year: "2026",
    tags: ["Upcycling", "Filament", "Commercialization"],
    images: [
      image("/assets/notion-projects/givingplus-upcycle-cover.png", "기빙플러스 업사이클 커버", "cover"),
      image("/assets/notion-projects/givingplus-upcycle-1.jpg", "기빙플러스 업사이클 제품")
    ],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/330faf73802f80708574fdc86e452c38" }]
  }),
  project({
    id: "project-self-powered-dehumidifier",
    titleKo: "수분 자가 발전응용 제습장치 제작",
    summaryKo: "수분 자가발전 아이디어를 제습장치 구조와 결합해 실현 가능성을 검토한 하드웨어 프로젝트입니다.",
    year: "2024",
    tags: ["Energy", "Hardware", "Prototype"],
    images: [image("/assets/generated/project-lab.png", "수분 자가 발전응용 제습장치 대표 이미지", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/330faf73802f80baa069e8cf86b99000" }]
  }),
  project({
    id: "project-personal-color-chatbot",
    titleKo: "AWS 클라우드 활용 퍼스널컬러 챗봇",
    summaryKo: "슬랙 챗봇과 색 조합 분석을 통해 퍼스널 컬러를 추천하는 클라우드 기반 서비스 실험 프로젝트입니다.",
    year: "2023",
    tags: ["AWS", "Slack Bot", "Color"],
    images: [image("/assets/notion-projects/personal-color-cover.png", "퍼스널컬러 챗봇 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f80a99356c92f666342f7" }]
  }),
  project({
    id: "project-java-registration",
    titleKo: "객체지향프로그래밍 JAVA 수강신청 알고리즘",
    summaryKo: "소켓 통신과 객체지향 설계를 바탕으로 수강신청 알고리즘과 프로그램 구조를 구현한 프로젝트입니다.",
    year: "2023",
    tags: ["Java", "Socket", "OOP"],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f8015abedf888b2a0fcc9" }]
  }),
  project({
    id: "project-chiangmai-seminar",
    titleKo: "치앙마이 해외 SW교육 & 세미나",
    summaryKo: "치앙마이 대학교에서 SW 교육을 받고, 스마트 헬스케어 분야 세미나 발표까지 경험한 글로벌 학습 프로젝트입니다.",
    year: "2023",
    tags: ["Seminar", "Global", "Healthcare"],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f80c69e73d5c189974e0a" }]
  }),
  project({
    id: "project-robot-dog",
    titleKo: "4족보행 로봇 개발",
    summaryKo: "사족 보행 구조와 로봇 제어 흐름을 탐색하기 위한 로봇 프로젝트입니다.",
    year: "2026",
    tags: ["Robot", "Hardware"],
    images: [image("/assets/notion-projects/robot-dog-cover.png", "4족보행 로봇 개발 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f805582b6e4b6970a187f" }]
  }),
  project({
    id: "project-robot-arm",
    titleKo: "3D 설계 로봇팔 제어",
    summaryKo: "비전 인식 기반으로 로봇팔을 제어하는 흐름을 3D 설계와 함께 검토한 프로젝트입니다.",
    year: "2026",
    tags: ["Robot Arm", "3D", "Vision"],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f80a3a073d981caee0c8a" }]
  }),
  project({
    id: "project-ev-medical-vehicle",
    titleKo: "심부전증 환자를 위한 EV 차량 개선안",
    summaryKo: "실측 EV 차량 모델링을 바탕으로 이동형 의료 차량 아이디어를 구체화한 모빌리티 프로젝트입니다.",
    year: "2025",
    tags: ["EV", "Mobility", "Healthcare"],
    images: [image("/assets/notion-projects/ev-medical-cover.png", "EV 차량 개선안 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f80c8a2b7e86ecaeffe31" }]
  }),
  project({
    id: "project-peltier-cooler",
    titleKo: "펠티어 노트북 쿨러",
    summaryKo: "펠티어 소자의 전열발전을 활용해 냉각과 에너지 순환을 함께 노린 노트북 쿨러 아이디어 프로젝트입니다.",
    year: "2025",
    tags: ["Peltier", "Cooling", "Hardware"],
    images: [image("/assets/notion-projects/peltier-cover.jpg", "펠티어 노트북 쿨러 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f800780eade7b89c890b9" }]
  }),
  project({
    id: "project-clicker",
    titleKo: "압력센서를 활용한 발달장애 측정 클릭커",
    summaryKo: "압력센서를 손 움직임 지표로 활용해 발달장애 아동의 뇌인지 능력을 측정하려는 프로젝트입니다.",
    year: "2025",
    tags: ["Sensor", "Healthcare", "Prototype"],
    images: [image("/assets/notion-projects/clicker-cover.png", "발달장애 측정 클릭커 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f8074a3c4f9fb4ee90343" }]
  }),
  project({
    id: "project-coffee-box",
    titleKo: "커피박 업사이클 상자 제작",
    summaryKo: "강릉 지역 커피박 문제에서 출발해 실제 상자 제작 단계까지 연결한 업사이클 프로젝트입니다.",
    year: "2025",
    tags: ["Upcycling", "Coffee Grounds", "Product"],
    images: [image("/assets/notion-projects/coffee-box-cover.jpg", "커피박 업사이클 상자 제작 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f80cea845ee4a96cd48dd" }]
  }),
  project({
    id: "project-baekchul-sikhye",
    titleKo: "발효 백출 식혜 제작",
    summaryKo: "쓴 한약재 백출을 발효 기반 식혜로 바꾸고 데이터 예측까지 시도한 식품 개발 프로젝트입니다.",
    year: "2023",
    tags: ["Food Tech", "Data", "Experiment"],
    images: [image("/assets/notion-projects/baekchul-cover.jpg", "발효 백출 식혜 제작 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f80b0b391d7fe4e6af52f" }]
  }),
  project({
    id: "project-ai-pedal-blackbox",
    titleKo: "인지오류 예방 AI 페달 블랙박스",
    summaryKo: "페달 블랙박스를 활용해 사고 전 경고형 안내장치로 확장하는 아이디어 프로젝트입니다.",
    year: "2026",
    tags: ["AI", "Mobility", "Safety"],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f8000b265d7e04aeb385e" }]
  }),
  project({
    id: "project-population-visualization",
    titleKo: "유동인구 데이터 시각화",
    summaryKo: "서울 시민 유동 데이터를 기반으로 이슈 연계형 인구 포화 예측을 시도한 데이터 시각화 프로젝트입니다.",
    year: "2026",
    tags: ["Data Viz", "Big Data", "Urban"],
    images: [image("/assets/notion-projects/population-cover.png", "유동인구 데이터 시각화 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/333faf73802f80c5abb0fbccaef142e4" }]
  }),
  project({
    id: "project-drone-soccer",
    titleKo: "드론 축구",
    summaryKo: "드론 축구 대회 참여와 동아리 훈련을 통해 드론 제어와 실전 조작 감각을 쌓은 활동형 프로젝트입니다.",
    year: "2023",
    tags: ["Drone", "Competition", "Control"],
    images: [image("/assets/notion-projects/drone-soccer-cover.png", "드론 축구 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/336faf73802f805eaf09f934e75304b1" }]
  }),
  project({
    id: "project-manual-electric-vehicle",
    titleKo: "아두이노 기반 수동 제어 전기차량",
    summaryKo: "파워서플라이와 페달을 활용해 사람이 탑승 가능한 크기의 전기 차량을 제작하며 조향장치와 제어 로직을 익힌 프로젝트입니다.",
    year: "2025",
    tags: ["Arduino", "Vehicle", "Control"],
    images: [image("/assets/notion-projects/manual-ev-cover.jpg", "수동 제어 전기차량 커버", "cover")],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/33afaf73802f808b9eaad2ac3d37f544" }]
  }),
  project({
    id: "project-ess-hanok",
    titleKo: "한옥의 ESS 설계",
    summaryKo: "태양열 발전과 저장시설 부족 문제를 한옥 구조에 맞춰 해결하려는 ESS 아이디어 프로젝트입니다.",
    year: "2025",
    tags: ["Energy", "ESS", "Design"],
    links: [{ label: "Notion 원문", url: "https://www.notion.so/334faf73802f8030883bc17cc132f157" }]
  })
];
