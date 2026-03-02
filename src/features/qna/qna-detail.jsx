import {
  Link,
  useLoaderData,
  useNavigate,
  data as routerData,
} from 'react-router';
import { useRef } from 'react';
import { toast } from 'sonner';
import { fetchQnaDetail, deleteQnaQuestion } from './qna-service';
import { parseQnaContentToHtml, extractPlainText } from './qna-content';
import { highlightCodeBlocks } from '../../utils/shiki.server';
import { useAuth } from '../../hooks/use-auth';
import { useCodeCopy } from '../../hooks/use-code-copy';
import { QnaLikeButton } from './QnaLikeButton';
import { QnaCommentForm } from './QnaCommentForm';
import { QnaCommentList } from './QnaCommentList';
import { DeleteButton } from '../til/DeleteButton';
import { ChevronLeftIcon } from '../../components/icons';
import { createSupabaseServerClient } from '../../lib/supabase.server';

import { SITE_URL, OG_IMAGE, SITE_NAME } from '../../root';

export function headers({ loaderHeaders, parentHeaders }) {
  const headers = new Headers(parentHeaders);
  loaderHeaders.getSetCookie().forEach((cookie) => {
    headers.append('Set-Cookie', cookie);
  });
  return headers;
}

export function meta({ data }) {
  if (!data?.question) {
    return [{ title: SITE_NAME }];
  }
  const { question } = data;
  const title = `${question.authorName}의 질문 | Sprinters Q&A`;
  const description = extractPlainText(question.content).slice(0, 100);
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `${SITE_URL}/qna/${question.id}` },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:site_name', content: SITE_NAME },
  ];
}

export async function loader({ request, params }) {
  const { supabase: serverSupabase, headers } =
    createSupabaseServerClient(request);
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  const question = await fetchQnaDetail(params.questionId);

  question.contentHtml = await highlightCodeBlocks(
    parseQnaContentToHtml(question.content),
  );

  await Promise.all(
    question.comments.map(async (comment) => {
      comment.contentHtml = await highlightCodeBlocks(
        parseQnaContentToHtml(comment.content),
      );
    }),
  );

  let hasLiked = false;
  if (user) {
    const { data: likeData } = await serverSupabase
      .from('qna_likes')
      .select('id')
      .eq('question_id', question.id)
      .eq('user_id', user.id)
      .maybeSingle();
    hasLiked = Boolean(likeData);
  }

  return routerData({ question, hasLiked }, { headers });
}

export default function QnaDetail() {
  const { question, hasLiked } = useLoaderData();
  const navigate = useNavigate();
  const { user } = useAuth();
  const contentRef = useRef(null);
  useCodeCopy(contentRef, [question.contentHtml]);

  const isOwner = user?.id === question.userId;

  const handleDelete = async () => {
    await deleteQnaQuestion(question.id, user.id);
    toast.success('질문이 삭제되었습니다.');
    navigate('/qna');
  };

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <Link
          to='/qna'
          className='mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900'
        >
          <ChevronLeftIcon />
          목록으로
        </Link>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img
              src={question.avatar}
              alt={question.authorName}
              className='h-10 w-10 rounded-full border border-gray-300 object-cover'
            />
            <div>
              <p className='text-sm font-medium'>{question.authorName}</p>
              <p className='text-sm text-gray-500'>{question.date}</p>
            </div>
          </div>
          {isOwner && (
            <DeleteButton
              onDelete={handleDelete}
              title='질문을 삭제하시겠어요?'
              description='질문과 관련 댓글이 모두 삭제됩니다.'
            />
          )}
        </div>
      </header>

      <div ref={contentRef}>
        <article className='mb-10'>
          <div
            className='qna-content leading-relaxed text-gray-800'
            dangerouslySetInnerHTML={{ __html: question.contentHtml }}
          />
        </article>

        <div className='mb-10 flex items-center gap-4 border-t border-b border-gray-200 py-4'>
          <QnaLikeButton
            questionId={question.id}
            initialCount={question.likes}
            initialHasLiked={hasLiked}
          />
        </div>

        <section>
          <h2 className='mb-6 text-lg font-bold'>
            댓글 {question.comments.length > 0 && question.comments.length}
          </h2>
          {user && <QnaCommentForm questionId={question.id} />}
          <QnaCommentList comments={question.comments} />
        </section>
      </div>
    </section>
  );
}
