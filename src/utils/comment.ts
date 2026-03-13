const DELETE_TOKEN_KEY = 'sprintersCommentDeleteToken';

export function getCommentDeleteToken() {
  let token = localStorage.getItem(DELETE_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(DELETE_TOKEN_KEY, token);
  }
  return token;
}

const OWN_COMMENT_IDS_KEY = 'sprintersOwnedCommentIds';

type Listener = () => void;

let listeners: Listener[] = [];
let cachedRaw: string | null = null;
let cachedIds: string[] = [];

function emitChange() {
  cachedRaw = null;
  listeners.forEach((l) => l());
}

export function subscribeOwnedCommentIds(listener: Listener) {
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
    cachedIds = Array.isArray(parsed) ? parsed.map((id: unknown) => String(id)) : [];
  } catch {
    cachedIds = [];
  }

  return cachedIds;
}

const SERVER_SNAPSHOT: string[] = [];
export function getOwnedCommentIdsServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function addOwnedCommentId(commentId: string | number) {
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

export function removeOwnedCommentId(commentId: string | number) {
  const normalizedId = String(commentId);
  const ids = getOwnedCommentIds().filter((id) => id !== normalizedId);

  if (canUseStorage()) {
    localStorage.setItem(OWN_COMMENT_IDS_KEY, JSON.stringify(ids));
  }
  emitChange();
}
