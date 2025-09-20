"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AdminAPI } from '../../../lib/adminApi';
import { useAuth } from '../../../providers';
import { Card, Button, StatusBadge, LoadingSpinner, FormCheckbox, ConfirmDialog } from '../../components/ui';
import ImageUploader from './ImageUploader';

const DEFAULT_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  content: '',
  categoryId: '',
  tags: [],
  allowComments: true,
  featured: false,
  readingMinutes: '',
  authorId: '',
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-');
}

function estimateReadingMinutes(content) {
  if (!content) return 0;
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
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

function formatDate(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function humanizeStatus(value) {
  return value?.toLowerCase().replace(/_/g, ' ').replace(/(^|\\s)\\w/g, (c) => c.toUpperCase());
}
function toDateTimeInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (number) => String(number).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toIsoFromDateTimeInput(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default function BlogEditor({ mode, postId }) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [status, setStatus] = useState('DRAFT');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [publishedAt, setPublishedAt] = useState(null);
  const [scheduledAtInput, setScheduledAtInput] = useState('');
  const [authorDisplayName, setAuthorDisplayName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [translationDraft, setTranslationDraft] = useState({ language: '', title: '', excerpt: '', content: '', aiSummary: '' });
  const [editingTranslationIndex, setEditingTranslationIndex] = useState(null);
  const [showCoverUploader, setShowCoverUploader] = useState(false);

  const derivedReadingMinutes = useMemo(() => {
    if (form.readingMinutes) return Number(form.readingMinutes);
    return estimateReadingMinutes(form.content);
  }, [form.content, form.readingMinutes]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const categoriesPromise = AdminAPI.contentCategories();

      if (mode === 'edit' && postId) {
        const [categories, post] = await Promise.all([
          categoriesPromise,
          AdminAPI.contentPost(postId),
        ]);

        setCategoryOptions(categories.items || []);

        const tagValues = Array.isArray(post.tags)
          ? post.tags.map((tag) => (typeof tag === 'string' ? tag : tag?.name)).filter(Boolean)
          : [];

        setForm({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          coverImage: post.coverImage || '',
          content: post.content || '',
          categoryId: post.categoryId ?? '',
          tags: tagValues,
          allowComments: Boolean(post.allowComments),
          featured: Boolean(post.featured),
          readingMinutes: post.readingMinutes || '',
          authorId: post.authorId ?? post.author?.id ?? user?.id ?? user?.sub ?? '',
        });
        setTranslations(
          Array.isArray(post.translations)
            ? post.translations.map((translation) => ({
                language: translation.language || '',
                title: translation.title || '',
                excerpt: translation.excerpt || '',
                content: translation.content || '',
                aiSummary: translation.aiSummary || ''
              }))
            : []
        );

        setStatus(post.status || 'DRAFT');
        setPublishedAt(post.publishedAt || null);
        setScheduledAtInput(toDateTimeInputValue(post.publishedAt));
        setAuthorDisplayName(
          post.author?.name || post.author?.email || user?.name || user?.email || 'Unassigned'
        );
        setSlugManuallyEdited(true);
      } else {
        const categories = await categoriesPromise;
        setCategoryOptions(categories.items || []);
        setForm((prev) => ({
          ...prev,
          authorId: prev.authorId || user?.id || user?.sub || '',
        }));
        setTranslations([]);
        setAuthorDisplayName(user?.name || user?.email || 'Unassigned');
        setPublishedAt(null);
        setScheduledAtInput('');
      }
    } catch (error) {
      console.error('Failed to load blog editor data', error);
      toast.error('Unable to load blog editor');
    } finally {
      setLoading(false);
    }
  }, [mode, postId, user]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value) => {
    handleFieldChange('title', value);
    if (!slugManuallyEdited) {
      handleFieldChange('slug', slugify(value));
    }
  };

  const handleSlugChange = (value) => {
    setSlugManuallyEdited(true);
    handleFieldChange('slug', slugify(value));
  };

  const handleAddTag = () => {
    const trimmed = tagDraft.trim().replace(/^#/, '');
    if (!trimmed) return;
    if (form.tags.includes(trimmed)) {
      toast('Tag already added');
      setTagDraft('');
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setTagDraft('');
  };

  const handleTagKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }));
  };

  const resetTranslationDraft = () => {
    setTranslationDraft({ language: '', title: '', excerpt: '', content: '', aiSummary: '' });
    setEditingTranslationIndex(null);
  };

  const handleTranslationSubmit = () => {
    const language = translationDraft.language.trim().toLowerCase();
    const title = translationDraft.title.trim();
    const content = translationDraft.content.trim();
    const excerpt = translationDraft.excerpt.trim();
    const aiSummary = translationDraft.aiSummary.trim();

    if (!language) {
      toast.error('Language code is required');
      return;
    }
    if (!title || !content) {
      toast.error('Provide a title and localized content');
      return;
    }

    const duplicateIndex = translations.findIndex((translation, index) => translation.language === language && index !== editingTranslationIndex);
    if (duplicateIndex !== -1) {
      toast.error('A translation for this language already exists');
      return;
    }

    const nextTranslation = { language, title, excerpt, content, aiSummary };

    setTranslations((prev) => {
      if (editingTranslationIndex !== null) {
        const next = [...prev];
        next[editingTranslationIndex] = nextTranslation;
        return next;
      }
      return [...prev, nextTranslation];
    });

    toast.success(editingTranslationIndex !== null ? 'Translation updated' : 'Translation added');
    resetTranslationDraft();
  };

  const handleTranslationEdit = (index) => {
    const translation = translations[index];
    if (!translation) return;
    setTranslationDraft({
      language: translation.language || '',
      title: translation.title || '',
      excerpt: translation.excerpt || '',
      content: translation.content || '',
      aiSummary: translation.aiSummary || ''
    });
    setEditingTranslationIndex(index);
  };

  const handleTranslationDelete = (index) => {
    setTranslations((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    if (editingTranslationIndex === index) {
      resetTranslationDraft();
    } else if (editingTranslationIndex !== null && editingTranslationIndex > index) {
      setEditingTranslationIndex((prevIndex) => (prevIndex !== null ? prevIndex - 1 : null));
    }
    toast.success('Translation removed');
  };

  const handleTranslationCancel = () => {
    resetTranslationDraft();
  };

  const handleCreateCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    try {
      const created = await AdminAPI.createContentCategory(name);
      toast.success('Category added');
      setCategoryOptions((prev) => [...prev, created]);
      handleFieldChange('categoryId', created.id);
      setNewCategory('');
    } catch (error) {
      console.error('Failed to create category', error);
      toast.error('Unable to create category');
    }
  };

  const computePayload = (statusOverride, scheduledAtInputValue) => {
    const baseStatus = statusOverride || status;
    const title = form.title.trim();
    const slugValue = (form.slug || slugify(form.title)).trim();
    const sanitizedTags = Array.from(new Set((form.tags || []).map((tag) => tag.trim()).filter(Boolean)));
    const categoryIdValue = form.categoryId
      ? (Number.isNaN(Number(form.categoryId)) ? form.categoryId : Number(form.categoryId))
      : null;

    let publishedAtValue = null;
    if (baseStatus === 'SCHEDULED') {
      publishedAtValue = toIsoFromDateTimeInput(scheduledAtInputValue);
    } else if (baseStatus === 'PUBLISHED') {
      publishedAtValue = toIsoFromDateTimeInput(scheduledAtInputValue) || publishedAt || new Date().toISOString();
    }

    const payload = {
      title,
      slug: slugValue,
      excerpt: form.excerpt.trim(),
      coverImage: form.coverImage.trim(),
      content: form.content,
      categoryId: categoryIdValue,
      tags: sanitizedTags,
      allowComments: form.allowComments,
      featured: form.featured,
      readingMinutes: derivedReadingMinutes,
      status: baseStatus,
      authorId: form.authorId || user?.id || user?.sub || null,
      ...(publishedAtValue ? { publishedAt: publishedAtValue } : {}),
    };

    payload.translations = translations.map((translation) => ({
      language: translation.language,
      title: translation.title,
      excerpt: translation.excerpt || undefined,
      content: translation.content,
      aiSummary: translation.aiSummary || undefined
    }));

    return payload;
  };
  const handleSave = async (statusOverride) => {
    const targetStatus = statusOverride || status;
    try {
      setSaving(true);

      if (!form.title.trim() || !form.content.trim()) {
        toast.error('Title and content are required');
        setSaving(false);
        return;
      }

      if (!form.slug.trim()) {
        handleFieldChange('slug', slugify(form.title));
      }

      if (targetStatus === 'SCHEDULED') {
        if (!scheduledAtInput) {
          toast.error('Choose a future publish date and time before scheduling');
          setSaving(false);
          return;
        }
        const scheduledIso = toIsoFromDateTimeInput(scheduledAtInput);
        if (!scheduledIso) {
          toast.error('Publish date is not valid');
          setSaving(false);
          return;
        }
        if (new Date(scheduledIso) <= new Date()) {
          toast.error('Choose a publish time in the future');
          setSaving(false);
          return;
        }
      }

      if (!form.authorId && !user?.id && !user?.sub) {
        toast.error('Unable to assign an author to this post');
        setSaving(false);
        return;
      }

      const payload = computePayload(statusOverride, scheduledAtInput);

      if (targetStatus === 'SCHEDULED' && !payload.publishedAt) {
        toast.error('Choose a publish date and time before scheduling');
        setSaving(false);
        return;
      }

      if (targetStatus === 'PUBLISHED' && !payload.publishedAt) {
        payload.publishedAt = new Date().toISOString();
      }

      if (mode === 'create') {
        const created = await AdminAPI.createContentPost(payload);
        let successMessage = 'Draft saved';
        if (targetStatus === 'PUBLISHED') {
          successMessage = 'Post published';
        } else if (targetStatus === 'SCHEDULED') {
          successMessage = 'Post scheduled';
        } else if (targetStatus === 'PENDING') {
          successMessage = 'Post sent for review';
        }
        toast.success(successMessage);
        router.replace('/admin/content/blog/' + created.id);
      } else if (postId) {
        const updated = await AdminAPI.updateContentPost(postId, payload);
        const nextStatus = updated.status || payload.status;
        setStatus(nextStatus);
        const nextPublishedAt = updated.publishedAt || payload.publishedAt || null;
        setPublishedAt(nextPublishedAt);
        setScheduledAtInput(toDateTimeInputValue(nextPublishedAt));
        setForm((prev) => ({
          ...prev,
          authorId: updated.authorId ?? updated.author?.id ?? prev.authorId,
        }));
        setAuthorDisplayName(
          updated.author?.name || updated.author?.email || authorDisplayName || user?.name || user?.email || 'Unassigned'
        );
        setTranslations(
          Array.isArray(updated.translations)
            ? updated.translations.map((translation) => ({
                language: translation.language || '',
                title: translation.title || '',
                excerpt: translation.excerpt || '',
                content: translation.content || '',
                aiSummary: translation.aiSummary || ''
              }))
            : []
        );
        resetTranslationDraft();

        let statusMessage = 'Post updated';
        if (statusOverride && statusOverride !== status) {
          statusMessage = 'Status updated to ' + humanizeStatus(statusOverride);
        } else if (nextStatus === 'PUBLISHED' && !statusOverride) {
          statusMessage = 'Post published';
        } else if (nextStatus === 'SCHEDULED' && !statusOverride) {
          statusMessage = 'Post scheduled';
        }
        toast.success(statusMessage);
      }
    } catch (error) {
      console.error('Failed to save blog post', error);
      toast.error('Unable to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!postId || deleting) return;
    try {
      setDeleting(true);
      await AdminAPI.deleteContentPost(postId);
      toast.success('Post moved to trash');
      setShowDeleteDialog(false);
      router.replace('/admin/content');
    } catch (error) {
      console.error('Failed to delete post', error);
      toast.error('Unable to delete post');
    } finally {
      setDeleting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/admin/content" className="text-blue-600 hover:text-blue-700">Content</Link>
            <span>/</span>
            <span>{mode === 'create' ? 'New Blog Post' : form.title || 'Edit Blog Post'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{mode === 'create' ? 'Create blog article' : form.title || 'Edit blog article'}</h1>
            <StatusBadge status={humanizeStatus(status)} />
            {publishedAt && (
              <span className="text-sm text-gray-500">Published {formatDate(publishedAt)}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 max-w-3xl">
            Craft compelling updates for customers. Write in a conversational, jargon-free voice and showcase the expertise of your team.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card>
              <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Headline</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="Describe the main takeaway"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(event) => handleSlugChange(event.target.value)}
                    placeholder="auto-generated"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <p className="text-xs text-gray-400">URL preview: /blog/{form.slug || 'your-slug'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={form.categoryId}
                    onChange={(event) => handleFieldChange('categoryId', event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="">Uncategorized</option>
                    {categoryOptions.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      placeholder="Add new category"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <Button variant="secondary" size="sm" onClick={handleCreateCategory} disabled={!newCategory.trim()}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Hero image</label>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowCoverUploader((prev) => !prev)}
                  >
                    {showCoverUploader ? 'Close uploader' : 'Upload image'}
                  </Button>
                </div>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(event) => handleFieldChange('coverImage', event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <p className="text-xs text-gray-500">Paste an image link or upload a file below.</p>
                {showCoverUploader && (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                    <ImageUploader
                      onImageUploaded={(imageUrl) => {
                        handleFieldChange('coverImage', imageUrl);
                        setShowCoverUploader(false);
                      }}
                    />
                  </div>
                )}
                {form.coverImage && (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <img src={form.coverImage} alt="Cover preview" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Summary</label>
                <textarea
                  value={form.excerpt}
                  onChange={(event) => handleFieldChange('excerpt', event.target.value)}
                  rows={3}
                  placeholder="Write a concise teaser shown in listings."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Body</label>
                <textarea
                  value={form.content}
                  onChange={(event) => handleFieldChange('content', event.target.value)}
                  rows={18}
                  placeholder="Share the full story. Use short paragraphs, bullet points, and headings for readability."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <p className="text-xs text-gray-400">Markdown will be supported in a future iteration. For now, basic formatting applies.</p>
              </div>
            </div>
          </Card>

            <div className="space-y-6">
            <Card>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Publish controls</h3>
                  <p className="text-xs text-gray-500">Keep stakeholders informed and release polished posts confidently.</p>
                </div>

                <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="font-medium text-gray-700">Assigned author</span>
                    <span className="text-sm text-gray-900">{authorDisplayName || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="font-medium text-gray-700">Current status</span>
                    <span className="text-sm text-gray-900">{humanizeStatus(status)}</span>
                  </div>
                  {publishedAt && (
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="font-medium text-gray-700">Publish date</span>
                      <span className="text-sm text-gray-900">{formatDate(publishedAt)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700" htmlFor="publish-datetime">Publish date &amp; time</label>
                  <input
                    id="publish-datetime"
                    type="datetime-local"
                    value={scheduledAtInput}
                    onChange={(event) => setScheduledAtInput(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <p className="text-xs text-gray-500">Times use your local timezone. Leave blank to publish immediately.</p>
                  {scheduledAtInput && (
                    <Button
                      type="button"
                      size="sm"
                      variant="link"
                      className="px-0 text-blue-600"
                      onClick={() => setScheduledAtInput('')}
                    >
                      Clear scheduled time
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => handleSave('DRAFT')} disabled={saving}>
                    Save draft
                  </Button>
                  <Button variant="ghost" onClick={() => handleSave('PENDING')} disabled={saving}>
                    Send for review
                  </Button>
                  <Button variant="primary" onClick={() => handleSave('PUBLISHED')} disabled={saving}>
                    Publish now
                  </Button>
                  <Button
                    variant="info"
                    onClick={() => handleSave('SCHEDULED')}
                    disabled={saving || !scheduledAtInput}
                  >
                    Schedule publish
                  </Button>
                </div>

                {mode === 'edit' && (
                  <Button variant="ghost" onClick={() => handleSave()} disabled={saving}>
                    Save changes
                  </Button>
                )}

                {saving && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <LoadingSpinner size="sm" />
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Audience & discoverability</h3>
                  <p className="text-xs text-gray-500">Fine-tune how this article appears across the site.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagDraft}
                      onChange={(event) => setTagDraft(event.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Press enter to add"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <Button variant="secondary" size="sm" onClick={handleAddTag} disabled={!tagDraft.trim()}>
                      Add
                    </Button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                          #{tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-gray-600">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <FormCheckbox
                    label="Enable comments"
                    checked={form.allowComments}
                    onChange={(event) => handleFieldChange('allowComments', event.target.checked)}
                    description="Readers can respond. Pending moderation applies."
                  />
                  <FormCheckbox
                    label="Promote as featured"
                    checked={form.featured}
                    onChange={(event) => handleFieldChange('featured', event.target.checked)}
                    description="Featured stories receive priority placement on the blog homepage."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Estimated reading time (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={derivedReadingMinutes}
                    onChange={(event) => handleFieldChange('readingMinutes', event.target.value)}
                    className="w-32 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <p className="text-xs text-gray-400">Automatically estimated from body copy. Adjust if needed.</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Translations</h3>
                  <p className="text-xs text-gray-500">Localize this article for additional languages. Readers can switch languages on the public site.</p>
                </div>
                {translations.length === 0 ? (
                  <p className="text-sm text-gray-500">No translations added yet. Add localized content below to reach more readers.</p>
                ) : (
                  <div className="space-y-2">
                    {translations.map((translation, index) => (
                      <div key={translation.language || index} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-gray-800">
                              {getLanguageLabel(translation.language)} ({translation.language.toUpperCase()})
                            </div>
                            <p className="text-xs text-gray-600">{translation.title}</p>
                            {translation.aiSummary ? (
                              <p className="text-xs text-gray-500 line-clamp-2">{translation.aiSummary}</p>
                            ) : null}
                          </div>
                          <div className="flex gap-2">
                            <Button size="xs" variant="secondary" onClick={() => handleTranslationEdit(index)}>
                              Edit
                            </Button>
                            <Button size="xs" variant="danger" onClick={() => handleTranslationDelete(index)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-800">{editingTranslationIndex !== null ? 'Edit translation' : 'Add translation'}</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600" htmlFor="translation-language">Language code</label>
                      <input
                        id="translation-language"
                        type="text"
                        value={translationDraft.language}
                        onChange={(event) => setTranslationDraft((prev) => ({ ...prev, language: event.target.value }))}
                        placeholder="e.g. en, hi, es"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600" htmlFor="translation-title">Localized title</label>
                      <input
                        id="translation-title"
                        type="text"
                        value={translationDraft.title}
                        onChange={(event) => setTranslationDraft((prev) => ({ ...prev, title: event.target.value }))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600" htmlFor="translation-excerpt">Summary (optional)</label>
                      <textarea
                        id="translation-excerpt"
                        value={translationDraft.excerpt}
                        onChange={(event) => setTranslationDraft((prev) => ({ ...prev, excerpt: event.target.value }))}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600" htmlFor="translation-content">Localized content</label>
                      <textarea
                        id="translation-content"
                        value={translationDraft.content}
                        onChange={(event) => setTranslationDraft((prev) => ({ ...prev, content: event.target.value }))}
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600" htmlFor="translation-aiSummary">AI summary (optional)</label>
                      <textarea
                        id="translation-aiSummary"
                        value={translationDraft.aiSummary}
                        onChange={(event) => setTranslationDraft((prev) => ({ ...prev, aiSummary: event.target.value }))}
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={handleTranslationSubmit}>
                      {editingTranslationIndex !== null ? 'Update translation' : 'Add translation'}
                    </Button>
                    {editingTranslationIndex !== null ? (
                      <Button size="sm" variant="secondary" onClick={handleTranslationCancel}>
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-800">Quick preview</h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 space-y-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Hero</div>
                    <div className="text-lg font-semibold text-gray-900">{form.title || 'Your compelling headline goes here'}</div>
                  </div>
                  <p className="text-sm text-gray-600">{form.excerpt || 'Add a short summary to help readers understand the value at a glance.'}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{derivedReadingMinutes} min read</span>
                    {form.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-2 py-1 border border-gray-200">#{tag}</span>
                    ))}
                  </div>
                </div>
                <Link href={`/blog/${form.slug || 'preview'}`} target="_blank" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                  Open public preview
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </Card>
            {mode === 'edit' && (
              <Card>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">Danger zone</h3>
                    <p className="text-xs text-gray-500">Move this article to the recycle bin. It will no longer appear on the public site.</p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Move to trash'}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      {mode === 'edit' && showDeleteDialog && (
        <ConfirmDialog
          title="Move post to trash?"
          message="This hides the article from the public site. You can restore it later from the content manager."
          confirmLabel={deleting ? 'Deleting...' : 'Move to trash'}
          cancelLabel="Cancel"
          variant="warning"
          onConfirm={() => {
            if (!deleting) {
              handleDelete();
            }
          }}
          onCancel={() => {
            if (!deleting) {
              setShowDeleteDialog(false);
            }
          }}
        />
      )}
    </>
  );
}









