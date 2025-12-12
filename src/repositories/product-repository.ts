
import { PrismaClient } from "@prisma/client";
import { ProductData } from "@/types/product";

export class ProductRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
  }

  async findAllByUser(userId: string) {
    return await this.prisma.product.findMany({ 
      where: { userId }, 
      orderBy: { name: "asc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    });
  }

  // Get All Active Products with User Details
  async findAllActive() {
    return await this.findActive();
  }

  // Find active products with optional search and pagination
  async findActive(options?: { search?: string; page?: number; limit?: number; categoryId?: string }) {
    const { search, page = 1, limit = 100, categoryId } = options ?? {};
    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const skip = (Math.max(page, 1) - 1) * Math.max(limit, 1);

    return await this.prisma.product.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
      include: ({
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      } as any)
    });
  }

  async create(data: ProductData) {
    return await this.prisma.product.create({ data });
  }

  async findById(id: string) {
    return await this.prisma.product.findFirst({ where: { id } });
  }

  async update(id: string, data: Partial<ProductData>) {
    return await this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.product.delete({ where: { id } });
  }

  async softDelete(id: string) {
    return await this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }

  async restoreProduct(id: string) {
    return await this.prisma.product.update({ where: { id }, data: { isActive: true } });
  }
}