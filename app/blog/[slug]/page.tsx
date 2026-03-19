import Link from 'next/link';
import { getBlogSlugs, getBlogContent } from '@/lib/blog';
import BlogPostClient from './BlogPostClient';

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { content, title, date, tags } = getBlogContent(params.slug);

  return (
    <BlogPostClient content={content} title={title} date={date} tags={tags} />
  );
}
