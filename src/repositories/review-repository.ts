import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ReviewRepository {
  async createReview(userId: string, productId: string, orderItemId: string, rating: number, comment?: string) {
    return prisma.review.create({
      data: {
        userId,
        productId,
        orderItemId,
        rating,
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItem: {
          include: {
            order: {
              select: {
                id: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  async updateReview(reviewId: string, userId: string, rating?: number, comment?: string) {
    return prisma.review.update({
      where: {
        id: reviewId,
        userId, // Ensure user owns the review
      },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteReview(reviewId: string, userId: string) {
    return prisma.review.delete({
      where: {
        id: reviewId,
        userId, // Ensure user owns the review
      },
    });
  }

  async getReviewsByProduct(
    productId: string,
    options?: {
      rating?: number;
      sortBy?: "createdAt" | "rating";
      sortOrder?: "asc" | "desc";
      limit?: number;
    }
  ) {
    const where: any = { productId };
    if (options?.rating) {
      where.rating = options.rating;
    }

    const orderBy: any = {};
    if (options?.sortBy) {
      orderBy[options.sortBy] = options.sortOrder || "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    return prisma.review.findMany({
      where,
      orderBy,
      take: options?.limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getReviewStats(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution = reviews.reduce(
      (acc, r) => {
        acc[r.rating as keyof typeof acc]++;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  async getUserReview(userId: string, productId: string) {
    // Get the most recent review for this product by this user
    return prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItem: {
          include: {
            order: {
              select: {
                id: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserReviewByOrderItem(userId: string, orderItemId: string) {
    return prisma.review.findUnique({
      where: {
        userId_orderItemId: {
          userId: userId,
          orderItemId: orderItemId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItem: {
          include: {
            order: {
              select: {
                id: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  async hasUserPurchasedOrderItem(userId: string, orderItemId: string): Promise<boolean> {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: orderItemId,
        order: {
          userId,
        },
      },
    });
    return !!orderItem;
  }

  async hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
        },
      },
    });
    return !!orderItem;
  }
}

export default ReviewRepository;

