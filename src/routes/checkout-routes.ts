import { Router } from "express";
import { CheckoutController } from "@/controllers/checkout-controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";

const router = Router();
const controller = new CheckoutController();
const auth = new AuthMiddleware();

router.post("/v1", auth.execute, (req, res) => controller.checkout(req, res));

export default router;
