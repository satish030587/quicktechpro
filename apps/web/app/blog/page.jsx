import Link from "next/link";
import BlogIndexClient from "./BlogIndexClient";
import { fetchPublishedPosts } from "../lib/contentApi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://quicktechpro.com";
const PAGE_SIZE = 10;

export const revalidate = 120;

export const metadata = {
  title: "Tech Blog | QuickTechPro",
  description: "Helpful guides, industry news, and expert insights from the QuickTechPro team.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Tech Blog | QuickTechPro",
    description: "Helpful guides, industry news, and expert insights from the QuickTechPro team.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Blog | QuickTechPro",
    description: "Helpful guides, industry news, and expert insights from the QuickTechPro team.",
  },
};

function pickFeaturedPosts(posts, desiredCount = 2) {
  const featured = posts.filter((post) => post.featured);
  const fallback = posts.filter((post) => !post.featured);
  const selections = [...featured];
  while (selections.length < desiredCount && fallback.length > 0) {
    selections.push(fallback.shift());
  }
  return selections.slice(0, desiredCount);
}

const heroPlaceholder = {
  title: "Protecting Your Business from Ransomware",
  excerpt: "Essential strategies to safeguard your company data from increasingly sophisticated ransomware attacks.",
  slug: "business-ransomware-protection",
  categories: ["Security"],
  coverImage: "",
  featured: true,
};

export default async function BlogIndexPage({ searchParams = {} }) {
  const page = Number.parseInt(searchParams.page ?? "1", 10) || 1;
  const search = typeof searchParams.q === "string" ? searchParams.q : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const tag = typeof searchParams.tag === "string" ? searchParams.tag : "";
  const requestedLanguage = typeof searchParams.lang === "string" ? searchParams.lang.toLowerCase() : "";

  const { items, total, totalPages, categories, tags, languages, language: activeLanguage } = await fetchPublishedPosts({
    page,
    take: PAGE_SIZE,
    search,
    category: category || undefined,
    tag: tag || undefined,
    language: requestedLanguage || undefined,
  });

  const languageForLinks = activeLanguage && activeLanguage !== "default" ? activeLanguage : "";

  const buildListHref = ({ category: nextCategory, tag: nextTag }) => {
    const params = new URLSearchParams();
    if (nextCategory) params.set("category", nextCategory);
    if (nextTag) params.set("tag", nextTag);
    if (languageForLinks) params.set("lang", languageForLinks);
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  const buildPostHref = (slug) => {
    if (!slug) return "/blog";
    return languageForLinks ? `/blog/${slug}?lang=${languageForLinks}` : `/blog/${slug}`;
  };

  const postsForClient = items.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    categories: post.categories || (post.category?.name ? [post.category.name] : []),
    tags: post.tags || [],
    publishedAt: post.publishedAt,
    readingMinutes: post.readingMinutes,
    coverImage: post.coverImage,
    featured: post.featured,
  }));

  const featuredPosts = pickFeaturedPosts(items);
  const heroCards = featuredPosts.length > 0 ? featuredPosts : items.length > 0 ? items : [heroPlaceholder];

  const filters = {
    search,
    category,
    tag,
    language: languageForLinks,
  };

  const pagination = {
    page,
    total,
    totalPages,
    take: PAGE_SIZE,
  };

  return (
    <>
      <section className="bg-white py-16 md:py-20">
        <div className="layout-container">
          <div className="text-center mx-auto max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tech Tips & Articles</h1>
            <p className="text-lg text-gray-600 mb-8">
              Helpful guides, industry news, and expert insights from our technicians and developers to keep you informed.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {heroCards.map((post, index) => (
              <article
                key={post.slug || `placeholder-${index}`}
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform hover:shadow-lg"
              >
                <div className="relative h-56 w-full">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title || "Blog post cover"}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={index > 0 ? "lazy" : "eager"}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-85 flex items-center justify-center">
                      <span className="text-white/80 text-sm">Featured image</span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {post.featured && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 font-medium rounded">Featured</span>
                    )}
                    {(post.categories || []).slice(0, 2).map((category) => (
                      <Link
                        key={category}
                        href={buildListHref({ category })}
                        className="px-2 py-1 bg-blue-100 text-blue-800 font-medium rounded hover:bg-blue-200"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                  {post.slug && (
                    <Link
                      href={buildPostHref(post.slug)}
                      className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
                    >
                      Read more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="layout-container space-y-12">
          <BlogIndexClient
            posts={postsForClient}
            categories={categories}
            tags={tags}
            languages={languages}
            pagination={pagination}
            filters={filters}
          />

          <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
            <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
              <div className="md:max-w-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Stay Updated</h3>
                <p className="text-gray-600">
                  Subscribe to our newsletter to receive the latest tech tips, tutorials, and industry insights directly in your inbox.
                </p>
              </div>
              <form action="/thank-you/newsletter" method="get" className="flex-shrink-0 w-full md:w-auto">
                <label htmlFor="newsletter" className="text-sm font-medium text-gray-700 mb-2 block">
                  Subscribe for new posts
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-medium rounded-md px-6 py-2 hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
