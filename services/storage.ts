
const STORAGE_KEY = 'oreum_api_key_secure';

// Simple obfuscation to prevent plain text reading in simple inspections
// Note: Client-side encryption without a user-provided password is limited to obfuscation.
export const saveApiKey = (apiKey: string): void => {
  try {
    const encoded = btoa(apiKey);
    localStorage.setItem(STORAGE_KEY, encoded);
  } catch (e) {
    console.error("Failed to save API key", e);
  }
};

export const loadApiKey = (): string | null => {
  try {
    const encoded = localStorage.getItem(STORAGE_KEY);
    if (!encoded) return null;
    return atob(encoded);
  } catch (e) {
    console.error("Failed to load API key", e);
    return null;
  }
};

export const clearApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
