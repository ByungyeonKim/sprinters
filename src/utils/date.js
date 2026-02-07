export function getRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return '방금 전';
  if (hours < 1) return `${minutes}분 전`;
  if (days < 1) return `${hours}시간 전`;
  if (weeks < 2) return `${days}일 전`;
  if (months < 1) return `${weeks}주 전`;
  if (years < 1) return `${months}개월 전`;
  return `${years}년 전`;
}
