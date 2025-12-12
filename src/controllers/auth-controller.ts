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
    
    // Get redirect URL from state parameter (preserved through OAuth flow)
    // State is base64 encoded redirect URL
    let redirectUrl: string | undefined;
    if (req.query.state && typeof req.query.state === 'string') {
      try {
        redirectUrl = Buffer.from(req.query.state, 'base64').toString('utf-8');
      } catch (e) {
        console.error('Failed to decode state parameter:', e);
      }
    }
    
    // Also check cookie as fallback (for backwards compatibility)
    if (!redirectUrl) {
      redirectUrl = req.cookies?.oauth_redirect as string | undefined;
      if (redirectUrl) {
        res.clearCookie('oauth_redirect');
      }
    }
    
    // Fall back to environment variable or default
    if (!redirectUrl) {
      redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      console.log('Using FRONTEND_URL from environment:', redirectUrl);
    } else {
      console.log('Using redirect URL from state/cookie:', redirectUrl);
    }
    
    // Normalize redirect URL - remove trailing slash
    let frontendURL = redirectUrl.replace(/\/+$/, '');
    const callbackPath = '/oauth-callback';
    
    // If redirectUrl doesn't already include the callback path, add it
    if (!frontendURL.includes('/oauth-callback')) {
      frontendURL = `${frontendURL}${callbackPath}`;
    }
    
    if (result.status === 'success' && result.data) {
      // Generate temporary token with all the data
      const tempCode = generateTempToken(result.data);
      
      return res.redirect(`${frontendURL}?code=${tempCode}`);
    } else {
      // Redirect to frontend with error
      const errorParams = new URLSearchParams({
        status: 'error',
        message: result.message || 'OAuth authentication failed',
        code: result.code?.toString() || '500',
      });
      
      return res.redirect(`${frontendURL}?${errorParams.toString()}`);
    }
  }
}