import { highlightCodeBlocks } from '../../utils/shiki.server';
import { loadTutorial } from './load-tutorial';

export async function loader({ params, request }) {
  const { slug } = params;
  const url = new URL(request.url);
  const stepIndex = Number(url.searchParams.get('step'));

  const tutorial = await loadTutorial(slug);
  if (!tutorial) {
    throw new Response('Not Found', { status: 404 });
  }

  const flatSessions = tutorial.chapters?.flatMap((ch) => ch.sessions) ?? [];

  const session = flatSessions[stepIndex];
  if (!session) {
    throw new Response('Not Found', { status: 404 });
  }

  const highlighted = await highlightCodeBlocks(session.content);
  return Response.json({ highlighted });
}
