import React, { useEffect } from 'react';

const OAuthSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const redirectPath = params.get('redirectPath') || '/dashboard';

    if (token) {
      localStorage.setItem('token', token);
      

      const cleanPath = redirectPath;

      const currentDomain = window.location.origin;
      console.log(currentDomain, cleanPath);
      const fullRedirectUrl = `${currentDomain}${cleanPath}`;

      window.location.href = fullRedirectUrl;
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
