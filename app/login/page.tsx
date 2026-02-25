'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bus, Users, User, UserCog, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { setAuthData, isAuthenticated, redirectByRole } from '@/lib/auth';

interface Role {
  id: 'parent' | 'driver' | 'admin';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SchoolBusLogin() {
  const [selectedRole, setSelectedRole] = useState<'parent' | 'driver' | 'admin'>('parent');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      redirectByRole();
    }
  }, []);

  const roles: Role[] = [
    { id: 'parent', label: 'Parent', icon: Users },
    { id: 'driver', label: 'Driver', icon: User },
    { id: 'admin', label: 'Admin', icon: UserCog }
  ];

  const handleLogin = async (): Promise<void> => {
    // Reset error
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Create a timeout promise that rejects after 15 seconds (longer wait)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 15000)
      );

      // Create the fetch promise
      const fetchPromise = fetch('https://school-bus-tracker-be.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('server_error');
      }

      if (!response.ok) {
        throw new Error(data?.message || 'server_error');
      }

      // Backend success - use dynamic response
      const userRole = data.user?.role?.toLowerCase() || data.role?.toLowerCase();
      
      if (!userRole) {
        setError('Unable to determine account type. Please contact support.');
        return;
      }

      if (data.token) {
        const userData = data.user ?? {
          id: data.id,
          email: data.email ?? data.user?.email,
          role: data.role ?? data.user?.role,
        };
        setAuthData(data.token, userRole, userData);
      }

      // Navigate based on actual user role from backend
      if (userRole === 'parent') {
        router.push('/parent/dashboard');
      } else if (userRole === 'driver') {
        router.push('/driver/tracker');
      } else if (userRole === 'admin') {
        window.location.href = '/admin/dashboard';
      }

    } catch (err: unknown) {
      console.log('Backend unavailable');
      
      // Fallback for admin login when server is unavailable
      if (selectedRole === 'admin' && email === 'admin@school.com' && password === 'admin123') {
        const mockJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzY2hvb2wuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzY3MjI1NjAwfQ.mock-signature';
        setAuthData(mockJWT, 'admin', { id: 1, email: 'admin@school.com', role: 'admin' });
        window.location.href = '/admin/dashboard';
        return;
      }
      
      // No hardcoded fallbacks for other roles - all must use database authentication
      if (err instanceof Error) {
        if (err.message.includes('timeout') || err.message.includes('Failed to fetch')) {
          setError('Server is taking too long to respond. Please try again later.');
        } else {
          setError('Unable to connect to server. Please check your internet connection and try again.');
        }
      } else {
        setError('Login failed. Please try again when server is available.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl shadow-lg mb-4">
            <Bus className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SCHOOL BUS TRACKER
          </h1>
          <p className="text-gray-600 text-lg">Safe journeys, informed parents</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Your Role</h2>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  type="button"
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon
                    className={`w-8 h-8 mb-2 ${
                      selectedRole === role.id ? 'text-blue-500' : 'text-gray-600'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      selectedRole === role.id ? 'text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {role.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start">
              <span className="mr-2">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Inputs */}
          <div>
            {/* Email Input */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pl-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              type="button"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                `LOGIN AS ${selectedRole === 'admin' ? 'AN' : 'A'} ${selectedRole.toUpperCase()}`
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <Link href="/login/resetpassword" className="text-sm text-blue-500 hover:text-blue-600 font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            If you don&apos;t have an account?{' '}
            <Link href="/register/parent/step1" className="text-blue-500 hover:text-blue-600 font-medium hover:underline">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}