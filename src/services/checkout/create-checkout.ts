import { PrismaClient } from "@prisma/client";
import { OrderRepository } from "@/repositories/order-repository";
import { CartRepository } from "@/repositories/cart-repository";
import { CreateXenditPayment } from "@/services/xendit/create-payment";

const prisma = new PrismaClient();

type Item = { productId: string; quantity: number };

export async function CreateCheckoutService(userId: string, items: Item[]) {
  // Validate and perform transactional stock decrement and create order
  if (!items || items.length === 0) return { code: 400, status: "error", message: "No items provided" };

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Lock and validate stocks
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const it of items) {
        const p = productMap.get(it.productId);
        if (!p || !p.isActive) {
          throw { code: 400, message: `Product ${it.productId} not available` };
        }
        if (p.stock < it.quantity) {
          throw { code: 400, message: `Insufficient stock for product ${p.name}` };
        }
      }

      // Decrement stocks
      for (const it of items) {
        await tx.product.update({ where: { id: it.productId }, data: { stock: { decrement: it.quantity } } });
      }

      // Calculate total
      const total = items.reduce((s, it) => s + (productMap.get(it.productId)!.price * it.quantity), 0);

      // Create order and order items
      const order = await tx.order.create({ data: { userId, total } });

      const createdItems = await Promise.all(
        items.map((it) => tx.orderItem.create({ data: { orderId: order.id, productId: it.productId, quantity: it.quantity, price: productMap.get(it.productId)!.price } } as any))
      );

      // Get user info for Xendit
      const user = await tx.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });

      // Create Xendit payment invoice
      let paymentUrl: string | null = null;
      let invoiceId: string | null = null;
      
      const paymentResult = await CreateXenditPayment({
        amount: total,
        orderId: order.id,
        customerName: user?.name || "Customer",
        customerEmail: user?.email || undefined,
        description: `Order #${order.id.slice(0, 8)} - ${items.length} item(s)`,
        items: items.map((it) => {
          const product = productMap.get(it.productId)!;
          return {
            name: product.name,
            quantity: it.quantity,
            price: product.price,
          };
        }),
      });

      if (paymentResult.success && paymentResult.invoiceUrl) {
        paymentUrl = paymentResult.invoiceUrl;
        invoiceId = paymentResult.invoiceId || null;
      } else {
        console.warn("Xendit payment creation skipped or failed:", paymentResult.error || "Not configured");
        // Continue with order creation even if payment fails
        // Payment can be retried later
      }

      // Clear user's cart
      const where: any = { userId };
      await tx.cartItem.deleteMany({ where } as any);

      return { order, items: createdItems, paymentUrl, invoiceId };
    });

    return { code: 200, status: "success", data: result };
  } catch (err: any) {
    if (err && err.code && err.message) {
      return { code: err.code === 400 ? 400 : 500, status: "error", message: err.message };
    }
    return { code: 500, status: "error", message: "Checkout failed" };
  }
}

export default CreateCheckoutService;
