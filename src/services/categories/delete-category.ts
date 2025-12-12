import { CategoryRepository } from "@/repositories/category-repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DeleteCategoryService(id: string) {
  const repo = new CategoryRepository();

  try {
    const category = await repo.findById(id);
    if (!category) {
      return { code: 404, status: "error", message: "Category not found" };
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      return { 
        code: 400, 
        status: "error", 
        message: `Cannot delete category. It has ${productsCount} product(s) associated with it. Please remove or reassign products first.` 
      };
    }

    await repo.delete(id);
    return { code: 200, status: "success", message: "Category deleted successfully" };
  } catch (error: any) {
    return { code: 500, status: "error", message: error.message || "Failed to delete category" };
  }
}

