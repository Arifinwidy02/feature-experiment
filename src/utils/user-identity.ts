const USER_ID_KEY = "experiment-lab:user-id";

export function getUserId(): string {
  // 1. Check existing user ID
  const existingUserId = localStorage.getItem(USER_ID_KEY);

  // 2. Return existing ID if available
  if (existingUserId) {
    return existingUserId;
  }

  // 3. Generate new UUID
  const newUserId = crypto.randomUUID();

  // 4. Save to localStorage
  localStorage.setItem(USER_ID_KEY, newUserId);

  // 5. Return new ID
  return newUserId;
}
