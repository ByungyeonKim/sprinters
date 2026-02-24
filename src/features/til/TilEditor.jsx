import { Link } from 'react-router';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Heading2Icon,
  Heading3Icon,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  CodeXmlIcon,
  MinusIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { DEFAULT_CODE_LANGUAGE, normalizeCodeLanguage } from './code-languages';
import { CodeBlockExtension } from './CodeBlockExtension';

export function EditorHeader({ cancelTo, submitLabel, isSubmitting, onSave }) {
  return (
    <header className='sticky top-0 z-10 border-b border-gray-200 bg-white'>
      <div className='mx-auto flex h-14 max-w-300 items-center justify-between px-6'>
        <Link
          to={cancelTo}
          className='text-sm text-gray-500 hover:text-gray-900'
        >
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

function ToolbarButton({ onClick, active, tooltip, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type='button'
          onClick={onClick}
          className={`rounded p-1.5 ${
            active
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side='bottom' sideOffset={6}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <TooltipProvider>
      <div className='flex flex-wrap gap-1 border-b border-gray-100 pb-3'>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive('heading', { level: 2 })}
          tooltip='제목 2'
        >
          <Heading2Icon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive('heading', { level: 3 })}
          tooltip='제목 3'
        >
          <Heading3Icon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          tooltip='굵게'
        >
          <BoldIcon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          tooltip='기울임'
        >
          <ItalicIcon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          tooltip='취소선'
        >
          <StrikethroughIcon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          tooltip='글머리 기호'
        >
          <ListIcon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          tooltip='번호 매기기'
        >
          <ListOrderedIcon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          tooltip='인용'
        >
          <QuoteIcon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          tooltip='코드 블록'
        >
          <CodeXmlIcon className='size-4' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
          tooltip='구분선'
        >
          <MinusIcon className='size-4' />
        </ToolbarButton>
      </div>
    </TooltipProvider>
  );
}

export function TiptapEditor({ initialContent, onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockExtension.configure({
        languageClassPrefix: 'language-',
        defaultLanguage: DEFAULT_CODE_LANGUAGE,
        enableTabIndentation: true,
        tabSize: 2,
      }),
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
    ],
    content: initialContent || '',
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    onTransaction: ({ editor }) => {
      const activeLanguage = normalizeCodeLanguage(
        editor.getAttributes('codeBlock')?.language,
      );

      if (activeLanguage) {
        editor.storage.codeBlock.lastLanguage = activeLanguage;
      }
    },
  });

  return (
    <div className='mt-6 flex flex-1 flex-col'>
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className='prose mt-4 w-full max-w-none flex-1'
      />
    </div>
  );
}

export function FloatingTagInput({ tags, onTagsChange }) {
  return (
    <div className='mt-5 w-full max-w-4xl'>
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
