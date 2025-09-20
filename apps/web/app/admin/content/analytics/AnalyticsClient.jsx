"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminAPI } from '../../../lib/adminApi';
import {
  Card,
  Button,
  LoadingSpinner,
  EmptyState,
  PageHeader,
  Select
} from '../../components/ui';

const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' }
];

function formatNumber(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-IN').format(Math.round(safe));
}

function formatSeconds(value) {
  const safe = Number.isFinite(value) ? Math.max(value, 0) : 0;
  if (safe <= 1) return `${Math.round(safe)}s`;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.round(safe % 60);
  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

function formatDateLabel(value) {
  try {
    return new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  } catch {
    return value;
  }
}

function SummaryStat({ label, value, helper }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {helper ? <p className="mt-1 text-xs text-gray-500">{helper}</p> : null}
    </div>
  );
}

function SourceRow({ source, count, total }) {
  const share = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
      <span className="font-medium text-gray-700">{source}</span>
      <span className="text-gray-600">{formatNumber(count)} - {share}%</span>
    </div>
  );
}

export default function AnalyticsClient() {
  const [range, setRange] = useState('30');
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postMetrics, setPostMetrics] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(null);

  useEffect(() => {
    void loadOverview(range);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  async function loadOverview(daysValue) {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminAPI.contentAnalyticsOverview({ days: Number(daysValue) });
      setOverview(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostSelect(post) {
    if (!post) return;
    setSelectedPost(post);
    setPostMetrics(null);
    setPostError(null);
    setPostLoading(true);
    try {
      const metrics = await AdminAPI.contentPostMetrics(post.postId || post.id, { days: Number(range) });
      setPostMetrics(metrics);
    } catch (err) {
      setPostError(err);
    } finally {
      setPostLoading(false);
    }
  }

  function clearSelection() {
    setSelectedPost(null);
    setPostMetrics(null);
    setPostError(null);
  }

  const sourceTotals = useMemo(() => {
    if (!overview?.summary?.sources) return [];
    return Array.isArray(overview.summary.sources)
      ? overview.summary.sources
      : Object.entries(overview.summary.sources).map(([source, count]) => ({ source, count }));
  }, [overview]);

  const trend = overview?.trend || [];
  const totalSourceViews = sourceTotals.reduce((sum, entry) => sum + (entry.count ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog analytics"
        description="Track readership trends and engagement for QuickTechPro articles."
      />

      <div className="flex justify-end">
        <Link href="/admin/content" className="text-sm text-blue-600 hover:text-blue-700">
          Back to content operations
        </Link>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Select
            label="Date range"
            className="w-48"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            options={RANGE_OPTIONS}
            placeholder={null}
          />
          <div className="text-sm text-gray-500">
            Data refreshed for the last {range} day{range === '1' ? '' : 's'}
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="space-y-3 p-6">
            <p className="text-sm text-red-600">Unable to load analytics overview.</p>
            <Button variant="primary" size="sm" onClick={() => loadOverview(range)}>
              Retry
            </Button>
          </div>
        </Card>
      ) : !overview ? (
        <EmptyState
          title="No analytics available"
          description="Publish blog posts to begin capturing readership metrics."
        />
      ) : (
        <>
          <Card title="Engagement summary">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryStat
                label="Total views"
                value={formatNumber(overview.summary.totalViews)}
                helper={`${overview.totalPostsTracked || 0} posts tracked`}
              />
              <SummaryStat
                label="Unique visitors"
                value={formatNumber(overview.summary.uniqueVisitors)}
              />
              <SummaryStat
                label="Average read time"
                value={formatSeconds(overview.summary.avgReadSeconds || 0)}
              />
              <SummaryStat
                label="Average views per post"
                value={formatNumber(overview.summary.averageViewsPerPost || 0)}
              />
            </div>
          </Card>

          <Card title="Traffic sources">
            {sourceTotals.length === 0 ? (
              <p className="text-sm text-gray-500">No source data recorded for this range.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {sourceTotals.map((entry) => (
                  <SourceRow
                    key={entry.source}
                    source={entry.source}
                    count={entry.count ?? 0}
                    total={totalSourceViews}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card title="Daily trend">
            {trend.length === 0 ? (
              <p className="text-sm text-gray-500">No recorded activity in this range.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Views</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Unique visitors</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Avg. read time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {trend.map((entry) => (
                      <tr key={entry.date}>
                        <td className="px-4 py-2 text-gray-700">{formatDateLabel(entry.date)}</td>
                        <td className="px-4 py-2 text-gray-900">{formatNumber(entry.viewCount)}</td>
                        <td className="px-4 py-2 text-gray-900">{formatNumber(entry.uniqueVisitors)}</td>
                        <td className="px-4 py-2 text-gray-600">{formatSeconds(entry.avgReadSeconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Top posts">
            {overview.topPosts.length === 0 ? (
              <EmptyState
                title="No posts yet"
                description="Publish your first blog post to start generating analytics data."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Post</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Views</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Unique</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Avg. read</th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {overview.topPosts.map((post) => (
                      <tr key={post.postId}>
                        <td className="px-4 py-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{post.title}</span>
                            <span className="text-xs text-gray-500">/{post.slug}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-900">{formatNumber(post.viewCount)}</td>
                        <td className="px-4 py-2 text-gray-900">{formatNumber(post.uniqueVisitors)}</td>
                        <td className="px-4 py-2 text-gray-600">{formatSeconds(post.avgReadSeconds)}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="text-xs text-blue-600 hover:text-blue-700"
                            >
                              View article
                            </Link>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handlePostSelect(post)}
                            >
                              View insights
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {selectedPost ? (
            <Card title={`Post insights - ${selectedPost.title}`}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-gray-500">
                  Last activity {formatDateLabel(selectedPost.lastActivityAt)} | Slug /{selectedPost.slug}
                </div>
                <Button size="sm" variant="secondary" onClick={clearSelection}>
                  Clear selection
                </Button>
              </div>

              {postLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : postError ? (
                <div className="space-y-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p>Unable to load detailed metrics for this post.</p>
                  <Button size="sm" variant="primary" onClick={() => handlePostSelect(selectedPost)}>
                    Retry
                  </Button>
                </div>
              ) : !postMetrics ? (
                <p className="text-sm text-gray-500">Select a post to inspect detailed metrics.</p>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryStat label="Views" value={formatNumber(postMetrics.totals.views)} />
                    <SummaryStat label="Unique visitors" value={formatNumber(postMetrics.totals.uniqueVisitors)} />
                    <SummaryStat
                      label="Average read time"
                      value={formatSeconds(postMetrics.totals.avgReadSeconds)}
                    />
                    <SummaryStat
                      label="Source diversity"
                      value={`${Object.keys(postMetrics.totals.sources || {}).length}`}
                      helper="Distinct traffic sources"
                    />
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">Traffic sources</h3>
                    {Object.keys(postMetrics.totals.sources || {}).length === 0 ? (
                      <p className="text-sm text-gray-500">No source data recorded.</p>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(postMetrics.totals.sources).map(([source, count]) => (
                          <SourceRow
                            key={source}
                            source={source}
                            count={count}
                            total={Object.values(postMetrics.totals.sources).reduce((sum, value) => sum + value, 0)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">Daily breakdown</h3>
                    {postMetrics.trend.length === 0 ? (
                      <p className="text-sm text-gray-500">No activity in the selected range.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-600">Views</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-600">Unique</th>
                              <th className="px-4 py-2 text-left font-medium text-gray-600">Avg. read</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {postMetrics.trend.map((entry) => (
                              <tr key={entry.date}>
                                <td className="px-4 py-2 text-gray-700">{formatDateLabel(entry.date)}</td>
                                <td className="px-4 py-2 text-gray-900">{formatNumber(entry.viewCount)}</td>
                                <td className="px-4 py-2 text-gray-900">{formatNumber(entry.uniqueVisitors)}</td>
                                <td className="px-4 py-2 text-gray-600">{formatSeconds(entry.avgReadSeconds)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
