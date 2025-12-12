import { Request, Response } from "express";
import { ReviewRepository } from "@/repositories/review-repository";

const repo = new ReviewRepository();

export class ReviewController {
  async createReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.sub;
      if (!userId) {
        return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
      }

      const { productId, orderItemId, rating, comment } = req.body;

      if (!productId || !orderItemId || !rating) {
        return res.status(400).json({ code: 400, status: "error", message: "Product ID, Order Item ID, and rating are required" });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ code: 400, status: "error", message: "Rating must be between 1 and 5" });
      }

      // Check if user has purchased this specific order item
      const hasPurchased = await repo.hasUserPurchasedOrderItem(userId, orderItemId);
      if (!hasPurchased) {
        return res.status(403).json({ code: 403, status: "error", message: "You must purchase the product before reviewing it" });
      }

      // Check if user already reviewed this specific order item
      const existingReview = await repo.getUserReviewByOrderItem(userId, orderItemId);
      if (existingReview) {
        return res.status(400).json({ code: 400, status: "error", message: "You have already reviewed this order item" });
      }

      const review = await repo.createReview(userId, productId, orderItemId, rating, comment);
      return res.status(201).json({ code: 201, status: "success", data: review });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(400).json({ code: 400, status: "error", message: "You have already reviewed this order item" });
      }
      console.error("Error creating review:", error);
      return res.status(500).json({ code: 500, status: "error", message: "Failed to create review" });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.sub;
      if (!userId) {
        return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
      }

      const { reviewId } = req.params;
      const { rating, comment } = req.body;

      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return res.status(400).json({ code: 400, status: "error", message: "Rating must be between 1 and 5" });
      }

      const review = await repo.updateReview(reviewId, userId, rating, comment);
      return res.status(200).json({ code: 200, status: "success", data: review });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ code: 404, status: "error", message: "Review not found or you don't have permission" });
      }
      console.error("Error updating review:", error);
      return res.status(500).json({ code: 500, status: "error", message: "Failed to update review" });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.sub;
      if (!userId) {
        return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
      }

      const { reviewId } = req.params;
      await repo.deleteReview(reviewId, userId);
      return res.status(200).json({ code: 200, status: "success", message: "Review deleted successfully" });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ code: 404, status: "error", message: "Review not found or you don't have permission" });
      }
      console.error("Error deleting review:", error);
      return res.status(500).json({ code: 500, status: "error", message: "Failed to delete review" });
    }
  }

  async getReviewsByProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { rating, sortBy, sortOrder, limit } = req.query;

      const options: any = {};
      if (rating) options.rating = parseInt(rating as string);
      if (sortBy) options.sortBy = sortBy as "createdAt" | "rating";
      if (sortOrder) options.sortOrder = sortOrder as "asc" | "desc";
      if (limit) options.limit = parseInt(limit as string);

      const reviews = await repo.getReviewsByProduct(productId, options);
      return res.status(200).json({ code: 200, status: "success", data: reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ code: 500, status: "error", message: "Failed to fetch reviews" });
    }
  }

  async getReviewStats(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const stats = await repo.getReviewStats(productId);
      return res.status(200).json({ code: 200, status: "success", data: stats });
    } catch (error) {
      console.error("Error fetching review stats:", error);
      return res.status(500).json({ code: 500, status: "error", message: "Failed to fetch review stats" });
    }
  }

  async getUserReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.sub;
      if (!userId) {
        return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
      }

      const { productId } = req.params;
      const review = await repo.getUserReview(userId, productId);
      return res.status(200).json({ code: 200, status: "success", data: review });
    } catch (error) {
      console.error("Error fetching user review:", error);
      return res.status(500).json({ code: 500, status: "error", message: "Failed to fetch user review" });
    }
  }

  async getUserReviewByOrderItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.sub;
      if (!userId) {
        return res.status(401).json({ code: 401, status: "error", message: "Authentication required" });
      }

      const { orderItemId } = req.params;
      const review = await repo.getUserReviewByOrderItem(userId, orderItemId);
      return res.status(200).json({ code: 200, status: "success", data: review });
    } catch (error) {
      console.error("Error fetching user review by order item:", error);
      return res.status(500).json({ code: 500, status: "error", message: "Failed to fetch user review" });
    }
  }
}

export default ReviewController;

