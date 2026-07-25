// shared/models/mock-banners.ts
import { Banner } from './banner';

export const MOCK_BANNERS: Banner[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop',
    title: 'Coleção Verão 2026',
    subtitle: 'Até 50% de desconto',
    buttonText: 'Ver Ofertas',
    link: '/products'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    title: 'Lançamentos Exclusivos',
    subtitle: 'Novos produtos toda semana',
    buttonText: 'Conferir',
    link: '/products'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
    title: 'Frete Grátis',
    subtitle: 'Compras acima de R$ 199',
    buttonText: 'Aproveitar',
    link: '/products'
  }
];
