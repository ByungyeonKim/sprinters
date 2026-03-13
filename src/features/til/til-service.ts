import type { SupabaseClient } from '@supabase/supabase-js';
import { getRelativeTime } from '../../utils/date';
import * as repo from './til-repository';

// 데이터 변환

type PostUser = {
  id: string;
  name: string | null;
  github: string;
  avatar: string;
};

type RawTilTag = {
  tags: { id: number; name: string };
};

type RawTilLikeCount = {
  count: number;
};

type RawTilComment = {
  id: number;
  author_name: string;
  avatar: string;
  content: string;
  created_at: string;
};

type RawPost = {
  id: number;
  title: string;
  content?: string;
  content_preview?: string;
  created_at: string;
  post_number: number;
  users: PostUser | PostUser[];
  til_tags: RawTilTag[];
  til_likes: RawTilLikeCount[];
  til_comments: RawTilComment[] | { id: number }[];
};

function getPostUser(users: PostUser | PostUser[]) {
  if (Array.isArray(users)) {
    return users[0] ?? ({} as Partial<PostUser>);
  }

  return users ?? ({} as Partial<PostUser>);
}

function formatPost(post: RawPost) {
  const user = getPostUser(post.users);
  return {
    id: post.id,
    author: user.name || user.github,
    avatar: user.avatar,
    githubUsername: user.github,
    postNumber: post.post_number,
    date: getRelativeTime(post.created_at),
    title: post.title,
    content: post.content ?? post.content_preview,
    tags: post.til_tags.map((t: RawTilTag) => t.tags.name),
    likes: post.til_likes[0]?.count || 0,
    comments: post.til_comments?.length || 0,
  };
}

function parseTagNames(rawTags: string) {
  return rawTags
    .split(',')
    .map((t: string) => t.trim())
    .filter((t: string) => t.length > 0);
}

// 태그 동기화 (서버 action에서 사용)

export async function syncTags(supabase: SupabaseClient, postId: number, rawTags: string) {
  const tagNames = parseTagNames(rawTags);
  if (tagNames.length === 0) return;

  const { error: upsertError } = await supabase.from('tags').upsert(
    tagNames.map((name: string) => ({ name })),
    { onConflict: 'name', ignoreDuplicates: true },
  );
  if (upsertError) throw new Error('태그 저장에 실패했습니다.');

  const { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select()
    .in('name', tagNames);
  if (tagError) throw new Error('태그 저장에 실패했습니다.');

  const { error: tilTagError } = await supabase.from('til_tags').insert(
    tagData.map((t: { id: number }) => ({ til_id: postId, tag_id: t.id })),
  );
  if (tilTagError) throw new Error('태그 연결에 실패했습니다.');
}

// 공개 API

export async function fetchTilPosts() {
  const { data: posts, error } = await repo.findPosts();

  if (error) {
    throw new Error('TIL 데이터를 불러오는데 실패했습니다.');
  }

  return (posts as unknown as RawPost[]).map(formatPost);
}

export async function fetchTilDetail({ username, postNumber }: { username: string; postNumber: number | string }) {
  const normalizedUsername = username.replace('@', '');

  const { data: rawPost, error } = await repo.findPostDetail(
    normalizedUsername,
    postNumber,
  );

  if (error) {
    throw new Error('TIL 글을 불러오는데 실패했습니다.');
  }

  const post = rawPost as unknown as RawPost & { til_comments: RawTilComment[] };

  const comments = (post.til_comments || [])
    .sort(
      (a: RawTilComment, b: RawTilComment) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .map((comment: RawTilComment) => ({
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
    .map((post) => {
      const user = getPostUser(post.users);
      return {
      id: post.id,
      title: post.title,
      postNumber: post.post_number,
      author: user.name || user.github,
      githubUsername: user.github,
      likes: post.til_likes[0]?.count || 0,
      comments: post.til_comments?.length || 0,
      createdAt: post.created_at,
      };
    })
    .sort((a, b) => {
      if (b.likes !== a.likes) {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);
}

export async function hasUserLikedTil({ tilId, userId }: { tilId: number; userId: string }) {
  const { data, error } = await repo.findUserLike(tilId, userId);

  if (error) {
    throw new Error('좋아요 상태를 확인하는데 실패했습니다.');
  }

  return Boolean(data);
}

export async function addTilLike({ tilId, userId }: { tilId: number; userId: string }) {
  const { error } = await repo.insertLike(tilId, userId);

  if (error) {
    throw new Error('좋아요 처리에 실패했습니다.');
  }
}

export async function removeTilLike({ tilId, userId }: { tilId: number; userId: string }) {
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
}: {
  tilId: number;
  authorName: string;
  avatar: string;
  content: string;
  deleteToken: string;
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

export async function deleteTilComment({ commentId, deleteToken }: { commentId: number; deleteToken: string }) {
  const response = await repo.deleteComment(commentId, deleteToken);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || '댓글 삭제에 실패했습니다.');
  }
}

export async function deleteTilPost({ postId }: { postId: number }) {
  const { error } = await repo.deletePost(postId);

  if (error) {
    throw new Error('게시글 삭제에 실패했습니다.');
  }
}
