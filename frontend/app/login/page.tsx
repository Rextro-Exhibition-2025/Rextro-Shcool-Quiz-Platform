"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, LogIn, Eye, EyeOff, Shield } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface ActiveSession {
  id: string;
  time: string;
  isActive: boolean;
  isFull: boolean;
  spotsLeft: number;
}

interface LoginFormResponse {
  success: boolean;
  data: {
    memberName: string;
    schoolName: string;
    teamName: string;
    authToken: string;
  };
  message?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    memberName: '',
    password: '',
    schoolName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const router = useRouter();
  const { user, setUser } = useUser();

  // Add this useEffect to your login page to debug
  useEffect(() => {
    console.log('User from context changed:', user);
  }, [user]);

  // Fetch current session info from backend
  useEffect(() => {
    const fetchSession = async () => {
      setSessionLoading(true);
      try {
        // Replace with your backend endpoint
        const res = await fetch('/api/sessions/active');
        if (!res.ok) throw new Error('Failed to fetch session');
        const data = await res.json();
        setSession(data.session || null);
      } catch (e) {
        setSession(null);
      } finally {
        setSessionLoading(false);
      }
    };
    fetchSession();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.memberName || !formData.password || !formData.schoolName) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Check session status before allowing login
    if (!session || session.isFull || !session.isActive) {
      setError('Cannot login: No active session or session is full.');
      setLoading(false);
      return;
    }

    // Simulate authentication (replace with actual authentication logic)
    try {
      // You can add your authentication logic here
      // For now, we'll simulate a successful login after 1 second
      const url = "http://localhost:3000/api/auth/login";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schoolName: formData.schoolName, // Backend expects 'teamName'
          memberName: formData.memberName,
          password: formData.password
        })
      });

      const responseData: LoginFormResponse = await response.json();

      // Store user data in localStorage (or use proper state management)
      localStorage.setItem('studentData', JSON.stringify({
        memberName: formData.memberName,
        schoolName: formData.schoolName,
        loginTime: new Date().toISOString(),
        sessionId: session.id,
        sessionTime: session.time
      }));

      // Request fullscreen and redirect to quiz
      // if (document.documentElement.requestFullscreen) {
      //   await document.documentElement.requestFullscreen();
      // }
      if (response.ok && responseData.success) {
        console.log(responseData);
        localStorage.setItem('authToken', responseData.data.authToken);
        setUser({
          memberName: responseData.data.memberName,
          schoolName: responseData.data.schoolName,
          teamName: responseData.data.teamName,
          authToken: responseData.data.authToken,
        });
        console.log(user);
        router.push('/quiz');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Sample school names for the dropdown
  const schools = [
    'Select your school',
    'Sunrise High School',
    'Greenwood High School',
    'Riverside Academy',
    'Maple Valley School',
    'Oakwood Preparatory School',
    'Sunrise Elementary School',
    'Mountain View School',
    'Cedar Creek Institution',
    'Pinewood Secondary School'
  ];

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
        background: 'rgba(255,255,255,0.7)',
        zIndex: 1
      }} />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute w-96 h-96 bg-[#df7500]/10 rounded-full blur-3xl animate-pulse top-1/4 left-1/4" />
        <div className="absolute w-64 h-64 bg-[#651321]/10 rounded-full blur-2xl animate-bounce top-3/4 right-1/4"
          style={{ animationDuration: '4s' }} />
      </div>

      {/* Session Info Banner */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Session Status */}
          {sessionLoading ? (
            <div className="mb-6 text-center text-[#651321] font-semibold">Checking session status...</div>
          ) : session && session.isActive && !session.isFull ? (
            <div className="mb-6 text-center bg-gradient-to-r from-[#df7500]/20 to-[#651321]/20 rounded-xl px-6 py-3 shadow text-[#651321] font-semibold">
              <span className="mr-2">Current Session:</span>
              <span className="bg-[#df7500]/10 text-[#651321] px-4 py-1 rounded-full font-bold">{session.time}</span>
              <span className="ml-4">Spots Left: <span className="font-bold">{session.spotsLeft}</span></span>
            </div>
          ) : session && session.isFull ? (
            <div className="mb-6 text-center bg-red-100 text-red-700 rounded-xl px-6 py-3 shadow font-semibold">
              Session Full. Please try again in the next session.
            </div>
          ) : (
            <div className="mb-6 text-center bg-yellow-100 text-yellow-700 rounded-xl px-6 py-3 shadow font-semibold">
              No session is currently running. Please come back at your assigned time.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student ID */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="memberName"
                  name="memberName"
                  value={formData.memberName}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#df7500] focus:border-transparent text-[#651321] placeholder-gray-500"
                  placeholder="Enter your member name"
                  required
                />
              </div>
            </div>

            {/* School Selection */}
            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                School Name
              </label>
              <select
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#df7500] focus:border-transparent text-[#651321]"
                required
              >
                {schools.map((school, index) => (
                  <option
                    key={index}
                    value={index === 0 ? '' : school}
                    disabled={index === 0}
                    className={index === 0 ? "text-gray-500" : "text-[#651321]"}
                  >
                    {school}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#df7500] focus:border-transparent text-[#651321] placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#df7500] to-[#651321] text-white py-3 px-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login & Start Quiz
                </>
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => router.push('/')}
              className="text-[#651321] hover:text-[#df7500] font-medium transition-colors block w-full"
            >
              Back to Home
            </button>
            {/* <div className="text-gray-400">•</div>
            <button
              onClick={() => router.push('/admin/login')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Login</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
