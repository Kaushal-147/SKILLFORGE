import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ named import

const OAuthSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    let redirectPath = params.get('redirectPath');

    if (!redirectPath || !redirectPath.startsWith('/')) {
      redirectPath = '/dashboard';
    }

    if (token) {
      try {
        localStorage.setItem('token', token);

        // ✅ Decode the token
        const decoded = jwtDecode(token);
        console.log('[OAuthSuccess] Decoded token:', decoded);

        const role = decoded.role || 'student';
        const userId = decoded.userId;

        localStorage.setItem('role', role);
        localStorage.setItem('userId', userId);

        const finalUrl = `${window.location.origin}${redirectPath}`;
        console.log('[OAuthSuccess] Redirecting to:', finalUrl);

        setTimeout(() => {
          window.location.href = finalUrl;
        }, 300);
      } catch (err) {
        console.error('[OAuthSuccess] Failed to decode token:', err);
        window.location.href = `${window.location.origin}/login`;
      }
    } else {
      window.location.href = `${window.location.origin}/login`;
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-700">Signing you in...</p>
    </div>
  );
};

export default OAuthSuccess;
