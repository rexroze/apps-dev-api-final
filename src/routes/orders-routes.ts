import { Router } from "express";
import { OrdersController } from "@/controllers/orders-controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { RoleMiddleware } from "@/middlewares/role-middleware";
import { Role } from "@prisma/client";

const router = Router();
const controller = new OrdersController();
const auth = new AuthMiddleware();

router.get("/v1", auth.execute, (req, res) => controller.listOrders(req, res));

// Admin: all orders
const adminRole = new RoleMiddleware(Role.ADMIN);
router.get("/v1/admin", auth.execute, adminRole.execute, (req, res) => controller.listAllOrders(req, res));

export default router;
