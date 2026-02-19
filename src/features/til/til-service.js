import { getRelativeTime } from '../../utils/date';
import * as repo from './til-repository';

// 데이터 변환

function formatPost(post) {
  return {
    id: post.id,
    author: post.users.name || post.users.github,
    avatar: post.users.avatar,
    githubUsername: post.users.github,
    postNumber: post.post_number,
    date: getRelativeTime(post.created_at),
    title: post.title,
    content: post.content ?? post.content_preview,
    tags: post.til_tags.map((t) => t.tags.name),
    likes: post.til_likes[0]?.count || 0,
    comments: post.til_comments?.length || 0,
  };
}

function parseTagNames(rawTags) {
  return rawTags
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

// 태그 동기화 (서버 action에서 사용)

export async function syncTags(supabase, postId, rawTags) {
  const tagNames = parseTagNames(rawTags);
  if (tagNames.length === 0) return;

  const { error: upsertError } = await supabase.from('tags').upsert(
    tagNames.map((name) => ({ name })),
    { onConflict: 'name', ignoreDuplicates: true },
  );
  if (upsertError) throw new Error('태그 저장에 실패했습니다.');

  const { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select()
    .in('name', tagNames);
  if (tagError) throw new Error('태그 저장에 실패했습니다.');

  const { error: tilTagError } = await supabase.from('til_tags').insert(
    tagData.map((t) => ({ til_id: postId, tag_id: t.id })),
  );
  if (tilTagError) throw new Error('태그 연결에 실패했습니다.');
}

// 공개 API

export async function fetchTilPosts() {
  const { data: posts, error } = await repo.findPosts();

  if (error) {
    throw new Error('TIL 데이터를 불러오는데 실패했습니다.');
  }

  return posts.map(formatPost);
}

export async function fetchTilDetail({ username, postNumber }) {
  const normalizedUsername = username.replace('@', '');

  const { data: post, error } = await repo.findPostDetail(
    normalizedUsername,
    postNumber,
  );

  if (error) {
    throw new Error('TIL 글을 불러오는데 실패했습니다.');
  }

  const comments = (post.til_comments || [])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((comment) => ({
      id: comment.id,
      author: comment.author_name,
      avatar: comment.avatar,
      content: comment.content,
      date: getRelativeTime(comment.created_at),
    }));

  return { ...formatPost(post), comments };
}

export async function fetchPopularTilPosts(limit = 5) {
  const { data: posts, error } = await repo.findPopularPosts();

  if (error) {
    throw new Error('TIL 데이터를 불러오는데 실패했습니다.');
  }

  return posts
    .map((post) => ({
      id: post.id,
      title: post.title,
      postNumber: post.post_number,
      author: post.users.name || post.users.github,
      githubUsername: post.users.github,
      likes: post.til_likes[0]?.count || 0,
      comments: post.til_comments?.length || 0,
      createdAt: post.created_at,
    }))
    .sort((a, b) => {
      if (b.likes !== a.likes) {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, limit);
}

export async function hasUserLikedTil({ tilId, userId }) {
  const { data, error } = await repo.findUserLike(tilId, userId);

  if (error) {
    throw new Error('좋아요 상태를 확인하는데 실패했습니다.');
  }

  return Boolean(data);
}

export async function addTilLike({ tilId, userId }) {
  const { error } = await repo.insertLike(tilId, userId);

  if (error) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
}

export async function removeTilLike({ tilId, userId }) {
  const { error } = await repo.deleteLike(tilId, userId);

  if (error) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
}

export async function createTilComment({
  tilId,
  authorName,
  avatar,
  content,
  deleteToken,
}) {
  const { data, error } = await repo.insertComment({
    tilId,
    authorName,
    avatar,
    content,
    deleteToken,
  });

  if (error) {
    throw new Error('댓글 작성에 실패했습니다.');
  }

  return data.id;
}

export async function deleteTilComment({ commentId, deleteToken }) {
  const response = await repo.deleteComment(commentId, deleteToken);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || '댓글 삭제에 실패했습니다.');
  }
}

export async function deleteTilPost({ postId }) {
  const { error } = await repo.deletePost(postId);

  if (error) {
    throw new Error('게시글 삭제에 실패했습니다.');
  }
}

