import { ProductRepository } from "@/repositories/product-repository";
import { UserRepository } from "@/repositories/user-repository";
import { ProductData } from "@/types/product";

// Update Product
export async function UpdateProductService(id: string, data: ProductData) {
  const productRepository = new ProductRepository();
  const userRepository = new UserRepository();

  // Check if Product ID is provided
  if (!id) {
    return { code: 400, status: "error", message: "Product ID was not provided!" };
  }

  // Check User ID availability
  const isUserAvailable = await userRepository.findById(data.userId);
  if (!isUserAvailable) {
    return { code: 400, status: "error", message: "User ID not found!" };
  }

  // Check if the Product ID is existing in the Database
  const existingProduct = await productRepository.findById(id);
  if (!existingProduct) {
    return { code: 400, status: "error", message: "Product is not found!" };
  }
  if (existingProduct.userId !== data.userId) {
    return { code: 400, status: "error", message: "You do not own this product." };
  }

  // Validate price and stock are valid numbers
  if (data.price < 1 || data.stock < 1) {
    return { code: 400, status: "error", message: "Price / Stock are not valid numbers!" };
  }

  // Update the Product Data
  const result = await productRepository.update(id, data);

  return {
    code: 200,
    status: "success",
    message: "Updated Product Successfully!",
    data: result
  }
}

// Restore Product / Activate Product
export async function RestoreProductService(id: string, userId: string) {
  const productRepository = new ProductRepository();
  const userRepository = new UserRepository();

  // Check if Product ID is provided
  if (!id) {
    return { code: 400, status: "error", message: "Product ID was not provided!" };
  }

  // Check User ID availability
  const isUserAvailable = await userRepository.findById(userId);
  if (!isUserAvailable) {
    return { code: 400, status: "error", message: "User ID not found!" };
  }

  // Check if Product is existing in the Database
  const existingProduct = await productRepository.findById(id);
  if (!existingProduct) {
    return { code: 400, status: "error", message: "Product is not found!" };
  }
  if (existingProduct.userId !== userId) {
    return { code: 400, status: "error", message: "You do not own this product." };
  }

  // Restore Product
  const result = await productRepository.restoreProduct(id);

  return {
    code: 200,
    status: "success",
    message: `Activated Product ID: ${id} Successfully!`,
    data: result
  }
}