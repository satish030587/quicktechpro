const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const DEFAULT_REVALIDATE = 120;

function isSoftDeleted(post) {
  return Boolean(post?.deletedAt || post?.deleted || post?.isDeleted);
}

function isPublishable(post) {
  if (!post) return false;
  if (post.status && post.status !== 'PUBLISHED') return false;
  if (isSoftDeleted(post)) return false;
  if (post.publishedAt) {
    const publishedDate = new Date(post.publishedAt);
    if (Number.isNaN(publishedDate.getTime())) return false;
    if (publishedDate > new Date()) return false;
  }
  return true;
}

function normaliseTags(rawTags) {
  if (!Array.isArray(rawTags)) return [];
  return Array.from(
    new Set(
      rawTags
        .map((tag) => {
          if (!tag) return null;
          if (typeof tag === 'string') return tag.trim();
          if (typeof tag === 'object') {
            if (typeof tag.name === 'string') return tag.name.trim();
            if (typeof tag.label === 'string') return tag.label.trim();
          }
          return null;
        })
        .filter((value) => typeof value === 'string' && value.length > 0)
    )
  );
}

function normaliseCategories(rawCategories, primaryCategoryName) {
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  return Array.from(
    new Set(
      [
        ...categories.map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return typeof name === 'string' ? name.trim() : null;
        }),
        typeof primaryCategoryName === 'string' ? primaryCategoryName.trim() : null,
      ].filter((value) => typeof value === 'string' && value.length > 0)
    )
  );
}

function normalisePost(raw) {
  if (!raw) return null;
  const categoryName = raw.category?.name || raw.categoryName || null;
  const availableLanguages = Array.isArray(raw.availableLanguages)
    ? raw.availableLanguages
        .map((value) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
        .filter((value) => value)
    : Array.isArray(raw.translations)
    ? raw.translations
        .map((translation) => (translation?.language ? translation.language.trim().toLowerCase() : ''))
        .filter((value) => value)
    : [];
  const normalizedTranslations = Array.isArray(raw.translations)
    ? raw.translations.map((translation) => ({
        language: translation?.language || '',
        title: translation?.title || '',
        excerpt: translation?.excerpt || '',
        aiSummary: translation?.aiSummary || ''
      }))
    : [];

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt || '',
    coverImage: raw.coverImage || '',
    content: raw.content || '',
    category: raw.category || null,
    categoryId: raw.category?.id || raw.categoryId || null,
    categories: normaliseCategories(raw.categories, categoryName),
    tags: normaliseTags(raw.tags),
    featured: Boolean(raw.featured),
    allowComments: raw.allowComments !== false,
    comments: Array.isArray(raw.comments) ? raw.comments : [],
    readingMinutes: raw.readingMinutes || null,
    status: raw.status,
    publishedAt: raw.publishedAt || null,
    author: raw.author || null,
    aiSummary: raw.aiSummary || null,
    summary: raw.summary || raw.aiSummary || raw.excerpt || '',
    availableLanguages,
    translations: normalizedTranslations,
    activeLanguage: raw.activeLanguage || 'default',
    seoTitle: raw.seoTitle || raw.title,
    seoDescription: raw.seoDescription || raw.excerpt || '',
  };
}

async function fetchJson(path, { revalidate = DEFAULT_REVALIDATE, tags } = {}) {
  const response = await fetch(`${PUBLIC_API_URL}${path}` , {
    next: { revalidate, tags },
  });

  if (!response.ok) {
    const error = new Error(`Failed to fetch ${path} (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

function extractTotal(data, fallbackCount) {
  if (typeof data?.total === 'number') return data.total;
  if (typeof data?.totalCount === 'number') return data.totalCount;
  if (typeof data?.count === 'number') return data.count;
  if (typeof data?.meta?.total === 'number') return data.meta.total;
  if (typeof data?.meta?.totalItems === 'number') return data.meta.totalItems;
  if (typeof data?.meta?.count === 'number') return data.meta.count;
  if (typeof data?.meta?.pagination?.total === 'number') return data.meta.pagination.total;
  if (typeof data?.pagination?.total === 'number') return data.pagination.total;
  if (typeof data?.pagination?.totalItems === 'number') return data.pagination.totalItems;
  return fallbackCount;
}

export async function fetchPublishedPosts({ page = 1, take = 10, tag, category, search, language } = {}) {
  const safeTake = Math.max(Number.parseInt(take, 10) || 10, 1);
  const pageNumber = Math.max(Number.parseInt(page, 10) || 1, 1);
  const trimmedTag = typeof tag === 'string' ? tag.trim() : '';
  const trimmedCategory = typeof category === 'string' ? category.trim() : '';
  const trimmedSearch = typeof search === 'string' ? search.trim() : '';
  const trimmedLanguage = typeof language === 'string' ? language.trim().toLowerCase() : '';

  const params = new URLSearchParams();
  params.set('status', 'PUBLISHED');
  params.set('take', String(safeTake));
  params.set('skip', String((pageNumber - 1) * safeTake));
  params.set('includeTotal', 'true');
  params.set('withMeta', 'true');
  if (trimmedTag) params.set('tag', trimmedTag);
  if (trimmedCategory) params.set('category', trimmedCategory);
  if (trimmedSearch) params.set('search', trimmedSearch);
  if (trimmedLanguage) params.set('lang', trimmedLanguage);

  const data = await fetchJson(`/blog/posts?${params.toString()}`);
  const rawItems = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
    ? data.data
    : [];

  const filtered = rawItems.filter(isPublishable).map(normalisePost);
  const total = extractTotal(data, filtered.length);

  const categoriesSet = new Set();
  const tagsSet = new Set();
  const languagesSet = new Set();
  filtered.forEach((post) => {
    (post.categories || []).forEach((value) => {
      if (value) categoriesSet.add(value);
    });
    (post.tags || []).forEach((value) => {
      if (value) tagsSet.add(value);
    });
    (post.availableLanguages || []).forEach((languageCode) => {
      if (languageCode) languagesSet.add(languageCode);
    });
  });

  filtered.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  });

  const categoriesList = Array.from(categoriesSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  const tagsList = Array.from(tagsSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  const languagesList = Array.from(languagesSet).sort((a, b) => a.localeCompare(b));
  const totalPages = Math.max(1, Math.ceil(total / safeTake));
  const activeLanguage = typeof data?.language === 'string' ? data.language.trim().toLowerCase() : trimmedLanguage;

  return {
    items: filtered,
    total,
    totalPages,
    page: pageNumber,
    take: safeTake,
    categories: categoriesList,
    tags: tagsList,
    language: activeLanguage || '',
    languages: languagesList,
  };
}

export async function fetchPublishedPost(slug, { language } = {}) {
  if (!slug) return null;
  try {
    const trimmedLanguage = typeof language === 'string' ? language.trim().toLowerCase() : '';
    const url = trimmedLanguage
      ? `/blog/posts/${slug}?lang=${encodeURIComponent(trimmedLanguage)}`
      : `/blog/posts/${slug}`;
    const data = await fetchJson(url);
    const post = data?.post || data;
    if (!isPublishable(post)) {
      return null;
    }
    return normalisePost(post);
  } catch (error) {
    if (error.status === 404) return null;
    console.error('Failed to fetch post', error);
    return null;
  }
}

export async function fetchRelatedPosts({ categoryId, categoryName, excludeSlug, take = 3, language } = {}) {
  try {
    const safeTake = Math.max(Number.parseInt(take, 10) || 3, 1);
    const trimmedCategoryName = typeof categoryName === 'string' ? categoryName.trim() : '';
    const trimmedLanguage = typeof language === 'string' ? language.trim().toLowerCase() : '';
    const params = new URLSearchParams();
    params.set('status', 'PUBLISHED');
    params.set('take', String(Math.max(safeTake * 2, safeTake)));
    params.set('includeTotal', 'false');
    params.set('withMeta', 'false');
    if (categoryId) {
      params.set('categoryId', String(categoryId));
    } else if (trimmedCategoryName) {
      params.set('category', trimmedCategoryName);
    }
    if (trimmedLanguage) {
      params.set('lang', trimmedLanguage);
    }
    const data = await fetchJson(`/blog/posts?${params.toString()}`, { revalidate: DEFAULT_REVALIDATE });
    const rawItems = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
      ? data.data
      : [];
    const filtered = rawItems
      .filter(isPublishable)
      .filter((post) => !excludeSlug || post.slug !== excludeSlug)
      .map(normalisePost);

    const normalizedCategory = trimmedCategoryName.toLowerCase();
    const byCategory = normalizedCategory
      ? filtered.filter((post) => (post.categories || []).some((value) => value?.toLowerCase() === normalizedCategory))
      : filtered;

    const unique = [];
    const seen = new Set();
    byCategory.forEach((post) => {
      if (!post.slug || seen.has(post.slug)) return;
      seen.add(post.slug);
      unique.push(post);
    });

    unique.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    return unique.slice(0, safeTake);
  } catch (error) {
    console.error('Failed to fetch related posts', error);
    return [];
  }
}
export async function fetchAllPublishedPostSlugs() {
  const posts = new Map();
  const take = 50;
  let page = 1;
  let totalPages = 1;

  do {
    const { items, totalPages: nextTotalPages } = await fetchPublishedPosts({ page, take });
    items.forEach((post) => {
      if (!post.slug) return;
      const publishedAt = post.publishedAt ? new Date(post.publishedAt).toISOString() : null;
      const existing = posts.get(post.slug);
      if (!existing) {
        posts.set(post.slug, { slug: post.slug, publishedAt });
        return;
      }
      if (publishedAt && (!existing.publishedAt || publishedAt > existing.publishedAt)) {
        posts.set(post.slug, { slug: post.slug, publishedAt });
      }
    });
    totalPages = nextTotalPages;
    page += 1;
  } while (page <= totalPages);

  return Array.from(posts.values());
}


