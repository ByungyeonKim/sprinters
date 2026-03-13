import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import {
  DEFAULT_CODE_LANGUAGE,
  SUPPORTED_CODE_LANGUAGES,
  normalizeCodeLanguage,
} from './code-languages';

type CodeBlockNodeViewProps = {
  node: {
    attrs: {
      language?: string;
    };
  };
  updateAttributes: (attributes: { language: string }) => void;
  extension: {
    options: {
      supportedLanguages?: typeof SUPPORTED_CODE_LANGUAGES;
      defaultLanguage?: string;
      onLanguageChange?: (language: string) => void;
    };
    storage: {
      lastLanguage?: string;
    };
  };
};

export function CodeBlockNodeView({
  node,
  updateAttributes,
  extension,
}: CodeBlockNodeViewProps) {
  const supportedLanguages =
    extension.options.supportedLanguages || SUPPORTED_CODE_LANGUAGES;

  const currentLanguage =
    normalizeCodeLanguage(node.attrs.language) ||
    normalizeCodeLanguage(extension.storage.lastLanguage) ||
    normalizeCodeLanguage(extension.options.defaultLanguage) ||
    DEFAULT_CODE_LANGUAGE;

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = normalizeCodeLanguage(event.target.value);
    if (!language) return;

    updateAttributes({ language });
    extension.options.onLanguageChange?.(language);
  };

  return (
    <NodeViewWrapper className='not-prose my-4 overflow-hidden rounded-xl border border-[#1c2233] bg-[#05080f]'>
      <div className='flex items-center justify-between border-b border-[#1c2233] bg-[#0b1020] px-3 py-2'>
        <div className='flex items-center gap-3'>
          <select
            value={currentLanguage}
            onChange={handleLanguageChange}
            className='rounded border border-[#2a3148] bg-[#0f1528] px-2 py-1 text-xs text-gray-200 focus:border-[#6ea8ff] focus:outline-none'
            contentEditable={false}
            aria-label='코드 블록 언어'
          >
            {supportedLanguages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <pre className='m-0 overflow-x-auto bg-transparent px-4 py-3'>
        <NodeViewContent
          as={'code' as never}
          className='block min-h-6 font-mono text-sm leading-6 whitespace-pre text-[#d8deff] focus:outline-none'
        />
      </pre>
    </NodeViewWrapper>
  );
}
