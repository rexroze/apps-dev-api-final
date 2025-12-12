import { Request, Response } from "express";
import { CreateCheckoutService } from "@/services/checkout/create-checkout";

export class CheckoutController {
  async checkout(req: Request, res: Response) {
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
    const { items } = req.body as { items: Array<{ productId?: string; id?: string; quantity?: number; qty?: number }> };

    // normalize items to { productId, quantity } and validate
    const normalized = (items || [])
      .map((it) => ({ productId: it.productId ?? it.id, quantity: it.quantity ?? it.qty ?? 1 }))
      .filter((it) => typeof it.productId === "string" && it.productId.length > 0);

    if (normalized.length === 0) {
      return res.status(400).json({ code: 400, status: "error", message: "No valid items provided" });
    }

    const result = await CreateCheckoutService(userId, normalized as any);
    return res.status(result.code).json(result);
  }
}

export default CheckoutController;
