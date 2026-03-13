import { memo } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { SUPPORTED_CODE_LANGUAGES } from '../til/code-languages';

const LANGUAGE_LABELS = Object.fromEntries(
  SUPPORTED_CODE_LANGUAGES.map((lang) => [lang.value, lang.label]),
);

type CodeAttachPreviewProps = {
  index: number;
  codeBlock: {
    language: string;
    code: string;
    previewLines?: string;
  };
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
};

const CodeAttachPreview = memo(function CodeAttachPreview({
  index,
  codeBlock,
  onEdit,
  onDelete,
}: CodeAttachPreviewProps) {
  const label = LANGUAGE_LABELS[codeBlock.language] || codeBlock.language;
  const previewLines =
    codeBlock.previewLines ??
    codeBlock.code.split('\n').slice(0, 5).join('\n');

  return (
    <div className='rounded-lg border border-gray-200 bg-gray-50'>
      <div className='flex items-center justify-between border-b border-gray-200 px-3 py-2'>
        <span className='text-xs font-medium text-gray-500'>{label}</span>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            onClick={() => onEdit(index)}
            className='rounded p-1 text-gray-400 transition-colors hover:text-gray-600'
            title='수정'
          >
            <Pencil className='h-3.5 w-3.5' />
          </button>
          <button
            type='button'
            onClick={() => onDelete(index)}
            className='rounded p-1 text-gray-400 transition-colors hover:text-red-500'
            title='삭제'
          >
            <Trash2 className='h-3.5 w-3.5' />
          </button>
        </div>
      </div>
      <pre className='overflow-hidden px-3 py-2 font-mono text-xs leading-relaxed text-gray-700'>
        {previewLines}
      </pre>
    </div>
  );
});

export { CodeAttachPreview };
