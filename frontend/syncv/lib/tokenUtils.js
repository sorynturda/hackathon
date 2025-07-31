/**
 * Simple token utilities to fix localStorage/cookie sync
 * This doesn't change your existing auth flow - just makes it more reliable
 */

export const tokenUtils = {
  /**
   * Get token with proper fallback (what you're already doing, but cleaner)
   */
  getToken() {
    if (typeof window === "undefined") return null;
    
    // Try localStorage first (your primary method)
    const localToken = localStorage.getItem('auth_token');
    if (localToken) return localToken;
    
    // Fallback to cookie (for middleware compatibility)
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
    
    return cookieToken || null;
  },

  /**
   * Set token in both places (like you're already doing in AuthContext)
   */
  setToken(token) {
    if (typeof window === "undefined") return;
    
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; max-age=86400`;
  },

  /**
   * Clear token from both places
   */
  clearToken() {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem('auth_token');
    document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};
