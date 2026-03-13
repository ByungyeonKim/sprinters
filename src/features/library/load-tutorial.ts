import type { Tutorial } from './library-types';

const tutorialLoaders: Record<string, (() => Promise<{ default: Tutorial }>) | undefined> = {
  'nextjs-basics': () => import('./tutorials/nextjs-basics/index'),
  'sprinter-dictionary': () => import('./tutorials/sprinter-dictionary/index'),
};

export async function loadTutorial(slug: string): Promise<Tutorial | null> {
  const load = tutorialLoaders[slug];

  if (!load) {
    return null;
  }

  const mod = await load();
  return mod.default;
}
