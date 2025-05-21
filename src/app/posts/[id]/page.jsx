import { notFound } from 'next/navigation';
import TiptapEditor from '@/components/tiptap-templates/simple/simple-editor'; // Assuming this is the editor component

async function getPost(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`, {
    cache: 'no-store', // Ensure data is fresh
  });

  if (res.status === 404) {
    return null; // Post not found
  }

  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }

  return res.json();
}

export default async function PostDetailPage({ params }) {
  const { id } = params;
  const post = await getPost(id);

  if (!post) {
    notFound(); // Render the not-found page
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title || 'Untitled Post'}</h1>
      <div className="prose max-w-none">
        {/* Display content using the Tiptap editor in read-only mode */}
        <TiptapEditor initialContent={post.content} editable={false} />
      </div>
      {/* You might want to display media URLs here */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Media</h2>
          <ul>
            {post.mediaUrls.map((url, index) => (
              <li key={index}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a></li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">
        <a href="/posts" className="text-blue-600 hover:underline">Back to Posts</a>
      </div>
    </div>
  );
}
