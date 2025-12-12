import { PrismaClient } from "@prisma/client";
import { ReviewRepository } from "@/repositories/review-repository";

const prisma = new PrismaClient();
const reviewRepo = new ReviewRepository();

export async function enrichProductWithStats(product: any) {
  // Get sold count from order items
  const soldCount = await prisma.orderItem.aggregate({
    where: { productId: product.id },
    _sum: { quantity: true },
  });

  // Get review stats
  const reviewStats = await reviewRepo.getReviewStats(product.id);

  return {
    ...product,
    soldCount: soldCount._sum.quantity || 0,
    averageRating: reviewStats.averageRating,
    totalReviews: reviewStats.totalReviews,
  };
}

export async function enrichProductsWithStats(products: any[]) {
  return Promise.all(products.map((product) => enrichProductWithStats(product)));
}

