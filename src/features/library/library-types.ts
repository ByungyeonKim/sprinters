import type { ReactNode, RefObject } from 'react';

export type LibraryStep = {
  title: string;
};

export type LibraryChapter = {
  title: string;
  startIndex: number;
  count: number;
  locked?: boolean;
};

export type LibraryStepChangeHandler = (nextStep: number) => void;

export type LibraryHeaderProps = {
  title: string;
  children?: ReactNode;
};

export type LibrarySession = {
  title: string;
  content: string;
};

export type TutorialChapter = {
  title: string;
  sessions: LibrarySession[];
  locked?: boolean;
};

export type Tutorial = {
  slug: string;
  title: string;
  chapters?: TutorialChapter[];
};

export type TutorialMeta = {
  slug: string;
  title: string;
  description: string;
  difficulty?: string;
  chapters?: number;
  totalSessions?: number;
  totalTerms?: number;
};

export type HighlightedStepContents = Record<number, string>;

export type DictionaryTerm = {
  term: string;
  termEn: string | null;
  description: string;
  category: string;
  categoryLabel: string;
};

export type DictionaryCategory = {
  value: string;
  label: string;
  terms: DictionaryTerm[];
};

export type DictionaryFilter = {
  label: string;
  value: string;
};

export type UseStepTransitionOptions = {
  currentStep: number;
  maxStep: number;
  ensureStepReady: (stepIndex: number) => Promise<boolean>;
  onStepUrlChange: (nextStep: number, options?: { replace?: boolean }) => void;
  scrollContainerRef: RefObject<HTMLElement | null>;
};

export type UseHighlightedLibraryStepsOptions = {
  slug: string;
  initialHighlightedStepContents: HighlightedStepContents;
  deferredStepIndices: number[];
  deferredHighlightedStepContentsPromise: Promise<HighlightedStepContents> | null;
};

export type BoxType = 'info' | 'warn' | 'neutral';
