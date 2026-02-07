import { fetchMissionRankStudents } from '../services/studentService';
import { fetchPopularTilPosts } from '../services/tilService';

export async function homeLoader() {
  const [students, popularPosts] = await Promise.all([
    fetchMissionRankStudents(),
    fetchPopularTilPosts(5),
  ]);

  return { students, popularPosts };
}
