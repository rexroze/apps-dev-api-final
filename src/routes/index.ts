import { Router } from "express";
import authRoutes from "@/routes/auth-routes";
import productRoutes from "@/routes/product-routes";
import categoryRoutes from "@/routes/category-routes";
import cartRoutes from "@/routes/cart-routes";
import checkoutRoutes from "@/routes/checkout-routes";
import ordersRoutes from "@/routes/orders-routes";
import reviewRoutes from "@/routes/review-routes";

const router = Router();

// Auth Endpoints
router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/category", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", ordersRoutes);
router.use("/review", reviewRoutes);

export default router;