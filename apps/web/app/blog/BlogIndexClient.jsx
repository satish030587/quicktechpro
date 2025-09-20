"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BlogNewsletterSignup from "./BlogNewsletterSignup";

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
  } catch (error) {
    return "";
  }
};

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

const getLanguageLabel = (code) => {
  if (!code) return "Original";
  const normalised = code.toLowerCase();
  return LANGUAGE_LABELS[normalised] || normalised.toUpperCase();
};

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;
  let start = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
  let end = start + maxButtons - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - maxButtons + 1, 1);
  }
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    pages.push(pageNumber);
  }

  return (
    <nav className="flex items-center justify-between gap-3 text-sm text-gray-600" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`inline-flex items-center rounded-md border px-3 py-1 transition-colors ${
          currentPage === 1
            ? "cursor-not-allowed border-gray-200 text-gray-300"
            : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
        }`}
      >
        Previous
      </button>

      <div className="flex items-center gap-2">
        {start > 1 && <span className="px-2" aria-hidden="true">...</span>}
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === currentPage ? "page" : undefined}
            className={`inline-flex items-center rounded-md border px-3 py-1 text-sm transition-colors ${
              pageNumber === currentPage
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        {end < totalPages && <span className="px-2" aria-hidden="true">...</span>}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`inline-flex items-center rounded-md border px-3 py-1 transition-colors ${
          currentPage === totalPages
            ? "cursor-not-allowed border-gray-200 text-gray-300"
            : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
        }`}
      >
        Next
      </button>
    </nav>
  );
}

export default function BlogIndexClient({ posts, categories = [], tags = [], languages = [], pagination, filters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSearchValue(filters.search ?? "");
  }, [filters.search]);

  const categoryOptions = useMemo(() => ["all", ...categories.filter(Boolean)], [categories]);
  const languageOptions = useMemo(() => languages.filter(Boolean), [languages]);
  const activeCategory = filters.category || "all";
  const activeTag = filters.tag || "";
  const activeLanguage = filters.language || "";

  const updateQuery = (updates, { resetPage = true } = {}) => {
    const currentQuery = searchParams.toString();
    const params = new URLSearchParams(currentQuery);

    if (updates.search !== undefined) {
      if (updates.search) {
        params.set("q", updates.search);
      } else {
        params.delete("q");
      }
    }

    if (updates.category !== undefined) {
      if (updates.category) {
        params.set("category", updates.category);
      } else {
        params.delete("category");
      }
    }

    if (updates.tag !== undefined) {
      if (updates.tag) {
        params.set("tag", updates.tag);
      } else {
        params.delete("tag");
      }
    }

    if (updates.language !== undefined) {
      if (updates.language) {
        params.set("lang", updates.language);
      } else {
        params.delete("lang");
      }
    }

    if (updates.page !== undefined) {
      params.set("page", String(updates.page));
    }

    if (resetPage) {
      params.delete("page");
    }

    const query = params.toString();
    if (query === currentQuery) {
      return;
    }
    startTransition(() => {
      router.push(query ? `/blog?${query}` : "/blog", { scroll: true });
    });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateQuery({ search: searchValue.trim() }, { resetPage: true });
  };

  const handleCategoryClick = (category) => {
    if (category === "all") {
      updateQuery({ category: "" }, { resetPage: true });
    } else {
      updateQuery({ category }, { resetPage: true });
    }
  };

  const handleTagClick = (tag) => {
    const nextTag = activeTag === tag ? "" : tag;
    updateQuery({ tag: nextTag }, { resetPage: true });
  };

  const handleLanguageChange = (language) => {
    if (language === activeLanguage) return;
    updateQuery({ language }, { resetPage: true });
  };

  const handlePageChange = (nextPage) => {
    const pageNumber = Math.min(Math.max(nextPage, 1), pagination.totalPages);
    if (pageNumber === pagination.page) return;
    updateQuery({ page: pageNumber }, { resetPage: false });
  };

  const buildPostHref = (slug) => (activeLanguage ? `/blog/${slug}?lang=${activeLanguage}` : `/blog/${slug}`);

  const startIndex = posts.length === 0 ? 0 : (pagination.page - 1) * pagination.take + 1;
  const endIndex = posts.length === 0 ? 0 : startIndex + posts.length - 1;

  return (
    <div className="space-y-8" aria-busy={isPending} aria-live="polite">
      <form onSubmit={handleSearchSubmit} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
        <div>
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <div className="flex gap-3">
            <input
              id="blog-search"
              placeholder="Search articles"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All" : category}
            </button>
          ))}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`rounded-full border px-3 py-1 transition-colors ${
                  activeTag === tag
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {languageOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500">Language:</span>
            <button
              type="button"
              onClick={() => handleLanguageChange("")}
              className={`rounded-full border px-3 py-1 transition-colors ${
                activeLanguage === ""
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              Original
            </button>
            {languageOptions.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => handleLanguageChange(language)}
                className={`rounded-full border px-3 py-1 transition-colors ${
                  activeLanguage === language
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                {getLanguageLabel(language)}
              </button>
            ))}
          </div>
        )}
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
        <span>
          {pagination.total > 0
            ? `Showing ${startIndex}-${endIndex} of ${pagination.total} posts`
            : "No posts found"}
        </span>
        <div className="flex items-center gap-3">
          {languageOptions.length > 0 && (
            <span className="text-gray-500">
              {activeLanguage ? `Viewing ${getLanguageLabel(activeLanguage)} articles` : "Viewing original language"}
            </span>
          )}
          {isPending && <span className="text-blue-600">Updating...</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg p-6 shadow-md border border-gray-200 transition-transform hover:shadow-lg flex flex-col"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
              {post.readingMinutes && <span>{post.readingMinutes} min read</span>}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
            <p className="text-gray-600 mb-4 flex-grow">{post.summary || post.excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(post.categories || []).map((category) => (
                <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  {category}
                </span>
              ))}
            </div>
            <Link
              href={buildPostHref(post.slug)}
              className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
            >
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      <BlogNewsletterSignup variant="inline" />
    </div>
  );
}
