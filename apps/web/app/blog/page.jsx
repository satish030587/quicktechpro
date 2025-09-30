import Link from "next/link";
import BlogIndexClient from "./BlogIndexClient";
import { fetchPublishedPosts } from "../lib/contentApi";
import { CheckIcon, ChevronRightIcon } from "../components/Icons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://quicktechpro.com";
const PAGE_SIZE = 10;

const heroHighlights = [
  "Step-by-step tutorials from certified technicians",
  "Security and productivity tips for hybrid teams",
  "Hardware, software, and workflow recommendations",
];

const heroFallbackStats = [
  { label: "Published articles", value: "-" },
  { label: "Topics covered", value: "-" },
  { label: "Languages", value: "1" },
];

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
  } catch (error) {
    return "";
  }
};

const resolveCategories = (post) => {
  if (!post) return [];
  if (Array.isArray(post.categories) && post.categories.length > 0) return post.categories;
  if (post.category?.name) return [post.category.name];
  return [];
};

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
  const spotlightPosts = heroCards.slice(0, 3);

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

  const topCategories = Array.isArray(categories) ? categories.slice(0, 4) : [];
  const categoryCount = Array.isArray(categories) ? categories.length : 0;
  const languageCount = Array.isArray(languages) ? languages.length : 0;

  const blogStats = [
    { label: "Published articles", value: total > 0 ? total : "-" },
    { label: "Topics covered", value: categoryCount > 0 ? categoryCount : "-" },
    { label: "Languages", value: languageCount > 0 ? languageCount : "1" },
  ];

  const statsToDisplay = blogStats.some((stat) => stat.value !== "-") ? blogStats : heroFallbackStats;

  return (
    <>
      <section className="w-full bg-white py-20">
        <div className="layout-container grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)] lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-blue-700">
              Insights
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Stay ahead with QuickTech Pro articles
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Browse deep dives from our technicians and developers on keeping devices secure, productive, and ready for modern work.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
              {heroHighlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-1 h-5 w-5 flex-none text-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {topCategories.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {topCategories.map((name) => (
                  <Link
                    key={name}
                    href={buildListHref({ category: name })}
                    className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="#articles"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Browse articles
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-600"
              >
                Talk to a specialist
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {statsToDisplay.map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                  <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
                  <dd className="mt-2 text-2xl font-bold text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-6">
            {spotlightPosts.map((post, index) => {
              const categoriesForPost = resolveCategories(post);
              const metaParts = [];
              const publishedLabel = formatDate(post.publishedAt);
              if (publishedLabel) metaParts.push(publishedLabel);
              if (post.readingMinutes) metaParts.push(`${post.readingMinutes} min read`);
              const meta = metaParts.join(" - ");
              const excerpt = post.excerpt || post.summary || "";

              if (index === 0) {
                return (
                  <article
                    key={post.slug || post.title}
                    className="flex h-full flex-col justify-between rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-8 text-white shadow-lg"
                  >
                    <div className="flex flex-wrap gap-2">
                      {categoriesForPost.map((item) => (
                        <span key={item} className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-8 space-y-4">
                      <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">{post.title}</h2>
                      {excerpt && <p className="text-sm text-white/85">{excerpt}</p>}
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm">
                      {meta && <p className="text-white/80">{meta}</p>}
                      {post.slug && (
                        <Link
                          href={buildPostHref(post.slug)}
                          className="inline-flex items-center rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-white"
                        >
                          Read article
                          <ChevronRightIcon className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={post.slug || post.title}
                  className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="flex flex-wrap gap-2">
                    {categoriesForPost.map((item) => (
                      <span key={item} className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 md:text-xl">{post.title}</h3>
                    {excerpt && <p className="text-sm text-gray-600">{excerpt}</p>}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                    {meta && <p>{meta}</p>}
                    {post.slug && (
                      <Link
                        href={buildPostHref(post.slug)}
                        className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Read article
                        <ChevronRightIcon className="ml-1.5 h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="articles" className="w-full bg-gray-50 py-20">
        <div className="layout-container space-y-12">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
            <div className="mb-10 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Latest articles</h2>
              <p className="text-gray-600">
                Filter by topic, tags, or language to find the insights that matter most to your team.
              </p>
            </div>
            <BlogIndexClient
              posts={postsForClient}
              categories={categories}
              tags={tags}
              languages={languages}
              pagination={pagination}
              filters={filters}
            />
          </div>

          <div className="rounded-3xl border border-blue-400 bg-blue-600 p-10 text-white shadow-lg">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,2fr),auto] md:items-center">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">Need hands-on troubleshooting?</h3>
                <p className="text-blue-100">
                  Book a remote session or review our service playbooks to get personalised support from the QuickTech Pro team.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/book-service?type=remote"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-gray-100"
                >
                  Book support
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/services#remote-support"
                  className="inline-flex items-center justify-center rounded-full border border-white px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  View remote services
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

