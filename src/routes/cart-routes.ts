import { Router } from "express";
import { CartController } from "@/controllers/cart-controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";

const router = Router();
const controller = new CartController();
const auth = new AuthMiddleware();

router.get("/v1", auth.execute, (req, res) => controller.getCart(req, res));
router.post("/v1", auth.execute, (req, res) => controller.saveCart(req, res));
router.delete("/v1", auth.execute, (req, res) => controller.clearCart(req, res));

export default router;
