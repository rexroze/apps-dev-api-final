import passport from "passport";
import { buildGoogleStrategy } from "./strategies/google";
import { buildGithubStrategy } from "./strategies/github";

export function initializePassport() {
  const googleStrategy = buildGoogleStrategy();
  if (googleStrategy) {
    passport.use("google", googleStrategy);
  }

  const githubStrategy = buildGithubStrategy();
  if (githubStrategy) {
    passport.use("github", githubStrategy);
  }
}