import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const { title, content, mediaUrls } = await request.json();
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        mediaUrls,
      },
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(`Error deleting post with ID ${id}:`, error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
