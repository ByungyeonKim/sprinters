import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import {
  SUPPORTED_CODE_LANGUAGES,
  DEFAULT_CODE_LANGUAGE,
} from '../til/code-languages';

function CodeAttachModalInner({ onSubmit, initialLanguage, initialCode }) {
  const [language, setLanguage] = useState(
    initialLanguage || DEFAULT_CODE_LANGUAGE,
  );
  const [code, setCode] = useState(initialCode || '');

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;

      if (e.shiftKey) {
        const lineStart = code.lastIndexOf('\n', selectionStart - 1) + 1;
        if (code.startsWith('  ', lineStart)) {
          const newValue = code.slice(0, lineStart) + code.slice(lineStart + 2);
          setCode(newValue);
          const newPos = Math.max(lineStart, selectionStart - 2);
          requestAnimationFrame(() => {
            e.target.selectionStart = newPos;
            e.target.selectionEnd = newPos;
          });
        }
      } else {
        const newValue =
          code.slice(0, selectionStart) + '  ' + code.slice(selectionEnd);
        setCode(newValue);
        requestAnimationFrame(() => {
          e.target.selectionStart = selectionStart + 2;
          e.target.selectionEnd = selectionStart + 2;
        });
      }
    }
  };

  const handleSubmit = () => {
    if (!code.trim()) return;
    onSubmit({ language, code: code.trimEnd() });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>코드 첨부</DialogTitle>
      </DialogHeader>
      <div className='min-w-0 space-y-4'>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_CODE_LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className='overflow-hidden rounded-lg border border-gray-200 bg-gray-50 focus-within:border-gray-500'>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='코드를 입력하세요.'
            rows={10}
            className='max-h-80 w-full overflow-auto resize-none bg-transparent px-4 py-3 font-mono text-sm leading-relaxed focus:outline-none'
            spellCheck={false}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type='button'
          onClick={handleSubmit}
          disabled={!code.trim()}
        >
          첨부하기
        </Button>
      </DialogFooter>
    </>
  );
}

function CodeAttachModal({
  open,
  onOpenChange,
  onSubmit,
  initialLanguage,
  initialCode,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl overflow-hidden'>
        <CodeAttachModalInner
          key={open ? 'open' : 'closed'}
          onSubmit={onSubmit}
          initialLanguage={initialLanguage}
          initialCode={initialCode}
        />
      </DialogContent>
    </Dialog>
  );
}

export { CodeAttachModal };
