"use client";

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { BlogAPI } from '../lib/blogApi';
import { useAuth } from '../providers';

const formatDateTime = (value) => {
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch (error) {
    return value;
  }
};

export default function BlogComments({ slug, initialComments, allowComments }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [pendingComments, setPendingComments] = useState([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalCount = useMemo(() => comments.length + pendingComments.length, [comments.length, pendingComments.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.error('Log in to join the conversation.');
      return;
    }
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const response = await BlogAPI.submitComment(slug, content.trim());
      toast.success('Thanks! Your comment is awaiting moderation.');
      setPendingComments((prev) => [
        {
          ...response.comment,
          author: { id: user.id, name: user.name, email: user.email },
        },
        ...prev,
      ]);
      setContent('');
    } catch (error) {
      console.error('Failed to submit comment', error);
      toast.error(error.message || 'Unable to submit comment. Try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Comments</h2>
        <span className="text-sm text-gray-500">{totalCount} contribution{totalCount === 1 ? '' : 's'}</span>
      </div>

      {!allowComments && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          Comments are closed for this article.
        </div>
      )}

      {allowComments && (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'Q'}
            </div>
            <div className="text-sm text-gray-600">
              {user ? `Commenting as ${user.name || user.email}` : 'You are commenting as a guest'}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            placeholder={user ? 'Share your takeaways or follow-up questions…' : 'Log in to comment'}
            disabled={!user || submitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:bg-gray-100"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!user || submitting || !content.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2a10 10 0 100 20v-2a8 8 0 01-8-8z"></path>
                </svg>
              )}
              Post comment
            </button>
          </div>
        </form>
      )}

      {pendingComments.length > 0 && (
        <div className="space-y-4">
          {pendingComments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{comment.author?.name || comment.authorName || comment.author?.email || 'You'}</div>
                <span className="text-xs uppercase tracking-wide">Awaiting moderation</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 && pendingComments.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet. Be the first to share your thoughts.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-gray-900">
                {comment.author?.name || comment.authorName || comment.author?.email || 'Anonymous'}
              </div>
              <div className="text-xs text-gray-400">{formatDateTime(comment.createdAt)}</div>
            </div>
            <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
