import { UserRepository } from "@/repositories/user-repository";
import { ProductRepository } from "@/repositories/product-repository";

// Hard Delete Product Service
export async function HardDeleteProductService(id: string, userId: string) {
  const userRepository = new UserRepository();
  const productRepository = new ProductRepository();

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

  // Delete the Product from the Database
  await productRepository.delete(id);

  return {
    code: 200,
    status: "success",
    message: `Deleted Product ID: ${id} Successfully!`,
    data: null
  }
}

// Soft Delete Product Service
export async function SoftDeleteProductService(id: string, userId: string) {
  const userRepository = new UserRepository();
  const productRepository = new ProductRepository();

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

  // Deactivate Product from the Database
  await productRepository.softDelete(id);

  return {
    code: 200,
    status: "success",
    message: `Deactivated Product ID: ${id} Successfully!`,
    data: null
  }
}