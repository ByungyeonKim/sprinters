const tutorialLoaders = {
  'nextjs-basics': () => import('./tutorials/nextjs-basics/index.js'),
  'sprinter-dictionary': () => import('./tutorials/sprinter-dictionary/index.js'),
};

export async function loadTutorial(slug) {
  const load = tutorialLoaders[slug];

  if (!load) {
    return null;
  }

  const mod = await load();
  return mod.default;
}
