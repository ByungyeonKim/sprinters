import type { CodeBlock } from './use-code-attachment';

const CODE_FENCE_REGEX = /^```(\w+)\n([\s\S]*?)^```$/gm;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function serializeQnaContent(text: string, codeBlocks: CodeBlock[]): string {
  if (!codeBlocks?.length) return text;

  const parts = [text];

  for (const block of codeBlocks) {
    parts.push(`\`\`\`${block.language}\n${block.code}\n\`\`\``);
  }

  return parts.join('\n\n');
}

export function parseQnaContentToHtml(content: string): string {
  if (!content) return '';

  const segments = [];
  let lastIndex = 0;

  const regex = new RegExp(CODE_FENCE_REGEX.source, 'gm');
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) {
        segments.push(
          `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`,
        );
      }
    }

    const language = escapeHtml(match[1]);
    const code = escapeHtml(match[2]);
    segments.push(
      `<pre><code class="language-${language}">${code}</code></pre>`,
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim();
    if (text) {
      segments.push(
        `<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`,
      );
    }
  }

  return segments.join('');
}

export function extractPlainText(content: string): string {
  if (!content) return '';
  return content.replace(CODE_FENCE_REGEX, '').trim();
}

export function hasCodeBlock(content: string): boolean {
  if (!content) return false;
  const regex = new RegExp(CODE_FENCE_REGEX.source, 'gm');
  return regex.test(content);
}
