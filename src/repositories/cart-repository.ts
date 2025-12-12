import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CartRepository {
  async getCartByUser(userId: string) {
    const where: any = { userId };
    return prisma.cartItem.findMany({ where, include: { product: true } as any } as any);
  }

  async clearCartForUser(userId: string) {
    const where: any = { userId };
    return prisma.cartItem.deleteMany({ where } as any);
  }

  // Replace user's cart with given items (simple approach)
  async saveCartForUser(userId: string, items: Array<{ productId: string; quantity: number }>) {
    return prisma.$transaction(async (tx) => {
      const where: any = { userId };
      await tx.cartItem.deleteMany({ where } as any);
      if (!items || items.length === 0) return [];
      const creates = items.map((it) => tx.cartItem.create({ data: { userId, productId: it.productId, quantity: it.quantity } } as any));
      return Promise.all(creates as any) as any;
    }) as any;
  }
}

export default CartRepository;
