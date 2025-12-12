import { Router } from "express";
import { ReviewController } from "@/controllers/review-controller";
import { AuthMiddleware } from "@/middlewares/auth-middleware";

const router = Router();
const controller = new ReviewController();
const auth = new AuthMiddleware();

// Public routes
router.get("/v1/product/:productId", (req, res) => controller.getReviewsByProduct(req, res));
router.get("/v1/product/:productId/stats", (req, res) => controller.getReviewStats(req, res));

// Authenticated routes
router.post("/v1", auth.execute, (req, res) => controller.createReview(req, res));
router.get("/v1/product/:productId/user", auth.execute, (req, res) => controller.getUserReview(req, res));
router.get("/v1/order-item/:orderItemId/user", auth.execute, (req, res) => controller.getUserReviewByOrderItem(req, res));
router.put("/v1/:reviewId", auth.execute, (req, res) => controller.updateReview(req, res));
router.delete("/v1/:reviewId", auth.execute, (req, res) => controller.deleteReview(req, res));

export default router;

