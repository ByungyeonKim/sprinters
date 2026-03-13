import { getRelativeTime } from '../../utils/date';
import * as repo from './qna-repository';

type RawQuestion = {
  id: string;
  user_id: string;
  content: string;
  author_name: string;
  avatar: string;
  created_at: string;
  qna_likes: { count: number }[];
  qna_comments: RawComment[] | { id: string }[];
};

type RawComment = {
  id: string;
  user_id: string;
  author_name: string;
  avatar: string;
  content: string;
  created_at: string;
};

function formatQuestion(question: RawQuestion) {
  return {
    id: question.id,
    userId: question.user_id,
    content: question.content,
    authorName: question.author_name,
    avatar: question.avatar,
    date: getRelativeTime(question.created_at),
    likes: question.qna_likes[0]?.count || 0,
    comments: question.qna_comments?.length || 0,
  };
}

export function formatQnaComment(comment: RawComment) {
  return {
    id: comment.id,
    userId: comment.user_id,
    author: comment.author_name,
    avatar: comment.avatar,
    content: comment.content,
    date: getRelativeTime(comment.created_at),
  };
}

export async function fetchQnaQuestions() {
  const { data: questions, error } = await repo.findQuestions();

  if (error) {
    throw new Error('Q&A 데이터를 불러오는데 실패했습니다.');
  }

  return questions.map(formatQuestion);
}

export async function fetchQnaDetail(questionId: string) {
  const { data: question, error } = await repo.findQuestionDetail(questionId);

  if (error) {
    throw new Error('질문을 불러오는데 실패했습니다.');
  }

  const comments = (question.qna_comments || [])
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .map(formatQnaComment);

  return { ...formatQuestion(question), comments };
}

export async function createQnaQuestion({ userId, content, authorName, avatar }: {
  userId: string;
  content: string;
  authorName: string;
  avatar: string;
}) {
  const { data, error } = await repo.insertQuestion({
    userId,
    content,
    authorName,
    avatar,
  });

  if (error) {
    throw new Error('질문 작성에 실패했습니다.');
  }

  return data.id;
}

export async function deleteQnaQuestion(questionId: string, userId: string) {
  const { error } = await repo.deleteQuestion(questionId, userId);

  if (error) {
    throw new Error('질문 삭제에 실패했습니다.');
  }
}

export async function addQnaLike({ questionId, userId }: { questionId: string; userId: string }) {
  const { error } = await repo.insertLike(questionId, userId);

  if (error) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
}

export async function removeQnaLike({ questionId, userId }: { questionId: string; userId: string }) {
  const { error } = await repo.deleteLike(questionId, userId);

  if (error) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
}

export async function createQnaComment({ questionId, userId, authorName, avatar, content }: {
  questionId: string;
  userId: string;
  authorName: string;
  avatar: string;
  content: string;
}) {
  const { data, error } = await repo.insertComment({
    questionId,
    userId,
    authorName,
    avatar,
    content,
  });

  if (error) {
    throw new Error('댓글 작성에 실패했습니다.');
  }

  return data.id;
}

export async function deleteQnaComment(commentId: string, userId: string) {
  const { error } = await repo.deleteComment(commentId, userId);

  if (error) {
    throw new Error('댓글 삭제에 실패했습니다.');
  }
}
