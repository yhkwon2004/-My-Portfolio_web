import { auth } from "@/auth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { getContent } from "@/lib/content-store";

export default async function AdminPage() {
  const hasAuthConfig = Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET && process.env.AUTH_SECRET);
  const session = await auth().catch(() => null);
  const content = await getContent();

  if (!hasAuthConfig) {
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <p className="eyebrow">Admin setup</p>
          <h1>GitHub 로그인 환경변수가 필요합니다.</h1>
          <p>
            Vercel 환경변수에 <code>AUTH_SECRET</code>, <code>AUTH_GITHUB_ID</code>, <code>AUTH_GITHUB_SECRET</code>,{" "}
            <code>ADMIN_GITHUB_IDS</code>를 설정하면 관리자 편집기가 활성화됩니다.
          </p>
          <a className="button-link" href="/">
            공개 포트폴리오 보기
          </a>
        </section>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <p className="eyebrow">Protected CMS</p>
          <h1>관리자 로그인</h1>
          <p>GitHub 계정으로 로그인한 뒤 포트폴리오의 수상, 프로젝트, 대표 노출, 이미지를 수정할 수 있습니다.</p>
          <a className="button-link" href="/api/auth/signin/github?callbackUrl=/admin">
            GitHub로 로그인
          </a>
        </section>
      </main>
    );
  }

  return <AdminDashboard initialContent={content} userName={session.user.name ?? session.user.email ?? "Admin"} />;
}
