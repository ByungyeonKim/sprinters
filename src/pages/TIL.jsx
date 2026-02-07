import { Link, useLoaderData } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { LikeCount } from '../components/LikeCount';
import { CommentCount } from '../components/CommentCount';

function TIL() {
  const { posts } = useLoaderData();
  const { user } = useAuth();

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 flex items-end justify-between border-b border-gray-200 py-10'>
        <div>
          <h1 className='mb-3 text-4xl font-bold'>Today I Learned</h1>
          <p className='text-gray-600'>
            오늘 배운 내용을 기록하고 공유하는 공간입니다.
          </p>
        </div>
        {user && (
          <Link
            to='/til/new'
            className='rounded-full bg-violet-600 px-4 py-2 text-sm text-white transition-colors hover:bg-violet-700'
          >
            새 글 작성
          </Link>
        )}
      </header>

      <div className='space-y-10'>
        {posts.map((post, index) => (
          <article key={index} className='group'>
            <div className='mb-4 flex items-center gap-3'>
              <img
                src={post.avatar}
                alt={post.author}
                className='h-10 w-10 rounded-full object-cover'
              />
              <div>
                <p className='text-sm font-medium'>{post.author}</p>
                <p className='text-sm text-gray-500'>{post.date}</p>
              </div>
            </div>
            <Link to={`/til/@${post.githubUsername}/${post.postNumber}`}>
              <h2 className='mb-3 text-2xl font-bold group-hover:underline'>
                {post.title}
              </h2>
            </Link>
            <p className='mb-4 line-clamp-2 leading-relaxed text-gray-600'>
              {post.content}
            </p>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className='flex items-center gap-4 text-gray-500'>
                <LikeCount count={post.likes} />
                <CommentCount count={post.comments} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export { TIL };
