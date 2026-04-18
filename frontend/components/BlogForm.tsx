'use client';

import { FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
import Editor from '@/components/Editor';
import { api } from '@/lib/api';
import { CATEGORIES } from '@/lib/types';
import type { Blog } from '@/lib/types';

interface Props {
  initial?: Partial<Blog>;
  onSubmit: (payload: {
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category: string;
    tags: string[];
    status: 'draft' | 'published';
  }) => Promise<void>;
  submitLabel?: string;
}

export default function BlogForm({ initial, onSubmit, submitLabel = 'Publish' }: Props) {
  const [title, setTitle] = useState(initial?.title || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [content, setContent] = useState(initial?.content || '');
  const [coverImage, setCoverImage] = useState(initial?.coverImage || '');
  const [category, setCategory] = useState<string>(initial?.category || 'World');
  const [tagsText, setTagsText] = useState<string>((initial?.tags || []).join(', '));
  const [status, setStatus] = useState<'draft' | 'published'>(
    (initial?.status as 'draft' | 'published') || 'published'
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const coverInput = useRef<HTMLInputElement | null>(null);

  async function handleCover(file: File) {
    try {
      setUploading(true);
      const { url } = await api.uploadImage(file);
      setCoverImage(url);
    } catch (err) {
      alert((err as Error).message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent, overrideStatus?: 'draft' | 'published') {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }
    const plain = content.replace(/<[^>]+>/g, '').trim();
    if (plain.length < 20) {
      setError('Content is too short (need at least 20 characters of text)');
      return;
    }
    setSubmitting(true);
    try {
      const tags = tagsText
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await onSubmit({
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
        coverImage,
        category,
        tags,
        status: overrideStatus || status,
      });
    } catch (err) {
      setError((err as Error).message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <span className="eyebrow">Headline</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="Your headline — short, clear, factual"
            className="mt-1 block w-full border-b-2 border-ink bg-transparent py-3 font-serif text-4xl font-black tracking-tight text-ink placeholder-ink-300 focus:border-brand-500 focus:outline-none md:text-5xl"
          />
        </div>

        <div>
          <span className="eyebrow">Excerpt (optional)</span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={400}
            placeholder="One-sentence summary shown on cards and at the top of the article"
            rows={2}
            className="mt-1 block w-full border-b border-ink-200 bg-transparent py-3 font-serif text-lg text-ink placeholder-ink-300 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <span className="eyebrow">Body</span>
          <div className="mt-2">
            <Editor value={content} onChange={setContent} />
          </div>
        </div>

        {error ? (
          <p className="border-l-2 border-brand-500 bg-brand-50 px-3 py-2 font-sans text-sm">{error}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-6">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving…' : submitLabel}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={(e) => handleSubmit(e, 'draft')}
            className="btn-secondary"
          >
            Save as draft
          </button>
        </div>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
        <div>
          <span className="eyebrow">Status</span>
          <div className="mt-2 flex gap-2">
            {(['published', 'draft'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`flex-1 border px-3 py-2 font-sans text-xs font-bold uppercase tracking-[0.08em] ${
                  status === s ? 'border-ink bg-ink text-white' : 'border-ink-200 text-ink-500 hover:border-ink'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="eyebrow">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 block w-full border border-ink-200 bg-white px-3 py-2 font-sans text-sm focus:border-ink focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <span className="eyebrow">Tags</span>
          <input
            type="text"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="economy, elections, ai"
            className="mt-2 block w-full border border-ink-200 bg-white px-3 py-2 font-sans text-sm focus:border-ink focus:outline-none"
          />
          <p className="mt-1 byline">Comma-separated, lowercase.</p>
        </div>

        <div>
          <span className="eyebrow">Cover image</span>
          <div className="mt-2 border border-ink-200">
            {coverImage ? (
              <div className="relative aspect-[16/10] w-full bg-ink-50">
                <Image
                  src={coverImage}
                  alt="Cover"
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-ink-50 font-sans text-xs uppercase tracking-[0.1em] text-ink-400">
                No image
              </div>
            )}
            <div className="flex items-center gap-2 border-t border-ink-200 p-2">
              <button
                type="button"
                onClick={() => coverInput.current?.click()}
                disabled={uploading}
                className="flex-1 border border-ink px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] hover:border-brand-500 hover:text-brand-500 disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : coverImage ? 'Replace' : 'Upload'}
              </button>
              {coverImage ? (
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="border border-ink-200 px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 hover:border-brand-500 hover:text-brand-500"
                >
                  Remove
                </button>
              ) : null}
              <input
                ref={coverInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleCover(f);
                  if (e.target) e.target.value = '';
                }}
              />
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}
