'use client';

import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { useCallback, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function Editor({ value, onChange, placeholder = 'Begin writing your story…' }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      ImageExt.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-news focus:outline-none min-h-[420px]',
      },
    },
  });

  const lastValue = useRef(value);
  useEffect(() => {
    if (!editor) return;
    if (value !== lastValue.current && value !== editor.getHTML()) {
      lastValue.current = value;
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return <div className="min-h-[420px] rounded-none border border-ink-100" />;

  return (
    <div>
      <Toolbar editor={editor} />
      <div className="rounded-none border border-ink-100 border-t-0 p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: TiptapEditor }) {
  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleImage = useCallback(async (file: File) => {
    try {
      const { url } = await api.uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      alert((err as Error).message || 'Upload failed');
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('URL', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const Btn = ({
    active,
    disabled,
    onClick,
    children,
    title,
  }: {
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`h-9 min-w-9 px-2 font-sans text-sm font-semibold transition-colors disabled:opacity-40 ${
        active ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-ink-50'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 border border-ink-100 bg-ink-50 p-1">
      <div className="flex items-center gap-1 border-r border-ink-200 pr-1">
        <Btn
          title="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Btn>
        <Btn
          title="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Btn>
        <Btn
          title="Paragraph"
          active={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          ¶
        </Btn>
      </div>

      <div className="flex items-center gap-1 border-r border-ink-200 pr-1">
        <Btn
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </Btn>
        <Btn
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </Btn>
        <Btn
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </Btn>
        <Btn
          title="Strike"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <s>S</s>
        </Btn>
        <Btn
          title="Inline code"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {'<>'}
        </Btn>
      </div>

      <div className="flex items-center gap-1 border-r border-ink-200 pr-1">
        <Btn
          title="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Btn>
        <Btn
          title="Ordered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Btn>
        <Btn
          title="Blockquote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </Btn>
        <Btn
          title="Code block"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {'{…}'}
        </Btn>
        <Btn
          title="Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </Btn>
      </div>

      <div className="flex items-center gap-1 border-r border-ink-200 pr-1">
        <Btn
          title="Align left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          ⇤
        </Btn>
        <Btn
          title="Align center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          ≡
        </Btn>
        <Btn
          title="Align right"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          ⇥
        </Btn>
      </div>

      <div className="flex items-center gap-1">
        <Btn title="Insert link" onClick={addLink} active={editor.isActive('link')}>
          Link
        </Btn>
        <Btn title="Insert image" onClick={() => fileInput.current?.click()}>
          Image
        </Btn>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleImage(f);
            if (e.target) e.target.value = '';
          }}
        />
        <Btn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </Btn>
        <Btn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </Btn>
      </div>
    </div>
  );
}
