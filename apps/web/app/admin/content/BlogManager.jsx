"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AdminAPI } from '../../lib/adminApi';
import {
  Card,
  Button,
  StatusBadge,
  LoadingSpinner,
  EmptyState,
  Pagination,
  FormCheckbox,
} from '../components/ui';

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING', label: 'Pending review' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const PAGE_SIZE = 10;

function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function getAuthorName(post) {
  if (!post) return '—';
  return post.author?.name || post.authorName || post.author?.email || 'Unassigned';
}

function isSoftDeleted(post) {
  if (!post) return false;
  return Boolean(post.deletedAt || post.deleted || post.isDeleted);
}

const LANGUAGE_LABELS = {
  en: 'English',
  es: 'Spanish',
  hi: 'Hindi',
  de: 'German',
  pt: 'Portuguese',
  fr: 'French',
  ru: 'Russian',
  it: 'Italian',
  ja: 'Japanese',
  zh: 'Chinese'
};

function getLanguageLabel(code) {
  if (!code) return 'Unknown';
  const normalized = code.toLowerCase();
  return LANGUAGE_LABELS[normalized] || normalized.toUpperCase();
}

export default function BlogManager() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [searchDraft, setSearchDraft] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionState, setActionState] = useState({ id: null, type: null });
  const [totalIsReliable, setTotalIsReliable] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        status: statusFilter || undefined,
        search: searchValue || undefined,
        includeDeleted: includeDeleted || undefined,
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        sort: 'publishedAt:desc',
      };
      const requestedPageSize = typeof payload.take === 'number' ? payload.take : PAGE_SIZE;

      const response = await AdminAPI.contentPosts(payload);
      const items = Array.isArray(response?.items)
        ? response.items
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setPosts(items);

      const totalCandidates = [
        response?.total,
        response?.totalCount,
        response?.count,
        response?.meta?.total,
        response?.meta?.totalItems,
        response?.meta?.count,
        response?.meta?.pagination?.total,
        response?.meta?.pagination?.totalItems,
        response?.pagination?.total,
        response?.pagination?.totalItems,
      ];

      const totalFromApi = totalCandidates.find((value) => typeof value === 'number');
      const totalItems = typeof totalFromApi === 'number' ? totalFromApi : items.length;

      setTotal(totalItems);
      const hasReliableTotal = typeof totalFromApi === 'number';
      setTotalIsReliable(hasReliableTotal);
      if (!hasReliableTotal && items.length >= requestedPageSize) {
        console.warn('AdminAPI.contentPosts did not return a total count. Pagination may be inaccurate.', { filters: payload });
      }
    } catch (err) {
      console.error('Failed to load blog posts', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [includeDeleted, page, searchValue, statusFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, total]);

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleIncludeDeletedChange = (event) => {
    setIncludeDeleted(event.target.checked);
    setPage(1);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchValue(searchDraft.trim());
    setPage(1);
  };

  const handleSearchClear = () => {
    setSearchDraft('');
    if (searchValue) {
      setSearchValue('');
      setPage(1);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setIncludeDeleted(false);
    setSearchDraft('');
    setSearchValue('');
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;
    setPage(nextPage);
  };

  const handleStatusUpdate = async (id, nextStatus, successMessage) => {
    setActionState({ id, type: nextStatus });
    try {
      await AdminAPI.contentPostStatus(id, nextStatus);
      toast.success(successMessage);
      await loadPosts();
    } catch (err) {
      console.error(`Failed to set status to ${nextStatus}`, err);
      toast.error('Unable to update post status. Please try again.');
    } finally {
      setActionState({ id: null, type: null });
    }
  };

  const handleRegenerateSummary = async (id) => {
    setActionState({ id, type: 'SUMMARY' });
    try {
      await AdminAPI.regeneratePostSummary(id);
      toast.success('Summary refreshed');
      await loadPosts();
    } catch (err) {
      console.error('Failed to refresh summary', err);
      toast.error('Unable to refresh summary');
    } finally {
      setActionState({ id: null, type: null });
    }
  };

  const handleCreate = () => {
    router.push('/admin/content/blog/new');
  };

const handleView = (id) => {
    if (!id) return;
    router.push(`/admin/content/blog/${id}`);
  };

  const handlePublish = (id) => handleStatusUpdate(id, 'PUBLISHED', 'Post published');
  const handleArchive = (id) => handleStatusUpdate(id, 'ARCHIVED', 'Post archived');
  const handleRestore = (id) => handleStatusUpdate(id, 'DRAFT', 'Post restored to draft');

  const totalPages = useMemo(() => {
    if (total <= 0) return 1;
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [total]);

  const from = posts.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = posts.length === 0 ? 0 : Math.min(total, (page - 1) * PAGE_SIZE + posts.length);

  const filtersApplied = Boolean(statusFilter) || Boolean(searchValue) || includeDeleted;

  return (
    <Card title="Blog posts" className="mb-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full flex-col gap-3 lg:flex-row lg:items-end lg:gap-4"
          >
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700" htmlFor="blog-search">
                Search posts
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  id="blog-search"
                  type="search"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                  placeholder="Search by title, slug, or tag"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Search
                </Button>
                {searchValue && (
                  <Button type="button" variant="link" size="sm" onClick={handleSearchClear}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <div className="w-full lg:w-48">
              <label className="text-sm font-medium text-gray-700" htmlFor="blog-status-filter">
                Status
              </label>
              <select
                id="blog-status-filter"
                value={statusFilter}
                onChange={handleStatusChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
          <div className="flex flex-col gap-3 lg:w-auto lg:items-end">
            <div className="flex items-center justify-between gap-3">
              <FormCheckbox
                label="Include soft deleted"
                checked={includeDeleted}
                onChange={handleIncludeDeletedChange}
                className="mb-0"
              />
              {filtersApplied && (
                <Button type="button" variant="link" size="sm" onClick={handleResetFilters}>
                  Reset filters
                </Button>
              )}
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="w-full lg:w-auto"
              onClick={handleCreate}
              icon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Create new post
            </Button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Unable to load posts right now. Please retry shortly.
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts found"
            description="Adjust your filters or create a new blog post to see it listed here."
            icon={
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 01-2-2h7l5 5v12a2 2 0 01-2 2zM14 3v4a1 1 0 001 1h4"
                />
              </svg>
            }
            action={
              <Button variant="primary" size="sm" onClick={handleCreate}>
                Create new post
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Published
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {posts.map((post) => {
                    const deleted = isSoftDeleted(post);
                    const highlightClass = deleted ? 'bg-red-50' : '';
                    const isPublishing = actionState.id === post.id && actionState.type === 'PUBLISHED';
                    const isArchiving = actionState.id === post.id && actionState.type === 'ARCHIVED';
                    const isRestoring = actionState.id === post.id && actionState.type === 'DRAFT';

                    return (
                      <tr key={post.id ?? post.slug} className={highlightClass}>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-gray-900">{post.title || 'Untitled post'}</span>
                              {post.featured && (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                  Featured
                                </span>
                              )}
                              {deleted && (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold uppercase text-red-700">
                                  Deleted
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">/blog/{post.slug || 'draft'}</div>
                            {post.aiSummary ? (
                              <p className="text-xs text-gray-600 line-clamp-2">{post.aiSummary}</p>
                            ) : null}
                            {Array.isArray(post.availableLanguages) && post.availableLanguages.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-1 text-[11px] uppercase text-gray-500">
                                {post.availableLanguages.map((language) => (
                                  <span key={language} className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                                    {getLanguageLabel(language)}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={post.status || 'UNKNOWN'} />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">{formatDateTime(post.publishedAt)}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{getAuthorName(post)}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleRegenerateSummary(post.id)}
                              disabled={actionState.id === post.id && actionState.type === 'SUMMARY'}
                            >
                              {actionState.id === post.id && actionState.type === 'SUMMARY' ? 'Refreshing...' : 'Refresh summary'}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleView(post.id)}
                              icon={
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              }
                            >
                              View
                            </Button>
                            {post.status !== 'PUBLISHED' && !deleted && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handlePublish(post.id)}
                                disabled={actionState.id === post.id}
                                icon={
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                }
                              >
                                {isPublishing ? 'Publishing...' : 'Publish'}
                              </Button>
                            )}
                            {!deleted && post.status !== 'ARCHIVED' && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleArchive(post.id)}
                                disabled={actionState.id === post.id}
                                icon={
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                }
                              >
                                {isArchiving ? 'Archiving...' : 'Archive'}
                              </Button>
                            )}
                            {(deleted || post.status === 'ARCHIVED') && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleRestore(post.id)}
                                disabled={actionState.id === post.id}
                              >
                                {isRestoring ? 'Restoring...' : 'Restore'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
              <div>
                Showing {from}-{to} of {total} posts
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            {!totalIsReliable && (
              <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.257 3.099c.765-1.36 2.721-1.36 3.486 0l6.518 11.587C19.021 15.994 18.099 17 16.776 17H3.224c-1.323 0-2.245-1.006-1.485-2.314L8.257 3.1z" />
                  <path d="M11 13a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.75a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" />
                </svg>
                <span>Totals not returned by the API; pagination reflects the current page only.</span>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}




