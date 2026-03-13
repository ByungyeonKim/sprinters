import type { DictionaryCategory, DictionaryTerm } from './library-types';
import { terms } from './tutorials/sprinter-dictionary/terms';

function buildDictionaryCategories(termItems: DictionaryTerm[]): DictionaryCategory[] {
  const categoryMap = new Map<string, DictionaryCategory>();

  for (const term of termItems) {
    if (!categoryMap.has(term.category)) {
      categoryMap.set(term.category, {
        value: term.category,
        label: term.categoryLabel,
        terms: [],
      });
    }

    categoryMap.get(term.category)!.terms.push(term);
  }

  return [...categoryMap.values()];
}

function getTermKeywords(term: DictionaryTerm): string[] {
  return term.termEn ? [term.termEn] : [];
}

function getShortTermDescription(term: DictionaryTerm, maxLength = 50): string {
  return term.description.length > maxLength
    ? `${term.description.slice(0, maxLength)}…`
    : term.description;
}

const dictionaryCategories = buildDictionaryCategories(terms);
const dictionaryFilters = [
  { label: '전체', value: 'all' },
  ...dictionaryCategories.map(({ label, value }) => ({ label, value })),
];

export {
  dictionaryCategories,
  dictionaryFilters,
  getShortTermDescription,
  getTermKeywords,
  terms,
};
