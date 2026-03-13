import CodeBlock, { type CodeBlockOptions } from '@tiptap/extension-code-block';
import { TextSelection } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CodeBlockNodeView } from './CodeBlockNodeView';
import {
  DEFAULT_CODE_LANGUAGE,
  SUPPORTED_CODE_LANGUAGES,
  normalizeCodeLanguage,
} from './code-languages';

type CodeBlockAttributes = {
  language?: string;
  [key: string]: unknown;
};

type CodeBlockExtensionOptions = CodeBlockOptions & {
  supportedLanguages: typeof SUPPORTED_CODE_LANGUAGES;
  onLanguageChange?: (language: string) => void;
};

type CodeBlockExtensionStorage = {
  lastLanguage: string;
};

function resolveDefaultLanguage(lastLanguage: unknown, fallbackLanguage: unknown) {
  return (
    normalizeCodeLanguage(lastLanguage) ||
    normalizeCodeLanguage(fallbackLanguage) ||
    DEFAULT_CODE_LANGUAGE
  );
}

function resolveCodeLanguage(attributes: CodeBlockAttributes | undefined, lastLanguage: unknown, fallbackLanguage: unknown) {
  const attributeLanguage = normalizeCodeLanguage(attributes?.language);
  if (attributeLanguage) return attributeLanguage;
  return resolveDefaultLanguage(lastLanguage, fallbackLanguage);
}

export const CodeBlockExtension = CodeBlock.extend<CodeBlockExtensionOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: DEFAULT_CODE_LANGUAGE,
      languageClassPrefix: 'language-',
      supportedLanguages: SUPPORTED_CODE_LANGUAGES,
      onLanguageChange: undefined,
    } as CodeBlockExtensionOptions;
  },

  addStorage() {
    return {
      lastLanguage: resolveDefaultLanguage(
        null,
        (this.options as unknown as CodeBlockExtensionOptions).defaultLanguage,
      ),
    };
  },

  addCommands() {
    return {
      setCodeBlock:
        (attributes: CodeBlockAttributes = {}) =>
        ({ commands }) => {
          const storage = this.storage as CodeBlockExtensionStorage;
          const options = this.options as unknown as CodeBlockExtensionOptions;
          const language = resolveCodeLanguage(
            attributes,
            storage.lastLanguage,
            options.defaultLanguage,
          );

          storage.lastLanguage = language;
          options.onLanguageChange?.(language);
          return commands.setNode(this.name, { ...attributes, language });
        },
      toggleCodeBlock:
        (attributes: CodeBlockAttributes = {}) =>
        ({ commands, editor }) => {
          const storage = this.storage as CodeBlockExtensionStorage;
          const options = this.options as unknown as CodeBlockExtensionOptions;
          if (editor.isActive(this.name)) {
            return commands.toggleNode(this.name, 'paragraph');
          }

          const language = resolveCodeLanguage(
            attributes,
            storage.lastLanguage,
            options.defaultLanguage,
          );

          storage.lastLanguage = language;
          options.onLanguageChange?.(language);
          return commands.toggleNode(this.name, 'paragraph', {
            ...attributes,
            language,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockNodeView);
  },

  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      'Mod-a': ({ editor }) => {
        const { selection } = editor.state;
        const { $from, $to } = selection;

        if ($from.parent.type !== this.type || $to.parent.type !== this.type) {
          return false;
        }

        const from = $from.start();
        const to = $from.end();

        if (selection.from === from && selection.to === to) {
          return true;
        }

        return editor.commands.command(({ tr }) => {
          tr.setSelection(TextSelection.create(tr.doc, from, to));
          return true;
        });
      },
    };
  },
});
