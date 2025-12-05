export interface ProductData {
  userId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId?: string;
}