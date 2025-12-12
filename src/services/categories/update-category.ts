import { CategoryRepository } from "@/repositories/category-repository";

export async function UpdateCategoryService(id: string, data: { name?: string; slug?: string }) {
  const repo = new CategoryRepository();

  try {
    const category = await repo.findById(id);
    if (!category) {
      return { code: 404, status: "error", message: "Category not found" };
    }

    const updated = await repo.update(id, data);
    return { code: 200, status: "success", data: updated };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { code: 400, status: "error", message: "Category name or slug already exists" };
    }
    return { code: 500, status: "error", message: error.message || "Failed to update category" };
  }
}

