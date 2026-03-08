import { getRelativeTime } from '../../utils/date';
import * as repo from './qna-repository';

function formatQuestion(question) {
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

export function formatQnaComment(comment) {
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

export async function fetchQnaDetail(questionId) {
  const { data: question, error } = await repo.findQuestionDetail(questionId);

  if (error) {
    throw new Error('질문을 불러오는데 실패했습니다.');
  }

  const comments = (question.qna_comments || [])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(formatQnaComment);

  return { ...formatQuestion(question), comments };
}

export async function createQnaQuestion({ userId, content, authorName, avatar }) {
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

export async function deleteQnaQuestion(questionId, userId) {
  const { error } = await repo.deleteQuestion(questionId, userId);

  if (error) {
    throw new Error('질문 삭제에 실패했습니다.');
  }
}

export async function addQnaLike({ questionId, userId }) {
  const { error } = await repo.insertLike(questionId, userId);

  if (error) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
}

export async function removeQnaLike({ questionId, userId }) {
  const { error } = await repo.deleteLike(questionId, userId);

  if (error) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
}

export async function createQnaComment({ questionId, userId, authorName, avatar, content }) {
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

export async function deleteQnaComment(commentId, userId) {
  const { error } = await repo.deleteComment(commentId, userId);

  if (error) {
    throw new Error('댓글 삭제에 실패했습니다.');
  }
}
