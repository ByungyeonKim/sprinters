import { remark } from 'remark';
import strip from 'strip-markdown';

const processor = remark().use(strip);

export function stripMarkdown(content) {
  if (!content) return '';
  return processor.processSync(content).toString().trim();
}
