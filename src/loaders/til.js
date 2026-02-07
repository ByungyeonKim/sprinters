import { fetchTilDetail, fetchTilPosts } from '../services/til-service';

export async function tilLoader() {
  const posts = await fetchTilPosts();
  return { posts };
}

export async function tilDetailLoader({ params }) {
  const post = await fetchTilDetail({
    username: params.username,
    postNumber: params.postNumber,
  });
  return { post };
}
