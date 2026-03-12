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

const TOOLBAR_ITEMS = [
  { icon: Heading2Icon, run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (e) => e.isActive('heading', { level: 2 }), tooltip: '제목 2' },
  { icon: Heading3Icon, run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (e) => e.isActive('heading', { level: 3 }), tooltip: '제목 3' },
  { icon: BoldIcon, run: (e) => e.chain().focus().toggleBold().run(), isActive: (e) => e.isActive('bold'), tooltip: '굵게' },
  { icon: ItalicIcon, run: (e) => e.chain().focus().toggleItalic().run(), isActive: (e) => e.isActive('italic'), tooltip: '기울임' },
  { icon: StrikethroughIcon, run: (e) => e.chain().focus().toggleStrike().run(), isActive: (e) => e.isActive('strike'), tooltip: '취소선' },
  { icon: ListIcon, run: (e) => e.chain().focus().toggleBulletList().run(), isActive: (e) => e.isActive('bulletList'), tooltip: '글머리 기호' },
  { icon: ListOrderedIcon, run: (e) => e.chain().focus().toggleOrderedList().run(), isActive: (e) => e.isActive('orderedList'), tooltip: '번호 매기기' },
  { icon: QuoteIcon, run: (e) => e.chain().focus().toggleBlockquote().run(), isActive: (e) => e.isActive('blockquote'), tooltip: '인용' },
  { icon: CodeXmlIcon, run: (e) => e.chain().focus().toggleCodeBlock().run(), isActive: (e) => e.isActive('codeBlock'), tooltip: '코드 블록' },
  { icon: MinusIcon, run: (e) => e.chain().focus().setHorizontalRule().run(), isActive: () => false, tooltip: '구분선' },
];

function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <TooltipProvider>
      <div className='flex flex-wrap gap-1 border-b border-gray-100 pb-3'>
        {TOOLBAR_ITEMS.map((item) => (
          <ToolbarButton
            key={item.tooltip}
            onClick={() => item.run(editor)}
            active={item.isActive(editor)}
            tooltip={item.tooltip}
          >
            <item.icon className='size-4' />
          </ToolbarButton>
        ))}
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
