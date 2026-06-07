import { MetadataRoute } from 'next';
import { productData } from '@/lib/productData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aerisnacks.com';

  const staticRoutes = [
    '',
    '/products',
    '/brand',
    '/mission',
    '/ou-nous-trouver',
    '/contact',
    '/espace-pro'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const productRoutes = Object.keys(productData).map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
