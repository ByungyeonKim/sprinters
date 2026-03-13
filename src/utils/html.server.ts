// @ts-expect-error -- sanitize-html has no type declarations
import sanitizeHtml from 'sanitize-html';

function mergeRelValues(rawRel = '') {
  const relValues = new Set(
    rawRel
      .split(/\s+/)
      .map((value: string) => value.trim().toLowerCase())
      .filter(Boolean),
  );

  relValues.add('noopener');
  relValues.add('noreferrer');

  return Array.from(relValues).join(' ');
}

export function sanitizeContent(html: string) {
  const defaultAnchorAttributes = sanitizeHtml.defaults.allowedAttributes.a || [];

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: [...new Set([...defaultAnchorAttributes, 'rel'])],
      img: ['src', 'alt'],
      code: ['class'],
    },
    allowedClasses: {
      code: [/^language-[a-z0-9-]+$/],
    },
    transformTags: {
      a(tagName: string, attribs: Record<string, string>) {
        if (attribs.target === '_blank') {
          return {
            tagName,
            attribs: {
              ...attribs,
              rel: mergeRelValues(attribs.rel),
            },
          };
        }

        return { tagName, attribs };
      },
    },
  });
}
