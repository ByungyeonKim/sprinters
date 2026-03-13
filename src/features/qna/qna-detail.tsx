import {
  Link,
  useLoaderData,
  useNavigate,
  data as routerData,
} from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  fetchQnaDetail,
  deleteQnaQuestion,
  formatQnaComment,
  addQnaLike,
  removeQnaLike,
} from './qna-service';
import { parseQnaContentToHtml, extractPlainText } from './qna-content';
import { highlightCodeBlocks } from '../../utils/shiki.server';
import { useAuth } from '../../hooks/use-auth';
import { useCodeCopy } from '../../hooks/use-code-copy';
import { LikeButton } from '../../components/LikeButton';
import { QnaCommentForm } from './QnaCommentForm';
import { QnaCommentList } from './QnaCommentList';
import { DeleteButton } from '../til/DeleteButton';
import { ChevronLeftIcon } from '../../components/icons';
import { createSupabaseServerClient } from '../../lib/supabase.server';
import type { Route } from './+types/qna-detail';

import { SITE_URL, OG_IMAGE, SITE_NAME } from '../../root';

type QnaCommentWithHtml = ReturnType<typeof formatQnaComment> & {
  contentHtml?: string;
};

type QnaDetailData = Omit<Awaited<ReturnType<typeof fetchQnaDetail>>, 'comments'> & {
  contentHtml?: string;
  comments: QnaCommentWithHtml[];
};

export function headers({ loaderHeaders, actionHeaders, parentHeaders }: Route.HeadersArgs) {
  const headers = new Headers(parentHeaders);
  [loaderHeaders, actionHeaders].forEach((headerSource) => {
    headerSource?.getSetCookie().forEach((cookie: string) => {
      headers.append('Set-Cookie', cookie);
    });
  });
  return headers;
}

export function meta({ data }: Route.MetaArgs) {
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

export async function loader({ request, params }: Route.LoaderArgs) {
  const { supabase: serverSupabase, headers } =
    createSupabaseServerClient(request);
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  const question = (await fetchQnaDetail(params.questionId)) as QnaDetailData;

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

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent !== 'create-comment') {
    return routerData(
      { intent, error: '지원하지 않는 요청입니다.' },
      { status: 400 },
    );
  }

  const { supabase: serverSupabase, headers } =
    createSupabaseServerClient(request);
  const {
    data: { user },
  } = await serverSupabase.auth.getUser();

  if (!user) {
    return routerData(
      { intent, error: '로그인이 필요합니다.' },
      { status: 401, headers },
    );
  }

  const rawContent = formData.get('content');
  const content = typeof rawContent === 'string' ? rawContent.trim() : '';

  if (!content) {
    return routerData(
      { intent, error: '댓글 내용을 입력해주세요.' },
      { status: 400, headers },
    );
  }

  const authorName = user.user_metadata?.user_name || user.user_metadata?.name;
  const avatar = user.user_metadata?.avatar_url;

  const { data: comment, error } = await serverSupabase
    .from('qna_comments')
    .insert({
      question_id: params.questionId,
      user_id: user.id,
      author_name: authorName,
      avatar,
      content,
    })
    .select('id, user_id, author_name, avatar, content, created_at')
    .single();

  if (error) {
    return routerData(
      { intent, error: '댓글 작성에 실패했습니다.' },
      { status: 500, headers },
    );
  }

  const formattedComment = formatQnaComment(comment) as QnaCommentWithHtml;
  formattedComment.contentHtml = await highlightCodeBlocks(
    parseQnaContentToHtml(formattedComment.content),
  );

  return routerData({ intent, comment: formattedComment }, { headers });
}

export default function QnaDetail() {
  const { question, hasLiked } = useLoaderData() as {
    question: QnaDetailData;
    hasLiked: boolean;
  };
  const navigate = useNavigate();
  const { user } = useAuth();
  const contentRef = useRef(null);
  const [comments, setComments] = useState(question.comments);
  useCodeCopy(contentRef, [question.contentHtml]);

  const isOwner = user?.id === question.userId;

  useEffect(() => {
    setComments(question.comments);
  }, [question]);

  const handleDelete = async () => {
    if (!user?.id) return;
    await deleteQnaQuestion(question.id, user.id);
    toast.success('질문이 삭제되었습니다.');
    navigate('/qna');
  };

  const handleCommentCreated = useCallback((comment: QnaCommentWithHtml) => {
    setComments((prev) => [comment, ...prev]);
  }, []);

  const handleCommentDeleted = useCallback((commentId: string) => {
    setComments((prev) =>
      prev.filter((comment) => comment.id !== commentId),
    );
  }, []);

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
            dangerouslySetInnerHTML={{ __html: question.contentHtml ?? '' }}
          />
        </article>

        <div className='mb-10 flex items-center gap-4 border-t border-b border-gray-200 py-4'>
          <LikeButton
            onLike={(userId: string) => addQnaLike({ questionId: question.id, userId })}
            onUnlike={(userId: string) => removeQnaLike({ questionId: question.id, userId })}
            initialCount={question.likes}
            initialHasLiked={hasLiked}
          />
        </div>

        <section>
          <h2 className='mb-6 text-lg font-bold'>
            댓글 {comments.length > 0 && comments.length}
          </h2>
          {user && (
            <QnaCommentForm
              questionId={question.id}
              onCommentCreated={handleCommentCreated}
            />
          )}
          <QnaCommentList
            comments={comments}
            onCommentDeleted={handleCommentDeleted}
          />
        </section>
      </div>
    </section>
  );
}
