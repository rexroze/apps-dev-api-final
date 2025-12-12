import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderRepository {
  async createOrder(userId: string, items: Array<{ productId: string; quantity: number; price: number }>) {
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: { userId, total } });

      const createdItems = await Promise.all(
        items.map((it) =>
          tx.orderItem.create({ data: { orderId: order.id, productId: it.productId, quantity: it.quantity, price: it.price } })
        )
      );

      return { order, items: createdItems };
    });
  }

  async listOrdersForUser(userId: string) {
    return prisma.order.findMany({ where: { userId }, include: { items: { include: { product: true } }, user: true }, orderBy: { createdAt: "desc" } });
  }

  async listAllOrders() {
    return prisma.order.findMany({ include: { items: { include: { product: true } }, user: true }, orderBy: { createdAt: "desc" } });
  }
}

export default OrderRepository;
