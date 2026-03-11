import { highlightCodeBlocks } from '../../utils/shiki.server';

export async function loader({ params, request }) {
  const { slug } = params;
  const url = new URL(request.url);
  const stepIndex = Number(url.searchParams.get('step'));

  const mod = await import(`./tutorials/${slug}.js`);
  const tutorial = mod.default;
  const flatSessions = tutorial.chapters?.flatMap((ch) => ch.sessions) ?? [];

  const session = flatSessions[stepIndex];
  if (!session) {
    throw new Response('Not Found', { status: 404 });
  }

  const highlighted = await highlightCodeBlocks(session.content);
  return Response.json({ highlighted });
}
