import { fetchMissionRankStudents } from '../services/student-service';
import { fetchPopularTilPosts } from '../services/til-service';

export async function homeLoader() {
  const [students, popularPosts] = await Promise.all([
    fetchMissionRankStudents(),
    fetchPopularTilPosts(5),
  ]);

  return { students, popularPosts };
}
