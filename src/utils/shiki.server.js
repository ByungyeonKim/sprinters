import { createHighlighter } from 'shiki';
import {
  DEFAULT_CODE_LANGUAGE,
  SUPPORTED_CODE_LANGUAGES,
  normalizeCodeLanguage,
} from '../features/til/code-languages';

const SHIKI_THEME = 'aurora-x';
const LANGUAGE_CLASS_PREFIX = 'language-';
const CODE_LANGUAGE_LABELS = Object.fromEntries(
  SUPPORTED_CODE_LANGUAGES.map((language) => [language.value, language.label]),
);

let highlighterPromise;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME],
      langs: SUPPORTED_CODE_LANGUAGES.map((language) => language.value),
    });
  }

  return highlighterPromise;
}

function decodeHtmlEntities(text) {
  const decodeCodePoint = (rawCode, radix, fallback) => {
    const parsed = Number.parseInt(rawCode, radix);

    if (Number.isNaN(parsed)) {
      return fallback;
    }

    try {
      return String.fromCodePoint(parsed);
    } catch {
      return fallback;
    }
  };

  return text
    .replace(/&#x([0-9a-f]+);/gi, (fullMatch, code) =>
      decodeCodePoint(code, 16, fullMatch),
    )
    .replace(/&#([0-9]+);/g, (fullMatch, code) =>
      decodeCodePoint(code, 10, fullMatch),
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#x27;/gi, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function getCodeClassValue(codeAttributes) {
  const classMatch = codeAttributes.match(
    /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i,
  );

  return classMatch?.[1] || classMatch?.[2] || classMatch?.[3] || '';
}

function resolveCodeLanguage(codeAttributes) {
  const classValue = getCodeClassValue(codeAttributes);
  if (!classValue) return DEFAULT_CODE_LANGUAGE;

  const languageClassName = classValue
    .split(/\s+/)
    .find((className) => className.startsWith(LANGUAGE_CLASS_PREFIX));

  if (!languageClassName) return DEFAULT_CODE_LANGUAGE;

  const rawLanguage = languageClassName.slice(LANGUAGE_CLASS_PREFIX.length);
  return normalizeCodeLanguage(rawLanguage);
}

function escapeHtmlAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function withCodeLanguageMeta(highlightedCode, language) {
  const label = CODE_LANGUAGE_LABELS[language] || language;

  return highlightedCode.replace(
    /<pre\b/,
    `<pre data-code-language="${escapeHtmlAttribute(language)}" data-code-language-label="${escapeHtmlAttribute(label)}"`,
  );
}

export async function highlightCodeBlocks(html) {
  if (typeof html !== 'string' || !html.includes('<pre')) {
    return html ?? '';
  }

  const highlighter = await getHighlighter();
  const codeBlockRegex = /<pre\b[^>]*>\s*<code\b([^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/gi;

  let output = '';
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(html)) !== null) {
    const [fullMatch, codeAttributes = '', encodedCode = ''] = match;

    output += html.slice(lastIndex, match.index);

    const language = resolveCodeLanguage(codeAttributes);
    if (!language) {
      output += fullMatch;
      lastIndex = codeBlockRegex.lastIndex;
      continue;
    }

    const code = decodeHtmlEntities(encodedCode);
    const highlightedCode = highlighter.codeToHtml(code, {
      lang: language,
      theme: SHIKI_THEME,
    });

    output += withCodeLanguageMeta(highlightedCode, language);
    lastIndex = codeBlockRegex.lastIndex;
  }

  output += html.slice(lastIndex);
  return output;
}
