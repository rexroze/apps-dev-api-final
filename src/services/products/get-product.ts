import { UserRepository } from "@/repositories/user-repository";
import { ProductRepository } from "@/repositories/product-repository";
import { enrichProductWithStats, enrichProductsWithStats } from "@/utils/product-enrichment";

// Get All Products regardles if Active / Not (Admin Only)
export async function GetAllProductsService(userId: string) {
  const productRepository = new ProductRepository();
  const userRepository = new UserRepository();

  // Check User ID availability
  const isUserAvailable = await userRepository.findById(userId);
  if (!isUserAvailable) {
    return { code: 400, status: "error", message: "User ID not found!" };
  }

  // Find All Users
  const result = await productRepository.findAllByUser(userId);

  return {
    code: 200,
    status: "success",
    message: "Fetched all products successfully!",
    data: result
  }
}

// Get All Active Products (User & Admin)
export async function GetAllActiveProductsService(options?: { search?: string; page?: number; limit?: number; categoryId?: string }) {
  const productRepository = new ProductRepository();

  const result = await productRepository.findActive(options);
  const enriched = await enrichProductsWithStats(result);

  return {
    code: 200,
    status: "success",
    message: "Fetched all active products successfully!",
    data: enriched
  }
}

// Get Product By ID (User & Admin)
export async function GetProductByIdService(id: string) {
  const productRepository = new ProductRepository();

  // Check if Product ID is provided
  if (!id) {
    return { code: 400, status: "error", message: "Product ID was not provided!" };
  }

  // Check if Product is existing in the Database
  const existingProduct = await productRepository.findById(id);
  if (!existingProduct) {
    return { code: 400, status: "error", message: "Product is not found!" };
  }

  const enriched = await enrichProductWithStats(existingProduct);

  return {
    code: 200,
    status: "success",
    message: "Fetched the product successfully!",
    data: enriched
  }
}