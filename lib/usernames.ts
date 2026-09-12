export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{2,29}$/;

export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "support",
  "help",
  "login",
  "signup",
  "sign-up",
  "dashboard",
  "settings",
  "api",
  "auth",
  "overlay",
  "tip",
  "tips",
  "creator",
  "creators",
  "stream",
  "streamly",
  "about",
  "contact",
  "privacy",
  "terms",
  "legal",
  "favicon",
  "robots",
  "sitemap",
  "demo",
] as const;

const reservedSet = new Set<string>(RESERVED_USERNAMES);

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isReservedUsername(username: string): boolean {
  return reservedSet.has(normalizeUsername(username));
}

export function validateUsername(value: string): string | null {
  const username = normalizeUsername(value);

  if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
    return `Username must be ${USERNAME_MIN_LENGTH}–${USERNAME_MAX_LENGTH} characters.`;
  }

  if (username !== value.trim().toLowerCase() || /[A-Z]/.test(value.trim())) {
    return "Username must be lowercase.";
  }

  if (!USERNAME_PATTERN.test(username)) {
    return "Use lowercase letters, numbers, underscores, or hyphens. Start with a letter or number.";
  }

  if (isReservedUsername(username)) {
    return "This username is reserved.";
  }

  return null;
}
