'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogPosts } from '@/data/blogs';
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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-40 -right-24 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link href="/#blogs" className="text-sm text-primary hover:underline mb-6 inline-flex items-center gap-1">
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Back to home
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
              Blog
            </h1>
            <p className="text-foreground/50 max-w-xl">
              Thoughts on testing, automation, and software quality.
            </p>
          </motion.div>

          {/* Blog posts grid */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogPosts.map((post) => (
              <motion.article key={post.slug} variants={itemVariants}>
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-foreground/50 text-sm sm:text-base mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-foreground/40 text-xs">
                          <CalendarIcon />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </time>
                        </div>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Read article <ArrowIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
