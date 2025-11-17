import { Router } from "express";
import authRoutes from "@/routes/auth-routes";
import productRoutes from "@/routes/product-routes";

const router = Router();

// Auth Endpoints
router.use("/auth", authRoutes);
router.use("/product", productRoutes);

export default router;