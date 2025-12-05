import { Router } from "express";
import { Role } from "@prisma/client";
import { CategoryController } from "@/controllers/category-controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { RoleMiddleware } from "@/middlewares/role-middleware";

const router = Router();
const controller = new CategoryController();
const auth = new AuthMiddleware();
const adminOnly = new RoleMiddleware(Role.ADMIN);

// Public: list categories
router.get("/v1/categories", controller.getAllCategories.bind(controller));

// Admin: create category
router.post("/v1/categories", auth.execute, adminOnly.execute, controller.createCategory.bind(controller));

export default router;
