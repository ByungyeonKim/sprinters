import { supabase } from '../../lib/supabase';

// 데이터 저장소 접근을 추상화한 계층

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
  til_comments (id)
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
  til_comments (id)
`;

// til_posts
export function findPosts() {
  return supabase
    .from('til_posts')
    .select(listQuery)
    .order('created_at', { ascending: false });
}

export function findPostDetail(username, postNumber) {
  return supabase
    .from('til_posts')
    .select(detailQuery)
    .eq('users.github', username)
    .eq('post_number', postNumber)
    .single();
}

export function findPopularPosts() {
  return supabase
    .from('til_posts')
    .select(popularQuery)
    .order('created_at', { ascending: false });
}

export function insertPost({ userId, title, content }) {
  return supabase
    .from('til_posts')
    .insert({ user_id: userId, title, content })
    .select('id, post_number')
    .single();
}

export function updatePost(postId, { title, content }) {
  return supabase.from('til_posts').update({ title, content }).eq('id', postId);
}

export function deletePost(postId) {
  return supabase.from('til_posts').delete().eq('id', postId);
}

// tags
export function upsertTags(tagNames) {
  return supabase.from('tags').upsert(
    tagNames.map((name) => ({ name })),
    { onConflict: 'name', ignoreDuplicates: true },
  );
}

export function findTagsByNames(tagNames) {
  return supabase.from('tags').select().in('name', tagNames);
}

// til_tags
export function insertTilTags(tilId, tagIds) {
  return supabase
    .from('til_tags')
    .insert(tagIds.map((tagId) => ({ til_id: tilId, tag_id: tagId })));
}

export function deleteTilTags(tilId) {
  return supabase.from('til_tags').delete().eq('til_id', tilId);
}

// til_likes
export function findUserLike(tilId, userId) {
  return supabase
    .from('til_likes')
    .select('id')
    .eq('til_id', tilId)
    .eq('user_id', userId)
    .maybeSingle();
}

export function insertLike(tilId, userId) {
  return supabase.from('til_likes').insert({ til_id: tilId, user_id: userId });
}

export function deleteLike(tilId, userId) {
  return supabase
    .from('til_likes')
    .delete()
    .eq('til_id', tilId)
    .eq('user_id', userId);
}

// til_comments
export function insertComment({
  tilId,
  authorName,
  avatar,
  content,
  deleteToken,
}) {
  return supabase
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
}

export async function deleteComment(commentId, deleteToken) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-comment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ commentId, deleteToken }),
    },
  );

  return response;
}
