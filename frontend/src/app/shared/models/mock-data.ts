// shared/models/mock-data.ts
import { Product } from './product';
import { Category } from './category';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Camisetas', slug: 'camisetas' },
  { id: 2, name: 'Garrafas', slug: 'garrafas' },
  { id: 3, name: 'Canecas', slug: 'canecas' },
  { id: 4, name: 'Acessórios', slug: 'acessorios' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Camiseta Basic Preta',
    slug: 'camiseta-basic-preta',
    price: 59.90,
    originalPrice: 89.90,
    image: 'https://i.ibb.co/placeholder/black-tshirt.jpg',
    category: 'camisetas',
    description: 'Camiseta 100% algodão, confortável e durável.',
    stock: 50,
    featured: true,
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Camiseta Basic Branca',
    slug: 'camiseta-basic-branca',
    price: 59.90,
    image: 'https://i.ibb.co/placeholder/white-tshirt.jpg',
    category: 'camisetas',
    description: 'Camiseta branca básica, essencial no guarda-roupa.',
    stock: 30,
    featured: true,
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Garrafa Térmica 500ml',
    slug: 'garrafa-termica-500ml',
    price: 79.90,
    originalPrice: 99.90,
    image: 'https://i.ibb.co/placeholder/thermal-bottle.jpg',
    category: 'garrafas',
    description: 'Mantém sua bebida gelada por 12h ou quente por 6h.',
    stock: 20,
    featured: true,
    createdAt: new Date()
  },
  {
    id: 4,
    name: 'Caneca Personalizada',
    slug: 'caneca-personalizada',
    price: 39.90,
    image: 'https://i.ibb.co/placeholder/mug.jpg',
    category: 'canecas',
    description: 'Caneca de cerâmica com estampa exclusiva.',
    stock: 40,
    featured: true,
    createdAt: new Date()
  },
  {
    id: 5,
    name: 'Garrafa Térmica 750ml',
    slug: 'garrafa-termica-750ml',
    price: 99.90,
    image: 'https://i.ibb.co/placeholder/thermal-bottle-big.jpg',
    category: 'garrafas',
    description: 'Garrafa térmica maior, ideal para o dia todo.',
    stock: 15,
    featured: false,
    createdAt: new Date()
  },
  {
    id: 6,
    name: 'Boné Snapback',
    slug: 'bone-snapback',
    price: 49.90,
    image: 'https://i.ibb.co/placeholder/snapback.jpg',
    category: 'acessorios',
    description: 'Boné snapback estiloso, regulagem perfeita.',
    stock: 25,
    featured: false,
    createdAt: new Date()
  },
];
