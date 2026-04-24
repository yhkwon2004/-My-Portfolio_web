import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GitHub from "next-auth/providers/github";

function allowedAdmins() {
  return (process.env.ADMIN_GITHUB_IDS ?? "")
    .split(",")
    .map((id) => id.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET ?? ""
    })
  ],
  callbacks: {
    async signIn({ profile }) {
      const admins = allowedAdmins();
      if (admins.length === 0) {
        return process.env.NODE_ENV !== "production";
      }

      const githubProfile = profile as { id?: string | number; login?: string } | undefined;
      const githubId = String(githubProfile?.id ?? "").toLowerCase();
      const githubLogin = String(githubProfile?.login ?? "").toLowerCase();
      return admins.includes(githubId) || admins.includes(githubLogin);
    },
    session({ session, token }) {
      if (session.user) {
        session.user.name = session.user.name || String(token.name ?? "");
      }
      return session;
    }
  }
};

export function auth() {
  return getServerSession(authOptions);
}
