"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AdminAPI } from '../../../lib/adminApi';
import {
  Card,
  Button,
  LoadingSpinner,
  EmptyState,
  ConfirmDialog,
  TextField
} from '../../components/ui';
import Link from 'next/link';

export default function CategoriesClient() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    void loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const response = await AdminAPI.contentCategories();
      setCategories(response.items || []);
    } catch (error) {
      console.error('Failed to load categories', error);
      toast.error('Unable to load categories');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    if (!newName.trim()) return;

    try {
      setCreating(true);
      await AdminAPI.createContentCategory(newName.trim());
      toast.success('Category created');
      setNewName('');
      await loadCategories();
    } catch (error) {
      console.error('Failed to create category', error);
      toast.error(error?.message || 'Unable to create category');
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!editingId || !editName.trim()) return;

    try {
      await AdminAPI.updateContentCategory(editingId, editName.trim());
      toast.success('Category updated');
      setEditingId(null);
      setEditName('');
      await loadCategories();
    } catch (error) {
      console.error('Failed to update category', error);
      toast.error(error?.message || 'Unable to update category');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await AdminAPI.deleteContentCategory(deleteTarget.id);
      toast.success('Category deleted');
      setDeleteTarget(null);
      await loadCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
      toast.error(error?.message || 'Unable to delete category');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Blog categories</h1>
          <p className="text-sm text-gray-500">Organise articles and control their placement on the blog.</p>
        </div>
        <Link href="/admin/content" className="text-sm text-blue-600 hover:text-blue-700">
          Back to moderation
        </Link>
      </div>

      <Card className="space-y-4">
        <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <TextField
            label="New category name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="e.g. Security"
            required
            className="sm:flex-1"
          />
          <Button type="submit" disabled={creating}>
            {creating ? 'Adding…' : 'Add category'}
          </Button>
        </form>
      </Card>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create your first category above to start organising content."
          />
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.id} className="py-4">
                {editingId === category.id ? (
                  <form onSubmit={handleUpdate} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <TextField
                      label="Category name"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      required
                      className="sm:flex-1"
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" variant="primary">
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingId(null);
                          setEditName('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">{category._count?.posts || 0} posts</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingId(category.id);
                          setEditName(category.name);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteTarget(category)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category"
        message={deleteTarget ? `Delete ${deleteTarget.name}? Posts using this category will need updating.` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
