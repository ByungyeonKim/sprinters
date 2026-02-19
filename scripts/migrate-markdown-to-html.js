/**
 * 기존 마크다운 콘텐츠를 HTML로 변환하는 일회성 마이그레이션 스크립트
 *
 * 사용법:
 *   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/migrate-markdown-to-html.js
 *
 * 실행 후 marked 제거:
 *   npm uninstall -D marked
 */
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY 환경변수를 설정하세요.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  const { data: posts, error } = await supabase
    .from('til_posts')
    .select('id, content');

  if (error) {
    console.error('게시글 조회 실패:', error.message);
    process.exit(1);
  }

  console.log(`총 ${posts.length}개 게시글 마이그레이션 시작`);

  let success = 0;
  let skipped = 0;

  for (const post of posts) {
    // 이미 HTML인 경우 (태그로 시작) 건너뛰기
    if (post.content && post.content.trim().startsWith('<')) {
      skipped++;
      continue;
    }

    const html = marked.parse(post.content || '');

    const { error: updateError } = await supabase
      .from('til_posts')
      .update({ content: html })
      .eq('id', post.id);

    if (updateError) {
      console.error(`게시글 ${post.id} 업데이트 실패:`, updateError.message);
    } else {
      success++;
    }
  }

  console.log(`완료: ${success}개 변환, ${skipped}개 건너뜀`);
}

migrate();
