import { Request, Response } from "express";
import { GetAllCategoriesService, CreateCategoryService } from "@/services/categories";

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
}
