import { Request, Response } from "express";
import { SignupUserService, LoginCredentialsService, VerifyEmailService, RefreshTokenService, ResendEmailVerificationService } from "@/services/auth";

export class AuthController {
  // Credentials Signup
  public async signup(req: Request, res: Response) {
    const { name, email, password } = req.body ?? {};
    const result = await SignupUserService(name, email, password);
    return res.status(result.code).json(result);
  }

  // Email Verification
  public async verifyEmail(req: Request, res: Response) {
    const token = req.query.token as string;
    const result = await VerifyEmailService(token);

    // Success → redirect to frontend
    if (result.code === 200) {
      const redirectURL = process.env.FRONTEND_URL || "http://localhost:3000";
      // Can use the parameter (emailVerified=success) as an indicator for Frontend Alert
      return res.redirect(`${redirectURL}?emailVerified=success`);
    }

    return res.status(result.code).json(result);
  }
  
  // Handle Login Account
  public async login(req: Request, res: Response) {
    const { email, password } = req.body ?? {};
    const result = await LoginCredentialsService(email, password);
    return res.status(result.code).json(result);
  }

  // Refresh Token Helps Generate another valid Access Token
  public async refresh(req: Request, res: Response) {
    const refreshHeader = req.headers["x-refresh-token"];
    const refreshToken = (Array.isArray(refreshHeader) ? refreshHeader[0] : refreshHeader) ?? req.body?.refreshToken;
    const result = await RefreshTokenService(refreshToken);
    return res.status(result.code).json(result);
  }

  // Logout Account
  public async logout(_req: Request, res: Response) {
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Logged out successfully",
    });
  }

  // Resend Email Verification
  public async resendEmailVerification(req: Request, res: Response) {
    const { email } = req.body ?? {};
    const result = await ResendEmailVerificationService(email);
    return res.status(result.code).json(result);
  }

  // OAuth Callback
  public async OAuthCallback(req: Request, res: Response) {
    const oauthResult = (req as any).user;
    const result = oauthResult ?? { code: 500, status: "error", message: "OAuth authentication failed" };
    const statusCode = typeof result?.code === "number" ? result.code : 500;
    return res.status(statusCode).json(result);
  }
}