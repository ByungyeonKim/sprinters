import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function formatContent(text) {
  return text.replace(/^(\[[ x]\])/gm, '- $1');
}

function MarkdownRenderer({ content }) {
  const formatted = formatContent(content);

  return <Markdown remarkPlugins={[remarkGfm]}>{formatted}</Markdown>;
}

export { MarkdownRenderer };
