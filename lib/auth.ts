export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('authToken') || getCookie('authToken');

  return token || null;
}


export function getUserRole(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole') || getCookie('userRole');
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

interface UserData {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

export function setAuthData(token: string, role: string, userData?: UserData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    // Also set cookies for middleware
    setCookie('authToken', token, 7); // 7 days
    setCookie('userRole', role, 7);
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    
    // Clear cookies properly
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Force redirect to login
    window.location.replace('/login');
  }
}

export function redirectByRole(): void {
  const role = getUserRole();
  if (role === 'admin') {
    window.location.href = '/admin/dashboard';
  } else if (role === 'parent') {
    window.location.href = '/parent/dashboard';
  } else if (role === 'driver') {
    window.location.href = '/driver/tracker';
  } else {
    window.location.href = '/login';
  }
}

// Helper functions for cookies
function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}