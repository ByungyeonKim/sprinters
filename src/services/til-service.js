import { supabase } from '../lib/supabase';
import { getRelativeTime } from '../utils/date';

// TIL 목록/상세 조회, 인기글 계산, 좋아요/댓글/글 작성·삭제 로직

const listQuery = `
  id,
  title,
  content_preview,
  created_at,
  post_number,
  users (id, name, github, avatar),
  til_tags (
    tags (id, name)
  ),
  til_likes (count),
  til_comments (count)
`;

const detailQuery = `
  id,
  title,
  content,
  created_at,
  post_number,
  users!inner (id, name, github, avatar),
  til_tags (
    tags (id, name)
  ),
  til_likes (count),
  til_comments (
    id,
    author_name,
    avatar,
    content,
    created_at
  )
`;

const popularQuery = `
  id,
  title,
  post_number,
  created_at,
  users (id, name, github, avatar),
  til_likes (count),
  til_comments (count)
`;

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
    comments: post.til_comments?.[0]?.count || 0,
  };
}

function parseTagNames(rawTags) {
  return rawTags
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export async function fetchTilPosts() {
  const { data: posts, error } = await supabase
    .from('til_posts')
    .select(listQuery)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('TIL 데이터를 불러오는데 실패했습니다.');
  }

  return posts.map(formatPost);
}

export async function fetchTilDetail({ username, postNumber }) {
  const normalizedUsername = username.replace('@', '');

  const { data: post, error } = await supabase
    .from('til_posts')
    .select(detailQuery)
    .eq('users.github', normalizedUsername)
    .eq('post_number', postNumber)
    .single();

  if (error) {
    throw new Error('TIL 글을 불러오는데 실패했습니다.');
  }

  const comments = (post.til_comments || [])
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
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
  const { data: posts, error } = await supabase
    .from('til_posts')
    .select(popularQuery)
    .order('created_at', { ascending: false });

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
      comments: post.til_comments[0]?.count || 0,
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
  const { data, error } = await supabase
    .from('til_likes')
    .select('id')
    .eq('til_id', tilId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error('좋아요 상태를 확인하는데 실패했습니다.');
  }

  return Boolean(data);
}

export async function addTilLike({ tilId, userId }) {
  const { error } = await supabase.from('til_likes').insert({
    til_id: tilId,
    user_id: userId,
  });

  if (error) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
}

export async function removeTilLike({ tilId, userId }) {
  const { error } = await supabase
    .from('til_likes')
    .delete()
    .eq('til_id', tilId)
    .eq('user_id', userId);

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
  const { data, error } = await supabase
    .from('til_comments')
    .insert({
      til_id: tilId,
      author_name: authorName,
      avatar,
      content,
      delete_token: deleteToken,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error('댓글 작성에 실패했습니다.');
  }

  return data.id;
}

export async function deleteTilComment({ commentId, deleteToken }) {
  const { error } = await supabase
    .from('til_comments')
    .delete()
    .eq('id', commentId)
    .eq('delete_token', deleteToken);

  if (error) {
    throw new Error('댓글 삭제에 실패했습니다.');
  }
}

export async function deleteTilPost({ postId }) {
  const { error } = await supabase.from('til_posts').delete().eq('id', postId);

  if (error) {
    throw new Error('게시글 삭제에 실패했습니다.');
  }
}

export async function createTilPost({ userId, title, content, rawTags }) {
  const { data: post, error: postError } = await supabase
    .from('til_posts')
    .insert({
      user_id: userId,
      title: title.trim(),
      content: content.trim(),
    })
    .select('id, post_number')
    .single();

  if (postError) {
    throw new Error('게시글 저장에 실패했습니다.');
  }

  const tagNames = parseTagNames(rawTags);

  if (tagNames.length > 0) {
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .upsert(
        tagNames.map((name) => ({ name })),
        { onConflict: 'name' },
      )
      .select();

    if (tagError) {
      throw new Error('태그 저장에 실패했습니다.');
    }

    const { error: tilTagError } = await supabase.from('til_tags').insert(
      tagData.map((tag) => ({
        til_id: post.id,
        tag_id: tag.id,
      })),
    );

    if (tilTagError) {
      throw new Error('태그 연결에 실패했습니다.');
    }
  }

  return { id: post.id, postNumber: post.post_number };
}
