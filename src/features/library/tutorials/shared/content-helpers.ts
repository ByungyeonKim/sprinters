import type { BoxType } from '../../library-types';

const LINK_SVG =
  '<svg class="heading-anchor-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';

export const h2 = (id: string, text: string) =>
  `<h2 id="${id}"><a href="#${id}" class="heading-anchor" aria-label="링크">${LINK_SVG}${text}</a></h2>`;

const BOX_COLORS: Record<BoxType, { bg: string; border: string }> = {
  info: { bg: '#f0f9ff', border: '#3b82f6' },
  warn: { bg: '#fffbeb', border: '#f59e0b' },
  neutral: { bg: '#f9fafb', border: '#6b7280' },
};

export const box = (type: BoxType, content: string) => {
  const c = BOX_COLORS[type];
  return `<div style="background:${c.bg};border-left:4px solid ${c.border};padding:0.75rem 1rem;border-radius:6px;margin:1rem 0;">
${content}
</div>`;
};

export const titleBox = (type: BoxType, title: string, body: string) => {
  const c = BOX_COLORS[type];
  return `<div style="background:${c.bg};border-left:4px solid ${c.border};padding:0.75rem 1rem;border-radius:6px;margin:1rem 0;">
<strong style="display:block;margin-bottom:0.35rem;">${title}</strong>
<span>${body}</span>
</div>`;
};
