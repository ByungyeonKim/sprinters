import { useState } from 'react';
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router';
import { useAuth } from '../hooks/use-auth';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { LikeButton } from '../components/LikeButton';
import { CommentForm } from '../components/CommentForm';
import { CommentList } from '../components/CommentList';
import { DeleteButton } from '../components/DeleteButton';
import { deleteTilPost } from '../services/til-service';
import { ChevronLeftIcon } from '../components/icons';
import {
  getOwnedCommentIds,
  addOwnedCommentId,
  removeOwnedCommentId,
} from '../utils/comment';

function TILDetail() {
  const { post } = useLoaderData();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ownedCommentIds, setOwnedCommentIds] = useState(getOwnedCommentIds);

  const isAuthor = user?.user_metadata?.user_name === post.githubUsername;

  const handleDeletePost = async () => {
    await deleteTilPost({ postId: post.id });
    navigate('/til');
  };

  const handleCommentCreated = (commentId) => {
    addOwnedCommentId(commentId);
    setOwnedCommentIds((prev) => [...prev, commentId]);
    revalidator.revalidate();
  };

  const handleCommentDeleted = (commentId) => {
    removeOwnedCommentId(commentId);
    setOwnedCommentIds((prev) => prev.filter((id) => id !== commentId));
    revalidator.revalidate();
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

      <section className='mt-10 border-t border-gray-200 pt-10'>
        <div className='mb-6 flex items-center justify-between'>
          <LikeButton tilId={post.id} initialCount={post.likes} />
          <h2 className='text-lg font-bold'>
            댓글({post.comments?.length || 0})
          </h2>
        </div>

        <CommentForm tilId={post.id} onCommentCreated={handleCommentCreated} />
        <CommentList
          comments={post.comments}
          ownedCommentIds={ownedCommentIds}
          onCommentDeleted={handleCommentDeleted}
        />
      </section>
    </section>
  );
}

export { TILDetail };
