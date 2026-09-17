// Holds the language/location choice made before the user is authenticated,
// so it can be pushed to the backend right after Google sign-in succeeds.
const KEY = "nuzio_pending_language";

interface PendingLanguage {
  language: string;
  locationEnabled: boolean;
  city?: string;
}

export function setPendingLanguage(value: PendingLanguage) {
  window.localStorage.setItem(KEY, JSON.stringify(value));
}

export function getPendingLanguage(): PendingLanguage | null {
  const raw = window.localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearPendingLanguage() {
  window.localStorage.removeItem(KEY);
}
