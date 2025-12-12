import { Request, Response } from "express";
import { OrderRepository } from "@/repositories/order-repository";

const repo = new OrderRepository();

export class OrdersController {
  async listOrders(req: Request, res: Response) {
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
    const orders = await repo.listOrdersForUser(userId);
    return res.status(200).json({ code: 200, status: "success", data: orders });
  }

  async listAllOrders(req: Request, res: Response) {
    const orders = await repo.listAllOrders();
    return res.status(200).json({ code: 200, status: "success", data: orders });
  }
}

export default OrdersController;
