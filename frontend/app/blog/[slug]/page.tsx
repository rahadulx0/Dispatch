import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleShare from '@/components/ArticleShare';
import BlogCard from '@/components/BlogCard';
import ReadingProgress from '@/components/ReadingProgress';
import { api, formatDate } from '@/lib/api';
import { sanitizeHtml } from '@/lib/sanitize';
import type { Blog } from '@/lib/types';

export const revalidate = 15;

interface Params {
  params: { slug: string };
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

async function fetchBlog(slug: string): Promise<{ blog: Blog; related: Blog[] } | null> {
  try {
    return await api.getBlog(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await fetchBlog(params.slug);
  if (!data) return { title: 'Not found' };
  const { blog } = data;
  const url = `${siteUrl()}/blog/${blog.slug}`;
  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [{ url: blog.coverImage, width: 1200, height: 675 }] : undefined,
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: blog.author?.name ? [blog.author.name] : undefined,
      section: blog.category,
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

export default async function BlogPage({ params }: Params) {
  const data = await fetchBlog(params.slug);
  if (!data) notFound();

  const { blog, related } = data;
  const safeHtml = sanitizeHtml(blog.content);
  const categoryLower = blog.category.toLowerCase();
  const articleUrl = `${siteUrl()}/blog/${blog.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: articleUrl,
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    articleSection: blog.category,
    keywords: blog.tags?.join(', '),
    author: [
      {
        '@type': 'Person',
        name: blog.author?.name,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Dispatch',
    },
  };

  return (
    <article>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-ink-100">
        <div className="container-news max-w-article-hero py-10">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href={`/category/${categoryLower}`}
              className="font-sans font-bold uppercase tracking-[0.1em] text-brand-600 hover:text-brand-500"
            >
              {blog.category}
            </Link>
            <span className="text-ink-300">·</span>
            <span className="font-sans uppercase tracking-[0.05em] text-ink-400">
              {blog.readingTime} min read
            </span>
          </div>

          <h1 className="mt-4 font-serif text-4xl font-black leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {blog.excerpt ? (
            <p className="mt-5 font-serif text-xl leading-relaxed text-ink-500">
              {blog.excerpt}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-4 border-t border-ink-100 pt-5">
            <div className="flex items-center gap-3">
              {blog.author.avatar ? (
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full bg-ink-50 object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  {blog.author.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-sans text-sm font-semibold text-ink">By {blog.author.name}</p>
                <p className="byline">{formatDate(blog.publishedAt || blog.createdAt)}</p>
              </div>
            </div>
            <ArticleShare url={articleUrl} title={blog.title} />
          </div>
        </div>
      </header>

      {blog.coverImage ? (
        <div className="container-news py-8">
          <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden bg-ink-50">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="container-news max-w-article pb-16">
        <div
          className="prose-news"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />

        <div className="mt-10 border-t border-ink-100 pt-6">
          <ArticleShare url={articleUrl} title={blog.title} />
        </div>

        {blog.tags.length ? (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-6">
            <span className="eyebrow">Tags</span>
            {blog.tags.map((t) => (
              <Link
                key={t}
                href={`/search?q=${encodeURIComponent(t)}`}
                className="border border-ink-200 px-3 py-1 font-sans text-xs uppercase tracking-[0.05em] text-ink-500 hover:border-ink hover:text-ink"
              >
                {t}
              </Link>
            ))}
          </div>
        ) : null}

        {blog.author.bio ? (
          <aside className="mt-10 border-t-2 border-ink pt-6">
            <span className="eyebrow">About the author</span>
            <h3 className="mt-2 font-serif text-2xl font-bold">{blog.author.name}</h3>
            <p className="mt-2 font-serif leading-relaxed text-ink-500">{blog.author.bio}</p>
          </aside>
        ) : null}
      </div>

      {related.length ? (
        <section className="container-news rule-top py-10">
          <h2 className="border-b-2 border-ink pb-2 font-serif text-2xl font-black tracking-tight">
            More from {blog.category}
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {related.map((b) => (
              <BlogCard key={b._id} blog={b} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
