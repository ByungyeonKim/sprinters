/**
 * 기존 HTML 콘텐츠에 sanitize를 적용하는 일회성 스크립트
 *
 * 사용법:
 *   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/sanitize-existing-posts.js
 */
import { createClient } from '@supabase/supabase-js';
import sanitizeHtml from 'sanitize-html';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY 환경변수를 설정하세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function sanitizeContent(html) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt'],
    },
  });
}

async function run() {
  const { data: posts, error } = await supabase
    .from('til_posts')
    .select('id, content');

  if (error) {
    console.error('게시글 조회 실패:', error.message);
    process.exit(1);
  }

  console.log(`총 ${posts.length}개 게시글 sanitize 시작`);

  let updated = 0;

  for (const post of posts) {
    const sanitized = sanitizeContent(post.content || '');

    if (sanitized === post.content) continue;

    const { error: updateError } = await supabase
      .from('til_posts')
      .update({ content: sanitized })
      .eq('id', post.id);

    if (updateError) {
      console.error(`게시글 ${post.id} 업데이트 실패:`, updateError.message);
    } else {
      updated++;
    }
  }

  console.log(`완료: ${updated}개 업데이트`);
}

run();
