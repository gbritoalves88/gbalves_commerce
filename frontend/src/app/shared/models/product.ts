// shared/models/product.ts
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;    // Preço original (para mostrar desconto)
  image: string;
  category: string;          // Slug da categoria
  description: string;
  stock: number;
  featured: boolean;         // Destaque na home?
  createdAt: Date;
}
