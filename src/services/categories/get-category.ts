import { CategoryRepository } from "@/repositories/category-repository";

export async function GetAllCategoriesService() {
  const repo = new CategoryRepository();
  const data = await repo.findAll();
  return {
    code: 200,
    status: "success",
    message: "Fetched all categories successfully",
    data
  };
}

export async function CreateCategoryService(name: string, slug?: string) {
  const repo = new CategoryRepository();
  const created = await repo.create(name, slug);
  return {
    code: 201,
    status: "success",
    message: "Category created successfully",
    data: created
  };
}
