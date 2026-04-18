'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import BlogForm from '@/components/BlogForm';
import { api } from '@/lib/api';
import type { Blog } from '@/lib/types';

export default function EditPage() {
  return (
    <RequireAuth>
      <Edit />
    </RequireAuth>
  );
}

function Edit() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { blog } = await api.myBlog(params.id);
      setInitial(blog);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) {
    return (
      <section className="container-news py-24 text-center">
        <span className="kicker">Error</span>
        <p className="mt-4 font-serif text-2xl">{error}</p>
      </section>
    );
  }
  if (!initial) {
    return (
      <div className="container-news py-24 text-center font-sans text-sm uppercase tracking-[0.1em] text-ink-400">
        Loading…
      </div>
    );
  }

  return (
    <section className="container-news py-10">
      <div className="mb-8 border-b-2 border-ink pb-4">
        <span className="kicker">Edit</span>
        <h1 className="mt-2 font-serif text-5xl font-black tracking-tight text-ink">
          Edit story
        </h1>
      </div>

      <BlogForm
        initial={initial}
        submitLabel="Save changes"
        onSubmit={async (payload) => {
          const { blog } = await api.updateBlog(initial._id, payload);
          if (blog.status === 'published') {
            router.replace(`/blog/${blog.slug}`);
          } else {
            router.replace('/dashboard');
          }
        }}
      />
    </section>
  );
}
