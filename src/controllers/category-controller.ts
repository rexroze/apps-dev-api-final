import { Request, Response } from "express";
import { GetAllCategoriesService, CreateCategoryService, UpdateCategoryService, DeleteCategoryService } from "@/services/categories";

export class CategoryController {
  async getAllCategories(_req: Request, res: Response) {
    const result = await GetAllCategoriesService();
    return res.status(result.code).json(result);
  }

  async createCategory(req: Request, res: Response) {
    const { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ code: 400, status: "error", message: "Category name is required" });
    }

    const result = await CreateCategoryService(name, slug);
    return res.status(result.code).json(result);
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { name, slug } = req.body;
    
    if (!id) {
      return res.status(400).json({ code: 400, status: "error", message: "Category ID is required" });
    }

    const result = await UpdateCategoryService(id, { name, slug });
    return res.status(result.code).json(result);
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ code: 400, status: "error", message: "Category ID is required" });
    }

    const result = await DeleteCategoryService(id);
    return res.status(result.code).json(result);
  }
}
