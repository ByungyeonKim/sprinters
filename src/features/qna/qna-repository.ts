import { supabase } from '../../lib/supabase';

const listQuery = `
  id,
  user_id,
  content,
  author_name,
  avatar,
  created_at,
  qna_likes (count),
  qna_comments (id)
`;

const detailQuery = `
  id,
  user_id,
  content,
  author_name,
  avatar,
  created_at,
  qna_likes (count),
  qna_comments (
    id,
    user_id,
    author_name,
    avatar,
    content,
    created_at
  )
`;

// qna_questions
export function findQuestions() {
  return supabase
    .from('qna_questions')
    .select(listQuery)
    .order('created_at', { ascending: false });
}

export function findQuestionDetail(questionId: string) {
  return supabase
    .from('qna_questions')
    .select(detailQuery)
    .eq('id', questionId)
    .single();
}

export function insertQuestion({ userId, content, authorName, avatar }: {
  userId: string;
  content: string;
  authorName: string;
  avatar: string;
}) {
  return supabase
    .from('qna_questions')
    .insert({ user_id: userId, content, author_name: authorName, avatar })
    .select('id')
    .single();
}

export function deleteQuestion(questionId: string, userId: string) {
  return supabase
    .from('qna_questions')
    .delete()
    .eq('id', questionId)
    .eq('user_id', userId);
}

// qna_likes
export function findUserLike(questionId: string, userId: string) {
  return supabase
    .from('qna_likes')
    .select('id')
    .eq('question_id', questionId)
    .eq('user_id', userId)
    .maybeSingle();
}

export function insertLike(questionId: string, userId: string) {
  return supabase
    .from('qna_likes')
    .insert({ question_id: questionId, user_id: userId });
}

export function deleteLike(questionId: string, userId: string) {
  return supabase
    .from('qna_likes')
    .delete()
    .eq('question_id', questionId)
    .eq('user_id', userId);
}

// qna_comments
export function insertComment({ questionId, userId, authorName, avatar, content }: {
  questionId: string;
  userId: string;
  authorName: string;
  avatar: string;
  content: string;
}) {
  return supabase
    .from('qna_comments')
    .insert({
      question_id: questionId,
      user_id: userId,
      author_name: authorName,
      avatar,
      content,
    })
    .select('id')
    .single();
}

export function deleteComment(commentId: string, userId: string) {
  return supabase
    .from('qna_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);
}
