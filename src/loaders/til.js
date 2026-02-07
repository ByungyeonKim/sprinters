import { supabase } from '../lib/supabase';

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
  til_likes (count)
`;

function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return '방금 전';
  if (hours < 1) return `${minutes}분 전`;
  if (days < 1) return `${hours}시간 전`;
  if (weeks < 2) return `${days}일 전`;
  if (months < 1) return `${weeks}주 전`;
  if (years < 1) return `${months}개월 전`;
  return `${years}년 전`;
}

export async function tilLoader() {
  const { data: posts, error } = await supabase
    .from('til_posts')
    .select(listQuery)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('tilLoader error:', error);
    throw new Error('TIL 데이터를 불러오는데 실패했습니다.');
  }

  const formattedPosts = posts.map(formatPost);

  return { posts: formattedPosts };
}

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
  };
}

export async function tilDetailLoader({ params }) {
  const username = params.username.replace('@', '');
  const { postNumber } = params;

  const { data: post, error } = await supabase
    .from('til_posts')
    .select(`
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
        delete_token,
        created_at
      )
    `)
    .eq('users.github', username)
    .eq('post_number', postNumber)
    .single();

  if (error) {
    throw new Error('TIL 글을 불러오는데 실패했습니다.');
  }

  const comments = (post.til_comments || [])
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((c) => ({
      id: c.id,
      author: c.author_name,
      avatar: c.avatar,
      content: c.content,
      deleteToken: c.delete_token,
      date: getRelativeTime(c.created_at),
    }));

  return { post: { ...formatPost(post), comments } };
}
