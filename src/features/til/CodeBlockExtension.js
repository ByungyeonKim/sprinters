import CodeBlock from '@tiptap/extension-code-block';
import { TextSelection } from '@tiptap/pm/state';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CodeBlockNodeView } from './CodeBlockNodeView';
import {
  DEFAULT_CODE_LANGUAGE,
  SUPPORTED_CODE_LANGUAGES,
  normalizeCodeLanguage,
} from './code-languages';

function resolveDefaultLanguage(lastLanguage, fallbackLanguage) {
  return (
    normalizeCodeLanguage(lastLanguage) ||
    normalizeCodeLanguage(fallbackLanguage) ||
    DEFAULT_CODE_LANGUAGE
  );
}

function resolveCodeLanguage(attributes, lastLanguage, fallbackLanguage) {
  const attributeLanguage = normalizeCodeLanguage(attributes?.language);
  if (attributeLanguage) return attributeLanguage;
  return resolveDefaultLanguage(lastLanguage, fallbackLanguage);
}

export const CodeBlockExtension = CodeBlock.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: DEFAULT_CODE_LANGUAGE,
      languageClassPrefix: 'language-',
      supportedLanguages: SUPPORTED_CODE_LANGUAGES,
      onLanguageChange: undefined,
    };
  },

  addStorage() {
    return {
      lastLanguage: resolveDefaultLanguage(
        null,
        this.options.defaultLanguage,
      ),
    };
  },

  addCommands() {
    return {
      setCodeBlock:
        (attributes = {}) =>
        ({ commands }) => {
          const language = resolveCodeLanguage(
            attributes,
            this.storage.lastLanguage,
            this.options.defaultLanguage,
          );

          this.storage.lastLanguage = language;
          this.options.onLanguageChange?.(language);
          return commands.setNode(this.name, { ...attributes, language });
        },
      toggleCodeBlock:
        (attributes = {}) =>
        ({ commands, editor }) => {
          if (editor.isActive(this.name)) {
            return commands.toggleNode(this.name, 'paragraph');
          }

          const language = resolveCodeLanguage(
            attributes,
            this.storage.lastLanguage,
            this.options.defaultLanguage,
          );

          this.storage.lastLanguage = language;
          this.options.onLanguageChange?.(language);
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
