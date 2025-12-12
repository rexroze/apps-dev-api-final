import { Router } from "express";
import passport from "passport";
import { AuthController } from "@/controllers/auth-controller";
import { exchangeTempToken } from "@/services/auth/temp-token";

// Initialize
const router = Router();
const authController = new AuthController();

// Authentication Routes
router.post("/v1/signup", authController.signup);
router.post("/v1/login", authController.login);
router.get("/v1/verify-email", authController.verifyEmail);
router.post("/v1/resend-email-verification", authController.resendEmailVerification);
router.post("/v1/refresh-token", authController.refresh);

// OAuth (Google & GitHub) Routes
// Middleware to capture redirect parameter and store it in a cookie
router.get("/v1/google", (req, res, next) => {
  const redirect = req.query.redirect as string;
  // Store redirect URL in a cookie that will be available in the callback
  if (redirect) {
    res.cookie('oauth_redirect', redirect, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60000 // 1 minute
    });
  }
  passport.authenticate("google", { 
    scope: ["profile", "email"], 
    session: false
  })(req, res, next);
});
router.get("/v1/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/failed" }), authController.OAuthCallback);
router.get("/v1/github", (req, res, next) => {
  const redirect = req.query.redirect as string;
  // Store redirect URL in a cookie that will be available in the callback
  if (redirect) {
    res.cookie('oauth_redirect', redirect, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60000 // 1 minute
    });
  }
  passport.authenticate("github", { 
    scope: ["user:email"], 
    session: false
  })(req, res, next);
});
router.get("/v1/github/callback", passport.authenticate("github", { session: false, failureRedirect: "/auth/failed" }), authController.OAuthCallback);

// OAuth Token Exchange Route
router.get("/v1/oauth/exchange", (req, res) => {
  const { code } = req.query;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Missing or invalid code"
    });
  }
  
  const data = exchangeTempToken(code);
  
  if (!data) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid or expired code"
    });
  }
  
  return res.status(200).json({
    code: 200,
    status: "success",
    data: data
  });
});

export default router;