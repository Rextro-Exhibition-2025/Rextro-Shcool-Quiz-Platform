"use client";
import React, { useEffect, useState } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Redirect to add-question page if already authenticated
      router.push('/add-question');
    }
  }, [session, status, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await signIn('google', {
        callbackUrl: '/add-question',
        redirect: false,
      });

      if (result?.error) {
        setError('Access Denied: You don\'t have permission to access the admin panel. Only authorized email addresses can log in as admin.');
      }
    } catch (error) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#df7500]"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br p-4 relative flex items-center justify-center"
      style={{
        backgroundImage: 'url("/Container.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      {/* Background overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.8)',
        zIndex: 1
      }} />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute w-96 h-96 bg-[#df7500]/10 rounded-full blur-3xl animate-pulse top-1/4 left-1/4" />
        <div className="absolute w-64 h-64 bg-[#651321]/10 rounded-full blur-2xl animate-bounce top-3/4 right-1/4" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute w-80 h-80 bg-[#df7500]/10 rounded-full blur-2xl animate-pulse bottom-1/4 left-1/3" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#df7500] to-[#651321] rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#df7500] to-[#651321] bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-gray-600 mt-2">
              Secure access for administrators only
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-5 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold text-sm mb-1">Access Denied</h3>
                  <p className="text-red-700 text-sm leading-relaxed">{error}</p>
                  <p className="text-red-600 text-xs mt-2">Contact your administrator to get access.</p>
                </div>
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="space-y-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-[#df7500]/20 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">
                Only authorized admin accounts can access this portal
              </p>
              <p className="text-xs text-gray-400">
                If you don't have access, contact your administrator
              </p>
            </div>

            {/* Back to student login */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                onClick={() => router.push('/login')}
                className="text-[#651321] hover:text-[#df7500] text-sm font-medium transition-colors duration-200"
              >
            Back to Student Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
