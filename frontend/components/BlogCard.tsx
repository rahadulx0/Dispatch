import Link from 'next/link';
import Image from 'next/image';
import { formatTimeAgo } from '@/lib/api';
import { cardCoverLoader, thumbLoader } from '@/lib/cloudinary';
import type { Blog } from '@/lib/types';

type Variant = 'hero' | 'lead' | 'default' | 'compact' | 'list';

interface Props {
  blog: Blog;
  variant?: Variant;
  showImage?: boolean;
}

export default function BlogCard({ blog, variant = 'default', showImage = true }: Props) {
  const href = `/blog/${blog.slug}`;
  const timeLabel = formatTimeAgo(blog.publishedAt || blog.createdAt);

  if (variant === 'hero') {
    return (
      <article className="group grid gap-6 lg:grid-cols-2">
        {showImage && blog.coverImage ? (
          <Link href={href} className="block overflow-hidden bg-ink-50">
            <div className="relative aspect-[16/10] w-full">
              <Image
                loader={cardCoverLoader}
                src={blog.coverImage}
                alt={blog.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        ) : null}
        <div className="flex flex-col justify-center">
          <span className="kicker">{blog.category}</span>
          <Link href={href}>
            <h1 className="mt-3 headline text-hero sm:text-[4rem]">{blog.title}</h1>
          </Link>
          {blog.excerpt ? (
            <p className="mt-4 font-serif text-lg leading-relaxed text-ink-500">{blog.excerpt}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 byline">
            <span>By {blog.author?.name || 'Staff'}</span>
            <span aria-hidden>·</span>
            <span>{timeLabel}</span>
            <span aria-hidden>·</span>
            <span>{blog.readingTime} min read</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'lead') {
    return (
      <article className="group flex flex-col">
        {showImage && blog.coverImage ? (
          <Link href={href} className="block overflow-hidden bg-ink-50">
            <div className="relative aspect-[16/10] w-full">
              <Image
                loader={cardCoverLoader}
                src={blog.coverImage}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        ) : null}
        <div className="mt-4">
          <span className="kicker">{blog.category}</span>
          <Link href={href}>
            <h2 className="mt-2 headline text-display">{blog.title}</h2>
          </Link>
          {blog.excerpt ? (
            <p className="mt-3 font-serif text-base leading-relaxed text-ink-500 line-clamp-3">
              {blog.excerpt}
            </p>
          ) : null}
          <p className="mt-3 byline">
            By {blog.author?.name || 'Staff'} · {timeLabel}
          </p>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex flex-col">
        {showImage && blog.coverImage ? (
          <Link href={href} className="block overflow-hidden bg-ink-50">
            <div className="relative aspect-[16/10] w-full">
              <Image
                loader={cardCoverLoader}
                src={blog.coverImage}
                alt={blog.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </Link>
        ) : null}
        <div className="mt-3">
          <span className="kicker">{blog.category}</span>
          <Link href={href}>
            <h3 className="mt-1.5 headline text-base">{blog.title}</h3>
          </Link>
          <p className="mt-2 byline">{timeLabel}</p>
        </div>
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article className="group flex items-start gap-4">
        {showImage && blog.coverImage ? (
          <Link href={href} className="block h-20 w-28 flex-shrink-0 overflow-hidden bg-ink-50">
            <div className="relative h-full w-full">
              <Image
                loader={thumbLoader}
                src={blog.coverImage}
                alt={blog.title}
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            </div>
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <span className="kicker">{blog.category}</span>
          <Link href={href}>
            <h3 className="mt-1 headline text-[17px] leading-snug">{blog.title}</h3>
          </Link>
          <p className="mt-1 byline">{timeLabel}</p>
        </div>
      </article>
    );
  }

  // default
  return (
    <article className="group flex flex-col">
      {showImage && blog.coverImage ? (
        <Link href={href} className="block overflow-hidden bg-ink-50">
          <div className="relative aspect-[16/10] w-full">
            <Image
              loader={cardCoverLoader}
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </Link>
      ) : null}
      <div className="mt-3">
        <span className="kicker">{blog.category}</span>
        <Link href={href}>
          <h3 className="mt-1.5 headline text-[22px]">{blog.title}</h3>
        </Link>
        {blog.excerpt ? (
          <p className="mt-2 font-serif text-sm leading-relaxed text-ink-500 line-clamp-2">
            {blog.excerpt}
          </p>
        ) : null}
        <p className="mt-2 byline">
          By {blog.author?.name || 'Staff'} · {timeLabel}
        </p>
      </div>
    </article>
  );
}
