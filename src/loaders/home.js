import { supabase } from '../lib/supabase';

export async function homeLoader() {
  // 학생 데이터 (스프린트 미션 순위용)
  const { data: students, error: studentsError } = await supabase.from(
    'students',
  ).select(`
      *,
      mission_completions (
        missions (id, title)
      )
    `);

  if (studentsError) {
    throw new Error('학생 데이터를 불러오는데 실패했습니다.');
  }

  const sortedStudents = students
    .map((student) => {
      const lastCompletion = student.mission_completions.at(-1);
      const currentTitle = lastCompletion
        ? lastCompletion.missions.title
        : null;

      return {
        ...student,
        mission: student.mission_completions.length,
        currentTitle,
      };
    })
    .sort((a, b) => {
      if (b.mission !== a.mission) {
        return b.mission - a.mission;
      }
      return a.name.localeCompare(b.name, 'ko');
    });

  // 인기 TIL 데이터
  const { data: posts, error: postsError } = await supabase
    .from('til_posts')
    .select(
      `
      id,
      title,
      post_number,
      created_at,
      users (id, name, github, avatar),
      til_likes (count),
      til_comments (count)
    `,
    )
    .order('created_at', { ascending: false });

  if (postsError) {
    throw new Error('TIL 데이터를 불러오는데 실패했습니다.');
  }

  // 좋아요 순 정렬 (동일하면 최신순)
  const popularPosts = posts
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
    .slice(0, 5);

  return { students: sortedStudents, popularPosts };
}
