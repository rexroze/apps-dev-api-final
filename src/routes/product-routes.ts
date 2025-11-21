import { Router } from "express";
import { Role } from "@prisma/client";
import { ProductController } from "@/controllers/product-controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";
import { RoleMiddleware } from "@/middlewares/role-middleware";

// Initialize
const router = Router();
const productController = new ProductController();
const authMiddleware = new AuthMiddleware();
const adminOnly = new RoleMiddleware(Role.ADMIN);

// Authenticated Only - General Roles Can Access
router.get("/v1/product-active-list", authMiddleware.execute, productController.getAllActiveProducts);
router.post("/v1/product-get-by-id", authMiddleware.execute, productController.getProductById);

// Authenticated & Admin Only Routes
router.post("/v1/product-list", authMiddleware.execute, adminOnly.execute, productController.getAllProducts);
router.post("/v1/product-create", authMiddleware.execute, adminOnly.execute, productController.createProduct);
router.post("/v1/product-update", authMiddleware.execute, adminOnly.execute, productController.updateProduct);
router.post("/v1/product-hard-delete", authMiddleware.execute, adminOnly.execute, productController.hardDeleteProduct);
router.post("/v1/product-soft-delete", authMiddleware.execute, adminOnly.execute, productController.softDeleteProduct);
router.post("/v1/product-restore", authMiddleware.execute, adminOnly.execute, productController.restoreProduct);

export default router;