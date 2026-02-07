const OWN_COMMENT_IDS_KEY = 'sprintersOwnedCommentIds';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readOwnedCommentIds() {
  if (!canUseStorage()) {
    return [];
  }

  const raw = localStorage.getItem(OWN_COMMENT_IDS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((id) => String(id));
  } catch {
    return [];
  }
}

function writeOwnedCommentIds(ids) {
  if (!canUseStorage()) {
    return ids;
  }

  localStorage.setItem(OWN_COMMENT_IDS_KEY, JSON.stringify(ids));
  return ids;
}

export function getOwnedCommentIds() {
  return readOwnedCommentIds();
}

export function addOwnedCommentId(commentId) {
  const normalizedId = String(commentId);
  const ids = readOwnedCommentIds();

  if (ids.includes(normalizedId)) {
    return ids;
  }

  return writeOwnedCommentIds([...ids, normalizedId]);
}

export function removeOwnedCommentId(commentId) {
  const normalizedId = String(commentId);
  const ids = readOwnedCommentIds().filter((id) => id !== normalizedId);
  return writeOwnedCommentIds(ids);
}
