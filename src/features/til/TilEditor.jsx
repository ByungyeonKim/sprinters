import { Link } from 'react-router';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export function EditorHeader({ cancelTo, submitLabel, isSubmitting, onSave }) {
  return (
    <header className='sticky top-0 z-10 border-b border-gray-200 bg-white'>
      <div className='mx-auto flex h-14 max-w-300 items-center justify-between px-6'>
        <Link to={cancelTo} className='text-sm text-gray-500 hover:text-gray-900'>
          취소
        </Link>
        <button
          type='button'
          disabled={isSubmitting}
          onClick={onSave}
          className='rounded bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </button>
      </div>
    </header>
  );
}

function ToolbarButton({ onClick, active, children }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className='flex flex-wrap gap-1 border-b border-gray-100 pb-3'>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        Bold
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        Italic
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
      >
        Strike
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        Bullet
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >
        Ordered
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
      >
        Quote
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
      >
        Code
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        active={false}
      >
        HR
      </ToolbarButton>
    </div>
  );
}

export function TiptapEditor({ initialContent, onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
    ],
    content: initialContent || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  return (
    <div className='mt-6 flex flex-1 flex-col'>
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className='prose mt-4 flex-1 w-full max-w-none'
      />
    </div>
  );
}

export function FloatingTagInput({ tags, onTagsChange }) {
  return (
    <div className='fixed bottom-4 left-1/2 w-full max-w-4xl -translate-x-1/2 px-6'>
      <div className='rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg'>
        <input
          type='text'
          id='tags'
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          autoComplete='off'
          placeholder='태그를 입력하세요 (쉼표로 구분)'
          className='w-full border-none text-sm text-gray-500 placeholder:text-gray-300 focus:outline-none'
        />
      </div>
    </div>
  );
}
