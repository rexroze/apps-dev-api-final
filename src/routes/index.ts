import { Router } from "express";
import authRoutes from "@/routes/auth-routes";
import productRoutes from "@/routes/product-routes";
import categoryRoutes from "@/routes/category-routes";

const router = Router();

// Auth Endpoints
router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/category", categoryRoutes);

export default router;