import { PrismaClient } from "@prisma/client";

export class CategoryRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? new PrismaClient();
  }

  async findAll() {
    return await this.prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  async findById(id: string) {
    return await this.prisma.category.findUnique({ where: { id } });
  }

  async create(name: string, slug?: string) {
    return await this.prisma.category.create({ data: { name, slug } });
  }

  async update(id: string, data: { name?: string; slug?: string }) {
    return await this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await this.prisma.category.delete({ where: { id } });
  }
}
