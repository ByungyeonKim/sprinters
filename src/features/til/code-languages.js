export const SUPPORTED_CODE_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'shellscript', label: 'Shell' },
];

export const DEFAULT_CODE_LANGUAGE = 'javascript';

const LANGUAGE_ALIASES = {
  js: 'javascript',
  cjs: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  cts: 'typescript',
  mts: 'typescript',
  bash: 'shellscript',
  sh: 'shellscript',
  shell: 'shellscript',
  zsh: 'shellscript',
};

const SUPPORTED_LANGUAGE_VALUES = new Set(
  SUPPORTED_CODE_LANGUAGES.map((language) => language.value),
);

export function normalizeCodeLanguage(language) {
  if (typeof language !== 'string') return null;

  const normalized = language.trim().toLowerCase();
  if (!normalized) return null;

  const canonicalLanguage = LANGUAGE_ALIASES[normalized] ?? normalized;
  return SUPPORTED_LANGUAGE_VALUES.has(canonicalLanguage)
    ? canonicalLanguage
    : null;
}

export const SUPPORTED_CODE_LANGUAGE_VALUES = SUPPORTED_LANGUAGE_VALUES;
