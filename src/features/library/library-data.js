export const tutorials = [
  {
    slug: 'nextjs-basics',
    title: 'Next.js 기초',
    description:
      'Next.js의 핵심 개념과 App Router 기반 프로젝트 구조를 학습합니다.',
    difficulty: '입문',
    chapters: 4,
    totalSessions: 9,
  },
];

export const tutorialsBySlug = Object.fromEntries(
  tutorials.map((t) => [t.slug, t]),
);
