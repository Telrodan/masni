export interface Product {
  id?: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description: string;
  images: string[];
  category?: string;
  price: number;
  stock: number;
}
