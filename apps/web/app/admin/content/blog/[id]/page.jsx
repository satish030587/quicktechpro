import BlogEditor from '../BlogEditor';

export const metadata = { title: 'Edit Blog Post | Admin' };

export default function AdminEditBlogPostPage({ params }) {
  return <BlogEditor mode="edit" postId={params.id} />;
}
