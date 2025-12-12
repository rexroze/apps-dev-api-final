import { ProductRepository } from "@/repositories/product-repository";
import { UserRepository } from "@/repositories/user-repository";
import { ProductData } from "@/types/product";

export async function CreateProductService(data: ProductData) {
  const productRepository = new ProductRepository();
  const userRepository = new UserRepository();
  
  // Validate required fields
  if (!data.userId || !data.name || !data.description || data.price == null || data.stock == null || !data.image) {
    return { code: 400, status: "error", message: "Missing fields!" };
  }
  
  // Check User ID availability
  const isUserAvailable = await userRepository.findById(data.userId);
  if (!isUserAvailable) {
    return { code: 400, status: "error", message: "User ID not found!" };
  }

  // Validate price and stock
  if (data.price < 1 || data.stock < 1) {
    return { code: 400, status: "error", message: "Price / Stock are not valid numbers!" };
  }

  // Create Product
  const result = await productRepository.create({
    userId: data.userId,
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    image: data.image,
    categoryId: data.categoryId || undefined
  });

  return {
    code: 200,
    status: "success",
    message: "Created Product Successfully!",
    data: result
  };
}