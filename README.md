# Portfolio — Suchintan Das

Personal portfolio site built with Next.js 14, Tailwind CSS, and Framer Motion.

## Hosted Link

Open [https://suchintan.co.in/] (Suchintan Portfolio) in your browser.

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Create a new blog post
npm run new-blog
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to GitHub Pages

### 1. Create a GitHub repo

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repo on GitHub
2. Navigate to **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. That's it — the workflow at `.github/workflows/deploy.yml` handles the rest

### 3. Automatic deployments

Every push to `main` will:
1. Run all 98 tests
2. Build the static site (`output: 'export'`)
3. Deploy to GitHub Pages

Your site will be live at `https://<your-username>.github.io/<repo-name>/`

### 4. Custom domain (optional)

1. Go to **Settings → Pages → Custom domain**
2. Enter your domain (e.g. `portfolio.example.com`)
3. Add a `CNAME` record in your DNS pointing to `<your-username>.github.io`
4. Create a `public/CNAME` file with your domain:

```bash
echo "portfolio.example.com" > public/CNAME
```

## Deploy to Vercel (alternative)

```bash
npm i -g vercel
vercel
```

Follow the prompts. No config changes needed — Vercel auto-detects Next.js.

## Project Structure

```
app/              → Next.js App Router pages
components/       → React components (Hero, About, Skills, etc.)
data/             → portfolio.json (single source of truth) + re-export modules
hooks/            → Custom React hooks
content/blogs/    → Markdown blog posts
lib/              → Server utilities (blog content loader)
__tests__/        → Jest + React Testing Library tests
.github/workflows → CI/CD pipeline
```

## Blog System

Blogs are file-based markdown in `content/blogs/`. Metadata lives in `data/portfolio.json`.

```bash
# Scaffold a new post
npm run new-blog

# Then edit the generated .md file in content/blogs/
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + glassmorphism design system
- **Animations**: Framer Motion
- **Testing**: Jest + React Testing Library + fast-check (property-based)
- **Blog**: Markdown with gray-matter + react-markdown
- **CI/CD**: GitHub Actions → GitHub Pages
