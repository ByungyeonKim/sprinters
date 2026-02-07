const sprinterDescriptors = [
  '열심히뛰는',
  '잠깐쉬는',
  '출발만빠른',
  '방향잃은',
  '오늘도달리는',
  '숨고르는',
  '다시뛰는',
  '스트레칭중인',
  '전력질주중인',
  '커피한잔더마신',
  '새벽4시인',
  '일단커밋한',
  'GPT한테물어본',
  '스택오버플로복붙한',
  '에러메시지구글링중인',
  '어제푸시안한',
  '머지충돌난',
  '코드리뷰피하는',
  'npm install만세번째인',
  '주석으로도망친',
  'TODO만늘어나는',
  '야근각잡은',
  '일단돌아가긴하는',
  '디버깅포기한',
  '리팩토링미룬',
  '테스트코드없는',
  '미션깜빡한',
];

export function generateSprinterNickname(seed) {
  const index = seed % sprinterDescriptors.length;
  return `${sprinterDescriptors[index]} 스프린터`;
}

export function generateSprinterAvatar(seed) {
  const index = (seed % 10) + 1;
  const paddedIndex = String(index).padStart(2, '0');
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatar/sprinter-${paddedIndex}.png`;
}

export function generateRandomSeed() {
  return Math.floor(Math.random() * 100);
}
