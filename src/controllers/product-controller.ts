import { Request, Response } from "express";
import {
  CreateProductService,
  HardDeleteProductService,
  SoftDeleteProductService,
  UpdateProductService,
  RestoreProductService,
  GetAllProductsService,
  GetAllActiveProductsService,
  GetProductByIdService
} from "@/services/products";

export class ProductController {
  // Get All Products
  async getAllProducts(req: Request, res: Response) {
    const { userId } = req.body;
    const result = await GetAllProductsService(userId);
    return res.status(result.code).json(result);
  }

  // Get All Active Products
  async getAllActiveProducts(_req: Request, res: Response) {
    const result = await GetAllActiveProductsService();
    return res.status(result.code).json(result);
  }

  // Get Product By ID
  async getProductById(req: Request, res: Response) {
    const { id } = req.body;
    const result = await GetProductByIdService(id);
    return res.status(result.code).json(result);
  }

  // Create Product
  async createProduct(req: Request, res: Response) {
    const result = await CreateProductService(req.body);
    return res.status(result.code).json(result);
  }

  // Update Product
  async updateProduct(req: Request, res: Response) {
    const { id, ...data } = req.body;
    const result = await UpdateProductService(id, data);
    return res.status(result.code).json(result);
  }

  // Hard Delete Product
  async hardDeleteProduct(req: Request, res: Response) {
    const { id, userId } = req.body;
    const result = await HardDeleteProductService(id, userId);
    return res.status(result.code).json(result);
  }

  // Soft Delete Product
  async softDeleteProduct(req: Request, res: Response) {
    const { id, userId } = req.body;
    const result = await SoftDeleteProductService(id, userId);
    return res.status(result.code).json(result);
  }

  // Restore Product
  async restoreProduct(req: Request, res: Response) {
    const { id, userId } = req.body;
    const result = await RestoreProductService(id, userId);
    return res.status(result.code).json(result);
  }
}