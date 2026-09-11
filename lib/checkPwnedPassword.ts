/**
 * Checks a password against the HaveIBeenPwned "Pwned Passwords" database
 * using their free, k-anonymity API. The full password NEVER leaves the
 * browser — only the first 5 characters of its SHA-1 hash are sent.
 *
 * Returns the number of times this password has appeared in known data
 * breaches. 0 means it's not in the list (safe to use).
 */
export async function checkPwnedPassword(password: string): Promise<number> {
  // 1. Turn the password into a SHA-1 hash (a scrambled fingerprint)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  // 2. Only send the first 5 characters to HaveIBeenPwned (k-anonymity)
  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      // If the API is down, don't block signup — fail open.
      return 0;
    }
    const text = await response.text();

    // 3. The API returns many possible suffixes; find ours in the list
    const lines = text.split("\n");
    for (const line of lines) {
      const [returnedSuffix, count] = line.split(":");
      if (returnedSuffix.trim() === suffix) {
        return parseInt(count, 10);
      }
    }
    return 0;
  } catch (err) {
    // Network error — fail open so a real user isn't blocked from signing up
    console.error("Pwned password check failed:", err);
    return 0;
  }
}
