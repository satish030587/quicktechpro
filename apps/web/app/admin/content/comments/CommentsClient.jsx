"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { AdminAPI } from '../../../lib/adminApi';
import {
  Card,
  Button,
  LoadingSpinner,
  EmptyState,
  ConfirmDialog,
  Select,
  FormCheckbox,
} from '../../components/ui';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

function formatDateTime(value) {
  if (!value) return 'Unknown';
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return value;
  }
}

function getCommentAuthorName(comment) {
  return (
    comment?.author?.name ||
    comment?.authorName ||
    comment?.author?.email ||
    'Anonymous'
  );
}

function getReplyAuthorName(reply) {
  return (
    reply?.author?.name ||
    reply?.authorName ||
    reply?.author?.email ||
    'QuickTechPro Team'
  );
}

export default function CommentsClient() {
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [replyingId, setReplyingId] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [replyNotify, setReplyNotify] = useState(true);
  const [replySubmittingId, setReplySubmittingId] = useState(null);

  useEffect(() => {
    void loadComments(statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    setReplyingId(null);
    setReplyDraft('');
    setReplyNotify(true);
  }, [statusFilter, flaggedOnly]);

  async function loadComments(status) {
    try {
      setLoading(true);
      const response = await AdminAPI.contentComments(status);
      setComments(response.items || []);
    } catch (error) {
      console.error('Failed to load comments', error);
      toast.error('Unable to load comments');
    } finally {
      setLoading(false);
    }
  }

  async function handleModeration(id, nextStatus) {
    try {
      await AdminAPI.updateCommentStatus(id, nextStatus);
      toast.success(nextStatus === 'APPROVED' ? 'Comment approved' : 'Comment rejected');
      await loadComments(statusFilter);
    } catch (error) {
      console.error('Failed to update comment status', error);
      toast.error(error?.message || 'Unable to update comment');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await AdminAPI.deleteComment(deleteTarget.id);
      toast.success('Comment deleted');
      setDeleteTarget(null);
      await loadComments(statusFilter);
    } catch (error) {
      console.error('Failed to delete comment', error);
      toast.error(error?.message || 'Unable to delete comment');
    }
  }

  const handleReplyToggle = (comment) => {
    if (replyingId === comment.id) {
      setReplyingId(null);
      setReplyDraft('');
      setReplyNotify(true);
      return;
    }
    setReplyingId(comment.id);
    setReplyDraft('');
    setReplyNotify(Boolean(comment.authorEmail));
  };

  async function handleSubmitReply(comment) {
    const content = replyDraft.trim();
    if (!content) {
      toast.error('Reply cannot be empty');
      return;
    }

    const shouldNotify = replyNotify && Boolean(comment.authorEmail);

    try {
      setReplySubmittingId(comment.id);
      await AdminAPI.replyToComment(comment.id, {
        content,
        notifyAuthor: shouldNotify,
      });
      toast.success(shouldNotify ? 'Reply sent to commenter' : 'Reply posted');
      setReplyingId(null);
      setReplyDraft('');
      setReplyNotify(true);
      await loadComments(statusFilter);
    } catch (error) {
      console.error('Failed to send reply', error);
      toast.error(error?.message || 'Unable to send reply');
    } finally {
      setReplySubmittingId(null);
    }
  }

  const pendingCount = useMemo(
    () => comments.filter((comment) => comment.status === 'PENDING').length,
    [comments]
  );

  const flaggedCount = useMemo(
    () => comments.filter((comment) => comment.autoFlagged).length,
    [comments]
  );

  const visibleComments = useMemo(
    () => (flaggedOnly ? comments.filter((comment) => comment.autoFlagged) : comments),
    [comments, flaggedOnly]
  );

  const visibleCount = visibleComments.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Blog comments</h1>
          <p className="text-sm text-gray-500">Review reader feedback before it goes live on the site.</p>
        </div>
        <Link href="/admin/content" className="text-sm text-blue-600 hover:text-blue-700">
          Back to moderation
        </Link>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            label="Filter by status"
            className="w-48"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={STATUS_OPTIONS}
            placeholder={null}
          />
          <Button
            size="sm"
            variant={flaggedOnly ? 'warning' : 'secondary'}
            onClick={() => setFlaggedOnly((prev) => !prev)}
          >
            {flaggedOnly ? 'Showing auto-flagged' : 'Auto-flagged only'}
            {flaggedCount ? ` (${flaggedCount})` : ''}
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {visibleCount} comment{visibleCount === 1 ? '' : 's'}
          {statusFilter === 'PENDING' && pendingCount ? ` - ${pendingCount} awaiting action` : ''}
          {flaggedCount ? ` - ${flaggedCount} auto-flagged` : ''}
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : visibleCount === 0 ? (
          <EmptyState
            title={flaggedOnly ? 'No auto-flagged comments' : 'No comments found'}
            description={flaggedOnly
              ? 'No comments were automatically flagged for this filter.'
              : 'Fresh feedback will appear here as readers contribute to your articles.'
            }
          />
        ) : (
          <ul className="space-y-4">
            {visibleComments.map((comment) => (
              <li key={comment.id} className="rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium text-gray-800">
                        {getCommentAuthorName(comment)}
                      </span>
                      <span aria-hidden="true" className="text-gray-300">|</span>
                      <span>{formatDateTime(comment.createdAt)}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs uppercase tracking-wide text-gray-600">
                        {comment.status}
                      </span>
                      {comment.autoFlagged ? (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
                          Auto flagged
                        </span>
                      ) : null}
                    </div>
                    <p className="whitespace-pre-line text-gray-700">{comment.content}</p>
                    {(comment.autoFlagged ||
                      (typeof comment.toxicityScore === 'number' && Number.isFinite(comment.toxicityScore)) ||
                      (typeof comment.spamScore === 'number' && Number.isFinite(comment.spamScore)) ||
                      (Array.isArray(comment.moderationTags) && comment.moderationTags.length > 0) ||
                      Boolean(comment.languageCode)) && (
                      <div
                        className={`rounded-md border p-3 text-xs ${
                          comment.autoFlagged
                            ? 'border-amber-200 bg-amber-50 text-amber-800'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        <div className="flex flex-wrap gap-3">
                          {comment.languageCode ? (
                            <span>
                              Language: <span className="font-semibold uppercase">{comment.languageCode}</span>
                            </span>
                          ) : null}
                          {typeof comment.toxicityScore === 'number' && Number.isFinite(comment.toxicityScore) ? (
                            <span>Toxicity: {(comment.toxicityScore * 100).toFixed(0)}%</span>
                          ) : null}
                          {typeof comment.spamScore === 'number' && Number.isFinite(comment.spamScore) ? (
                            <span>Spam: {(comment.spamScore * 100).toFixed(0)}%</span>
                          ) : null}
                        </div>
                        {Array.isArray(comment.moderationTags) && comment.moderationTags.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {comment.moderationTags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )}
                    {comment.post ? (
                      <Link
                        href={`/blog/${comment.post.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                        target="_blank"
                      >
                        View post: {comment.post.title}
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : null}
                    {Array.isArray(comment.replies) && comment.replies.length > 0 ? (
                      <div className="mt-4 space-y-3 border-l border-gray-200 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">{getReplyAuthorName(reply)}</span>
                              <span aria-hidden="true" className="text-gray-300">|</span>
                              <span>{formatDateTime(reply.createdAt)}</span>
                            </div>
                            <p className="whitespace-pre-line">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {replyingId === comment.id ? (
                      <div className="mt-4 space-y-3 rounded-md border border-blue-100 bg-blue-50 p-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700" htmlFor={`reply-${comment.id}`}>
                            Reply to {getCommentAuthorName(comment)}
                          </label>
                          <textarea
                            id={`reply-${comment.id}`}
                            rows={4}
                            value={replyDraft}
                            onChange={(event) => setReplyDraft(event.target.value)}
                            className="mt-1 w-full rounded-md border border-blue-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                            placeholder="Share an update or helpful suggestion..."
                          />
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <FormCheckbox
                            label="Email this reply to the commenter"
                            checked={replyNotify && Boolean(comment.authorEmail)}
                            onChange={(event) => setReplyNotify(event.target.checked)}
                            disabled={!comment.authorEmail}
                            description={comment.authorEmail
                              ? `Send notification to ${comment.authorEmail}`
                              : 'No email on record for this commenter.'}
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleSubmitReply(comment)}
                              disabled={replySubmittingId === comment.id}
                            >
                              {replySubmittingId === comment.id ? 'Sending...' : 'Send reply'}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleReplyToggle(comment)}
                              disabled={replySubmittingId === comment.id}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2 md:items-start">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleReplyToggle(comment)}
                      disabled={replySubmittingId === comment.id}
                    >
                      {replyingId === comment.id ? 'Close reply' : 'Reply'}
                    </Button>
                    {comment.status !== 'APPROVED' ? (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleModeration(comment.id, 'APPROVED')}
                      >
                        Approve
                      </Button>
                    ) : null}
                    {comment.status !== 'REJECTED' ? (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleModeration(comment.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteTarget(comment)}
                      disabled={replySubmittingId === comment.id}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete comment"
        message="This action permanently removes the comment."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

