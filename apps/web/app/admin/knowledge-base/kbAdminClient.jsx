"use client";
import { useEffect, useState } from 'react';
import { AdminAPI } from '../../lib/adminApi';
import { 
  PageHeader, 
  Card, 
  StatusBadge, 
  Button, 
  FormInput, 
  FormSelect,
  FormTextarea,
  Tabs,
  EmptyState,
  LoadingSpinner
} from '../components/ui';

export default function KBAdminClient() {
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState([]);
  const [articles, setArticles] = useState([]);
  const [catName, setCatName] = useState('');
  const [article, setArticle] = useState({ title: '', slug: '', content: '', categoryId: '', status: 'DRAFT' });
  const [filter, setFilter] = useState({ status: '', categoryId: '' });
  const [activeTab, setActiveTab] = useState('articles');
  
  // Tabs definition
  const tabs = [
    { id: 'articles', label: 'Articles' },
    { id: 'categories', label: 'Categories' },
    { id: 'create', label: 'Create New' }
  ];

  async function loadCats() {
    try {
      const r = await AdminAPI.kbCategories();
      setCats(r);
    } catch (error) {
      console.error("Error loading KB categories:", error);
    }
  }
  
  async function loadArticles() {
    setLoading(true);
    try {
      const r = await AdminAPI.kbArticles(filter);
      setArticles(r);
    } catch (error) {
      console.error("Error loading KB articles:", error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => { 
    loadCats();
  }, []);
  
  useEffect(() => { 
    loadArticles();
  }, [filter.status, filter.categoryId]);

  async function saveCategory(e) {
    e.preventDefault();
    if (!catName.trim()) return;
    
    try {
      await AdminAPI.kbUpsertCategory({ name: catName });
      setCatName('');
      await loadCats();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  }
  
  async function saveArticle(e) {
    e.preventDefault();
    try {
      await AdminAPI.kbUpsertArticle({ 
        ...article, 
        categoryId: article.categoryId ? Number(article.categoryId) : null 
      });
      setArticle({ title: '', slug: '', content: '', categoryId: '', status: 'DRAFT' });
      await loadArticles();
      // Switch to articles tab after creation
      setActiveTab('articles');
    } catch (error) {
      console.error("Error saving article:", error);
    }
  }
  
  async function setStatus(id, status) {
    try {
      await AdminAPI.kbSetArticleStatus(id, status);
      await loadArticles();
    } catch (error) {
      console.error("Error changing article status:", error);
    }
  }
  
  // Helper to auto-generate slug from title
  const generateSlug = (title) => {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setArticle(a => ({ ...a, slug }));
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <PageHeader 
        title="Knowledge Base Management" 
        description="Create and manage KB articles and categories"
      />
      
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {activeTab === 'articles' && (
        <>
          <Card title="Filter Articles" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Status"
                id="status-filter"
                value={filter.status}
                onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'PUBLISHED', label: 'Published' },
                  { value: 'ARCHIVED', label: 'Archived' }
                ]}
              />
              
              <FormSelect
                label="Category"
                id="category-filter"
                value={filter.categoryId}
                onChange={(e) => setFilter(f => ({ ...f, categoryId: e.target.value }))}
                options={[
                  { value: '', label: 'All Categories' },
                  ...(cats || []).map(c => ({ value: c.id, label: c.name }))
                ]}
              />
            </div>
          </Card>
          
          {loading ? (
            <LoadingSpinner />
          ) : articles.length === 0 ? (
            <EmptyState
              title="No articles found"
              description="There are no articles matching your current filters."
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              }
              action={
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('create')}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  }
                >
                  Create New Article
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{article.title}</h3>
                    <StatusBadge status={article.status} />
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    Updated: {new Date(article.updatedAt).toLocaleString()}
                  </div>
                  
                  {article.category && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {article.category.name}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      }
                    >
                      Edit
                    </Button>
                    
                    {article.status !== 'PUBLISHED' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => setStatus(article.id, 'PUBLISHED')}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        }
                      >
                        Publish
                      </Button>
                    )}
                    
                    {article.status === 'PUBLISHED' && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => setStatus(article.id, 'ARCHIVED')}
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                          </svg>
                        }
                      >
                        Archive
                      </Button>
                    )}
                    
                    <Button
                      variant="info"
                      size="sm"
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      }
                    >
                      Preview
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <Card title="Create New Category">
            <form onSubmit={saveCategory} className="flex gap-4">
              <div className="flex-1">
                <FormInput
                  label="Category Name"
                  id="cat-name"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="flex items-end">
                <Button 
                  type="submit"
                  variant="primary"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  }
                >
                  Add Category
                </Button>
              </div>
            </form>
          </Card>
          
          <Card title="Existing Categories">
            {cats.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No categories created yet.</p>
            ) : (
              <div className="space-y-2">
                {cats.map(category => (
                  <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                      {category._count?.articles > 0 && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {category._count.articles} articles
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
      
      {activeTab === 'create' && (
        <Card title="Create New Article">
          <form onSubmit={saveArticle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormInput
                label="Title"
                id="article-title"
                value={article.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setArticle(a => ({ ...a, title }));
                  if (!article.slug || article.slug === '') {
                    generateSlug(title);
                  }
                }}
                placeholder="Article title"
                required
                className="md:col-span-2"
              />
              
              <FormInput
                label="Slug (URL Path)"
                id="article-slug"
                value={article.slug}
                onChange={(e) => setArticle(a => ({ ...a, slug: e.target.value }))}
                placeholder="article-url-slug"
                required
              />
              
              <FormSelect
                label="Category"
                id="article-category"
                value={article.categoryId}
                onChange={(e) => setArticle(a => ({ ...a, categoryId: e.target.value }))}
                options={[
                  { value: '', label: 'Select a category' },
                  ...(cats || []).map(c => ({ value: c.id, label: c.name }))
                ]}
              />
              
              <FormTextarea
                label="Content (Markdown supported)"
                id="article-content"
                value={article.content}
                onChange={(e) => setArticle(a => ({ ...a, content: e.target.value }))}
                placeholder="Write your article content here..."
                required
                rows={12}
                className="md:col-span-2"
              />
              
              <FormSelect
                label="Status"
                id="article-status"
                value={article.status}
                onChange={(e) => setArticle(a => ({ ...a, status: e.target.value }))}
                options={[
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'PENDING', label: 'Pending Review' },
                  { value: 'PUBLISHED', label: 'Published' },
                  { value: 'ARCHIVED', label: 'Archived' }
                ]}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setActiveTab('articles')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                }
              >
                Save Article
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
