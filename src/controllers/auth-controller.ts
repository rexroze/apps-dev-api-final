import { Request, Response } from "express";
import { SignupUserService, LoginCredentialsService, VerifyEmailService, RefreshTokenService, ResendEmailVerificationService } from "@/services/auth";
import { generateTempToken } from "@/services/auth/temp-token";

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
    const { refreshToken } = req.body ?? {};
    const result = await RefreshTokenService(refreshToken);
    return res.status(result.code).json(result);
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
    
    // Get frontend URL from environment
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const callbackPath = '/oauth-callback';
    
    if (result.status === 'success' && result.data) {
      // Generate temporary token with all the data
      const tempCode = generateTempToken(result.data);
      
      return res.redirect(`${frontendURL}${callbackPath}?code=${tempCode}`);
    } else {
      // Redirect to frontend with error
      const errorParams = new URLSearchParams({
        status: 'error',
        message: result.message || 'OAuth authentication failed',
        code: result.code?.toString() || '500',
      });
      
      return res.redirect(`${frontendURL}${callbackPath}?${errorParams.toString()}`);
    }
  }
}