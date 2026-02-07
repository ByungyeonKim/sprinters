import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

function TILNew() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/til');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (isPreview) {
      previewRef.current?.focus();
    } else {
      textareaRef.current?.focus();
    }
  }, [isPreview]);

  if (loading || !user) {
    return null;
  }

  const handleTabKeyDown = (e) => {
    if (e.ctrlKey && e.shiftKey) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsPreview(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsPreview(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    const githubUsername = user.user_metadata?.user_name;

    try {
      // 1. TIL 포스트 저장
      const { data: post, error: postError } = await supabase
        .from('til_posts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
        })
        .select('id, post_number')
        .single();

      if (postError) throw postError;

      // 2. 태그 처리
      const tagNames = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (tagNames.length > 0) {
        // 태그 upsert
        const { data: tagData, error: tagError } = await supabase
          .from('tags')
          .upsert(
            tagNames.map((name) => ({ name })),
            { onConflict: 'name' },
          )
          .select();

        if (tagError) throw tagError;

        // til_tags 관계 저장
        const { error: tilTagError } = await supabase.from('til_tags').insert(
          tagData.map((tag) => ({
            til_id: post.id,
            tag_id: tag.id,
          })),
        );

        if (tilTagError) throw tilTagError;
      }

      // 3. 작성된 글 상세 페이지로 이동
      navigate(`/til/@${githubUsername}/${post.post_number}`);
    } catch (error) {
      console.error('TIL 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='mx-auto max-w-170'>
      <header className='mb-10 flex items-center justify-between border-b border-gray-200 py-10'>
        <h1 className='text-4xl font-bold'>생각의 조각들을 이곳에 남기세요.</h1>
        <Link to='/til' className='text-sm text-gray-500 hover:text-gray-900'>
          취소
        </Link>
      </header>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='title' className='mb-2 block text-sm font-medium'>
            제목
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='오늘 배운 내용을 한 줄로 요약해보세요'
            className='w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-violet-500 focus:outline-none'
          />
        </div>

        <div>
          <div className='mb-2 flex items-center justify-between'>
            <label htmlFor='content' className='block text-sm font-medium'>
              내용
            </label>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={() => setIsPreview(false)}
                className={`rounded px-3 py-1 text-sm ${
                  !isPreview
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                작성
              </button>
              <button
                type='button'
                onClick={() => setIsPreview(true)}
                className={`rounded px-3 py-1 text-sm ${
                  isPreview
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                미리보기
              </button>
            </div>
          </div>
          {isPreview ? (
            <div
              ref={previewRef}
              tabIndex={0}
              onKeyDown={handleTabKeyDown}
              className='prose min-h-64 w-full max-w-none rounded-lg border border-gray-200 px-4 py-3 focus:outline-none'
            >
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className='text-gray-400'>미리볼 내용이 없습니다.</p>
              )}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              id='content'
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleTabKeyDown}
              placeholder='마크다운 문법을 사용할 수 있습니다'
              className='w-full resize-none rounded-lg border border-gray-200 px-4 py-3 focus:border-violet-500 focus:outline-none'
            />
          )}
        </div>

        <div>
          <label htmlFor='tags' className='mb-2 block text-sm font-medium'>
            태그
          </label>
          <input
            type='text'
            id='tags'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder='쉼표로 구분하여 입력 (예: React, TypeScript)'
            className='w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-violet-500 focus:outline-none'
          />
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='rounded-full bg-violet-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting ? '저장 중...' : '작성 완료'}
          </button>
        </div>
      </form>
    </section>
  );
}

export { TILNew };
