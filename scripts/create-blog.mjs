#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  const title = await ask('Blog title: ');
  const tagsRaw = await ask('Tags (comma-separated): ');
  const excerpt = await ask('Short excerpt: ');
  rl.close();

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const date = new Date().toISOString().split('T')[0];
  const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);

  // Create markdown file
  const mdPath = path.join(process.cwd(), 'content', 'blogs', `${slug}.md`);
  const mdContent = `# ${title}\n\nWrite your blog content here.\n`;
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, mdContent, 'utf-8');

  // Update portfolio.json
  const jsonPath = path.join(process.cwd(), 'data', 'portfolio.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  data.blogs.push({ slug, title, date, excerpt, tags });
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`\nBlog created!`);
  console.log(`  Markdown: content/blogs/${slug}.md`);
  console.log(`  Metadata added to data/portfolio.json`);
  console.log(`\nEdit the markdown file, then run your dev server to see it.`);
}

main().catch(console.error);
