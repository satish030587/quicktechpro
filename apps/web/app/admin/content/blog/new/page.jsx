import BlogEditor from '../BlogEditor';

export const metadata = { title: 'Create Blog Post | Admin' };

export default function AdminNewBlogPostPage() {
  return <BlogEditor mode="create" />;
}
