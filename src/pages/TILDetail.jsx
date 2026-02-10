import { Link, useLoaderData, useNavigate } from 'react-router';
import { useAuth } from '../hooks/use-auth';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { CommentSection } from '../components/CommentSection';
import { DeleteButton } from '../components/DeleteButton';
import { deleteTilPost } from '../services/til-service';
import { ChevronLeftIcon } from '../components/icons';

function TILDetail() {
  const { post } = useLoaderData();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAuthor = user?.user_metadata?.user_name === post.githubUsername;

  const handleDeletePost = async () => {
    await deleteTilPost({ postId: post.id });
    navigate('/til', { state: { deleted: true } });
  };

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 border-b border-gray-200 py-10'>
        <Link
          to='/til'
          className='mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900'
        >
          <ChevronLeftIcon />
          목록으로
        </Link>
        <h1 className='mb-4 text-4xl font-bold'>{post.title}</h1>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
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
          </div>
          {isAuthor && (
            <DeleteButton
              onDelete={handleDeletePost}
              title='게시글을 삭제하시겠어요?'
              description='삭제된 게시글은 복구할 수 없습니다.'
            />
          )}
        </div>
      </header>

      <article className='prose max-w-none'>
        <MarkdownRenderer content={post.content} />
      </article>

      <CommentSection tilId={post.id} comments={post.comments} likes={post.likes} />
    </section>
  );
}

export { TILDetail };
