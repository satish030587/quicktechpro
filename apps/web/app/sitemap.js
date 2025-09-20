import { fetchAllPublishedPostSlugs } from './lib/contentApi';

const SITE_URL = 'https://www.quicktechpro.com';
const STATIC_ROUTES = [
  '/',
  '/services',
  '/pricing',
  '/about',
  '/contact',
  '/booking',
  '/faq',
  '/testimonials',
  '/blog',
  '/knowledge-base',
  '/service-areas',
  '/legal/terms',
  '/legal/privacy',
  '/legal/refund',
];

export default async function sitemap() {
  const now = new Date();
  const entries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '/blog' ? 'daily' : 'weekly',
    priority: route === '/' ? 1 : route === '/blog' ? 0.9 : 0.7,
  }));

  try {
    const posts = await fetchAllPublishedPostSlugs();
    posts.forEach(({ slug, publishedAt }) => {
      if (!slug) return;
      entries.push({
        url: `${SITE_URL}/blog/${slug}`,
        lastModified: publishedAt ? new Date(publishedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error('Failed to append blog posts to sitemap', error);
  }

  return entries;
}
