'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TAG_COLORS: Record<string, string> = {
  Playwright: 'from-purple-500/20 to-violet-500/20 text-purple-400',
  Automation: 'from-green-500/20 to-emerald-500/20 text-green-400',
  Testing: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
  'API Testing': 'from-orange-500/20 to-red-500/20 text-orange-400',
  RestAssured: 'from-indigo-500/20 to-blue-500/20 text-indigo-400',
  Java: 'from-red-500/20 to-orange-500/20 text-red-400',
};

function getTagColor(tag: string) {
  return TAG_COLORS[tag] || 'from-primary/20 to-accent/20 text-primary';
}

interface Props {
  content: string;
  title: string;
  date: string;
  tags: string[];
}

export default function BlogPostClient({ content, title, date, tags }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-40 -right-24 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Back link */}
            <Link href="/blog" className="text-sm text-primary hover:underline mb-8 inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Back to all posts
            </Link>

            {/* Article header card */}
            <div className="glass-card rounded-2xl p-8 sm:p-10 mb-10 border border-white/5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {tags.map((tag) => (
                  <span key={tag} className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${getTagColor(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 leading-tight">
                {title}
              </h1>

              {/* Date */}
              <div className="flex items-center gap-2 text-foreground/40 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={date}>
                  {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
            </div>

            {/* Article content */}
            <article className="glass-card rounded-2xl p-8 sm:p-10 border border-white/5">
              <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/70 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-accent prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-surface prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-strong:text-foreground prose-li:text-foreground/70 prose-ul:my-4 prose-ol:my-4 prose-li:my-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            </article>

            {/* Footer navigation */}
            <div className="mt-10 flex justify-between items-center">
              <Link href="/blog" className="text-sm text-primary hover:underline inline-flex items-center gap-1.5">
                <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                All posts
              </Link>
              <Link href="/" className="text-sm text-foreground/50 hover:text-foreground transition-colors">
                Back to portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
