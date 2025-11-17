import { Router } from "express";
import passport from "passport";
import { AuthController } from "@/controllers/auth-controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";

// Initialize
const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Authentication Routes
router.post("/v1/signup", authController.signup);
router.post("/v1/login", authController.login);
router.get("/v1/verify-email", authController.verifyEmail);
router.post("/v1/resend-email-verification", authController.resendEmailVerification);
router.post("/v1/refresh-token", authController.refresh);

// Authenticated Routes
router.post("/v1/logout", authMiddleware.execute, authController.logout);

// OAuth (Google & GitHub) Routes
router.get("/v1/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/v1/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/auth/failed" }), authController.OAuthCallback);
router.get("/v1/github", passport.authenticate("github", { scope: ["user:email"], session: false }));
router.get("/v1/github/callback", passport.authenticate("github", { session: false, failureRedirect: "/auth/failed" }), authController.OAuthCallback);

export default router;