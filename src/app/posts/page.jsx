import Link from 'next/link';

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`, {
    cache: 'no-store', // Ensure data is fresh
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="border p-3 rounded">
            <Link href={`/posts/${post.id}`} className="text-blue-600 hover:underline">
              {post.title || 'Untitled Post'}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Create New Post
        </Link>
      </div>
    </div>
  );
}
