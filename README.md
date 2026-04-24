# 권용현 사이버 포트폴리오

Next.js App Router 기반의 관리자 CMS 포함 포트폴리오입니다. 공개 페이지는 고정 화면 전환, 한영 전환, 다크/라이트 모드, 고급 커서 트래커를 포함하고, `/admin`은 GitHub 로그인 후 콘텐츠를 수정할 수 있습니다.

## Local Development

```bash
pnpm install
pnpm dev
```

현재 작업 환경처럼 전역 `pnpm`이 없으면, 임시 pnpm을 받은 뒤 Node로 실행해도 됩니다.

```powershell
node .tools\pnpm-package\bin\pnpm.cjs install
node .\node_modules\next\dist\bin\next dev
```

## Required Environment Variables

`.env.example`을 기준으로 Vercel 프로젝트에 환경변수를 설정합니다.

- `AUTH_SECRET`: NextAuth 세션 암호화 시크릿
- `NEXTAUTH_URL`: 로컬은 `http://localhost:3000`, 배포는 Vercel URL
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`: GitHub OAuth 앱
- `ADMIN_GITHUB_IDS`: 관리자 허용 GitHub ID 또는 login, 쉼표 구분
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: 콘텐츠 JSON 저장소
- `BLOB_READ_WRITE_TOKEN`: 관리자 이미지 업로드용 Vercel Blob 토큰

Redis/KV 환경변수가 없으면 기본 콘텐츠를 사용하고, 저장은 개발 서버 메모리에만 남습니다.

## Admin CMS

1. `/admin` 접속
2. GitHub 로그인
3. 수상, 프로젝트, 교육, 경험, 자격증, 소개 항목 추가/수정/삭제
4. 대표 노출과 대표 순서를 지정
5. 이미지 업로드 후 저장

## Deployment

Vercel에 프로젝트를 연결하고 위 환경변수를 설정한 뒤 배포합니다. Vercel Blob과 Upstash Redis/KV는 Vercel Marketplace에서 연결하는 구성을 권장합니다.
