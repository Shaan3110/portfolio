import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import portfolioData from '@/data/portfolio.json';
import { BlogPost } from '@/data/types';

const blogsDir = path.join(process.cwd(), 'content/blogs');

const blogs: BlogPost[] = (portfolioData as any).blogs ?? [];

export function getBlogSlugs(): string[] {
  return blogs.map((b) => b.slug);
}

export function getBlogContent(slug: string): { content: string; title: string; date: string; tags: string[] } {
  const meta = blogs.find((b) => b.slug === slug);
  const filePath = path.join(blogsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return { content: 'Blog post not found.', title: meta?.title ?? slug, date: meta?.date ?? '', tags: meta?.tags ?? [] };
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(raw);

  return {
    content,
    title: meta?.title ?? slug,
    date: meta?.date ?? '',
    tags: meta?.tags ?? [],
  };
}
