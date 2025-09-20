import { notFound } from "next/navigation";
import Link from "next/link";
import BlogComments from "../BlogComments";
import BlogAnalyticsTracker from "../BlogAnalyticsTracker";
import BlogNewsletterSignup from "../BlogNewsletterSignup";
import BlogLanguageSwitcher from "../BlogLanguageSwitcher";
import { fetchPublishedPost, fetchRelatedPosts } from "../../lib/contentApi";

export const revalidate = 120;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://quicktechpro.com";

const LANGUAGE_LABELS = {
  en: "English",
  es: "Spanish",
  hi: "Hindi",
  de: "German",
  pt: "Portuguese",
  fr: "French",
  ru: "Russian",
  it: "Italian",
  ja: "Japanese",
  zh: "Chinese",
};

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

const getLanguageLabel = (code) => {
  if (!code || code === "default") return "Original";
  const normalised = code.toLowerCase();
  return LANGUAGE_LABELS[normalised] || normalised.toUpperCase();
};

export async function generateMetadata({ params }) {
  const post = await fetchPublishedPost(params.slug);
  if (!post) {
    return { title: "Blog Post | QuickTechPro" };
  }

  const description = post.seoDescription || post.summary || post.excerpt || post.content?.slice(0, 155) || "";
  const title = post.seoTitle || post.title;
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  const languageAlternates = Array.isArray(post.availableLanguages)
    ? post.availableLanguages.reduce((acc, language) => {
        if (!language) return acc;
        acc[language] = `${canonicalUrl}?lang=${language}`;
        return acc;
      }, {})
    : undefined;

  return {
    title: `${post.title} | QuickTechPro Blog`,
    description,
    alternates: {
      canonical: canonicalUrl,
      ...(languageAlternates && Object.keys(languageAlternates).length ? { languages: languageAlternates } : {}),
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.publishedAt || undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title || undefined }] : undefined,
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params, searchParams = {} }) {
  const languageParam = typeof searchParams.lang === "string" ? searchParams.lang.toLowerCase() : "";
  const post = await fetchPublishedPost(params.slug, { language: languageParam || undefined });
  if (!post) notFound();

  const activeLanguage = post.activeLanguage || "default";
  const languageForLinks = activeLanguage !== "default" ? activeLanguage : "";
  const shareUrl = languageForLinks ? `${SITE_URL}/blog/${post.slug}?lang=${languageForLinks}` : `${SITE_URL}/blog/${post.slug}`;
  const authorName = post.author?.name || post.author?.email || "QuickTechPro Team";
  const metaItems = [
    authorName,
    post.publishedAt ? formatDate(post.publishedAt) : null,
    post.readingMinutes ? `${post.readingMinutes} min read` : null,
  ].filter(Boolean);
  const heroCategories = (post.categories || []).slice(0, 2);
  const heroTags = (post.tags || []).slice(0, 2);
  const contentParagraphs = post.content
    ? post.content
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];

  const summaryParagraphs = post.aiSummary
    ? post.aiSummary.split(/\n+/).map((entry) => entry.trim()).filter(Boolean)
    : [];

  const buildListHref = ({ category, tag }) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (languageForLinks) params.set("lang", languageForLinks);
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  const buildPostHref = (slug) => (languageForLinks ? `/blog/${slug}?lang=${languageForLinks}` : `/blog/${slug}`);

  const primaryCategory = heroCategories[0] || post.category?.name || "";
  const relatedPosts = await fetchRelatedPosts({
    categoryId: post.categoryId || post.category?.id,
    categoryName: primaryCategory,
    excludeSlug: post.slug,
    take: 3,
    language: languageForLinks || undefined,
  });

  return (
    <article className="bg-white">
      <BlogAnalyticsTracker slug={post.slug} source={languageForLinks ? `lang:${languageForLinks}` : undefined} />
      <section className="relative h-[320px] w-full bg-gray-900">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title || "Blog post cover"}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative z-10">
          <div className="layout-container flex h-full flex-col justify-end pb-12 text-white">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-sm text-blue-100">
                {heroCategories.map((category) => (
                  <Link
                    key={category}
                    href={buildListHref({ category })}
                    className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-white/30"
                  >
                    {category}
                  </Link>
                ))}
                {heroTags.map((tag) => (
                  <Link
                    key={tag}
                    href={buildListHref({ tag })}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <h1 className="mt-6 text-4xl font-bold leading-tight drop-shadow-md md:text-5xl">{post.title}</h1>
              {metaItems.length > 0 && (
                <div className="mt-4 text-sm text-blue-100">
                  {metaItems.join(" | ")}
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-blue-100">
                <BlogLanguageSwitcher
                  slug={post.slug}
                  availableLanguages={post.availableLanguages || []}
                  activeLanguage={activeLanguage}
                />
                {languageForLinks && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-semibold uppercase tracking-wide">
                    {getLanguageLabel(activeLanguage)} translation
                  </span>
                )}
              </div>
              {post.summary ? (
                <p className="mt-6 max-w-2xl text-lg text-blue-100/90">{post.summary}</p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="layout-container">
          <div className="max-w-4xl space-y-12">
            {summaryParagraphs.length > 0 && (
              <aside className="rounded-xl border border-blue-100 bg-blue-50/70 p-6">
                <h2 className="text-lg font-semibold text-blue-900">Quick summary</h2>
                <ul className="mt-3 space-y-2 text-sm text-blue-900">
                  {summaryParagraphs.map((sentence, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
                      <span>{sentence}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="prose prose-lg max-w-none text-gray-800">
              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>Post content will appear here soon.</p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Share this insight</h2>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share ${post.title} on LinkedIn`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 hover:border-blue-500 hover:text-blue-600"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share ${post.title} on X (Twitter)`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 hover:border-blue-500 hover:text-blue-600"
                >
                  X (Twitter)
                </a>
                <Link
                  href="/contact"
                  aria-label="Request a follow-up from QuickTechPro"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 hover:border-blue-500 hover:text-blue-600"
                >
                  Request follow-up
                </Link>
              </div>
            </div>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-3 text-sm text-blue-600">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={buildListHref({ tag })}
                    className="rounded-full bg-blue-50 px-4 py-1 hover:bg-blue-100"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Related articles</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={buildPostHref(related.slug)}
                      className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <h3 className="mb-2 text-sm font-semibold text-gray-900 md:text-base">{related.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-3">{related.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <BlogNewsletterSignup className="mt-12" />
            <BlogComments slug={post.slug} initialComments={post.comments || []} allowComments={post.allowComments} />
          </div>
        </div>
      </section>
    </article>
  );
}
