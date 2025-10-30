"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Lightweight JWT check: decode payload and check exp (does NOT verify signature)
export const isTokenValid = (token?: string | null): boolean => {
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      // Not a JWT, assume token present means valid for client-side redirect purposes
      return true;
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }

    // No exp claim — treat as valid
    return true;
  } catch (e) {
    // If parsing fails, be conservative and treat as invalid
    return false;
  }
};

// Hook: redirects to /quiz if a valid auth token + student/user data exists.
// Returns { checking } so callers can show a spinner while the check runs.
export const useRedirectToQuizIfAuthenticated = (): { checking: boolean } => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const studentData = localStorage.getItem('studentData') || localStorage.getItem('userData');
      if (token && studentData && isTokenValid(token)) {
        // Use replace so history isn't polluted
        router.replace('/quiz');
        return;
      }
    } catch (e) {
      // ignore storage errors
    }

    setChecking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { checking };
};

export default isTokenValid;
