import { Request, Response } from "express";
import { CartRepository } from "@/repositories/cart-repository";

const repo = new CartRepository();

export class CartController {
  async getCart(req: Request, res: Response) {
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
    const items = await repo.getCartByUser(userId);
    return res.status(200).json({ code: 200, status: "success", data: items });
  }

  async saveCart(req: Request, res: Response) {
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
    const { items } = req.body as { items: Array<{ productId: string; quantity: number }> };
    if (!Array.isArray(items)) return res.status(400).json({ code: 400, status: "error", message: "Invalid items" });
    const saved = await repo.saveCartForUser(userId, items);
    return res.status(200).json({ code: 200, status: "success", data: saved });
  }

  async clearCart(req: Request, res: Response) {
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
    await repo.clearCartForUser(userId);
    return res.status(200).json({ code: 200, status: "success" });
  }
}

export default CartController;
