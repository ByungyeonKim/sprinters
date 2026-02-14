const OWN_COMMENT_IDS_KEY = 'sprintersOwnedCommentIds';

let listeners = [];
let cachedRaw = null;
let cachedIds = [];

function emitChange() {
  cachedRaw = null;
  listeners.forEach((l) => l());
}

export function subscribeOwnedCommentIds(listener) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getOwnedCommentIds() {
  if (!canUseStorage()) {
    return cachedIds;
  }

  const raw = localStorage.getItem(OWN_COMMENT_IDS_KEY);
  if (raw === cachedRaw) {
    return cachedIds;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedIds = [];
    return cachedIds;
  }

  try {
    const parsed = JSON.parse(raw);
    cachedIds = Array.isArray(parsed) ? parsed.map((id) => String(id)) : [];
  } catch {
    cachedIds = [];
  }

  return cachedIds;
}

const SERVER_SNAPSHOT = [];
export function getOwnedCommentIdsServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function addOwnedCommentId(commentId) {
  const normalizedId = String(commentId);
  const ids = getOwnedCommentIds();

  if (ids.includes(normalizedId)) {
    return;
  }

  if (canUseStorage()) {
    localStorage.setItem(OWN_COMMENT_IDS_KEY, JSON.stringify([...ids, normalizedId]));
  }
  emitChange();
}

export function removeOwnedCommentId(commentId) {
  const normalizedId = String(commentId);
  const ids = getOwnedCommentIds().filter((id) => id !== normalizedId);

  if (canUseStorage()) {
    localStorage.setItem(OWN_COMMENT_IDS_KEY, JSON.stringify(ids));
  }
  emitChange();
}
