'use client';

import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import BlogForm from '@/components/BlogForm';
import { api } from '@/lib/api';

export default function WritePage() {
  return (
    <RequireAuth>
      <Write />
    </RequireAuth>
  );
}

function Write() {
  const router = useRouter();

  return (
    <section className="container-news py-10">
      <div className="mb-8 border-b-2 border-ink pb-4">
        <span className="kicker">Compose</span>
        <h1 className="mt-2 font-serif text-5xl font-black tracking-tight text-ink">
          Write a story
        </h1>
      </div>

      <BlogForm
        submitLabel="Publish"
        onSubmit={async (payload) => {
          const { blog } = await api.createBlog(payload);
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
