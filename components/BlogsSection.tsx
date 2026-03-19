'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { blogPosts } from '@/data/blogs';
import { useAnimationReady } from '@/hooks/useAnimationReady';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

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

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

export default function BlogsSection() {
  const animationReady = useAnimationReady();

  return (
    <section id="blogs" className="py-24 px-4 sm:px-6 lg:px-8 relative" aria-labelledby="blogs-heading">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-16 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial={animationReady ? 'hidden' : 'visible'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2
            id="blogs-heading"
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4"
          >
            Blogs
          </h2>
          <p className="text-foreground/50 max-w-2xl mx-auto">
            Sharing knowledge on test automation, frameworks, and best practices.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              variants={itemVariants}
            >
              <Link href={`/blog/${post.slug}`} className="block h-full group">
                <div className="glass-card rounded-2xl p-6 h-full border border-white/5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
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
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-foreground/50 mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Footer: date + read more */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-foreground/40 text-xs">
                        <CalendarIcon />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Read more <ArrowRightIcon />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View all link */}
        <motion.div variants={itemVariants} className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-card border border-white/5 hover:border-primary/20 text-sm font-medium text-primary hover:scale-105 transition-all duration-300"
          >
            View all posts
            <ArrowRightIcon />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
