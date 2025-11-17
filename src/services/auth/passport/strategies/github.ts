import { Strategy as GithubStrategy, Profile as GithubProfile } from "passport-github2";
import { OAuthLoginService } from "@/services/auth/oauth-login";

export function buildGithubStrategy() {
  const clientID = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callbackURL = process.env.GITHUB_CALLBACK_URL;

  if (!clientID || !clientSecret || !callbackURL) {
    console.warn("GitHub OAuth environment variables are not fully configured. Skipping GitHub strategy.");
    return null;
  }

  return new GithubStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
      scope: ["user:email"],
    },
    async (accessToken: string, refreshToken: string, profile: GithubProfile, done: (error: any, user?: any) => void) => {
      try {
        const emails = Array.isArray(profile.emails) ? profile.emails : [];
        const primaryEmail = emails.find((email) => (email as any).primary)?.value;
        const fallbackEmail = primaryEmail ?? emails[0]?.value;

        const result = await OAuthLoginService({
          provider: "github",
          providerAccountId: profile.id,
          email: fallbackEmail,
          name: profile.displayName ?? profile.username ?? "GitHub User",
          accessToken,
          refreshToken,
        });

        return done(null, result);
      } catch (error) {
        return done(error as Error);
      }
    }
  );
}
