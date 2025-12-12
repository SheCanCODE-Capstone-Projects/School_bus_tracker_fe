'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bus, Users, User, UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Role {
  id: 'parent' | 'driver' | 'admin';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SchoolBusLogin() {
  const [selectedRole, setSelectedRole] = useState<'parent' | 'driver' | 'admin'>('parent');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const roles: Role[] = [
    { id: 'parent', label: 'Parent', icon: Users },
    { id: 'driver', label: 'Driver', icon: User },
    { id: 'admin', label: 'Admin', icon: UserCog }
  ];

  // ✅ Updated navigation logic
  const handleLogin = (): void => {
    console.log('Login attempt:', { role: selectedRole, email });

    if (selectedRole === 'parent') {
      router.push('/parent/dashboard');
    } else if (selectedRole === 'driver') {
      router.push('/driver/tracker');
    } else if (selectedRole === 'admin') {
      router.push('/admin/dashboard');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
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
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedRole === role.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
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
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              LOGIN AS A {selectedRole.toUpperCase()}
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
            <Link href="register/parent/step1" className="text-blue-500 hover:text-blue-600 font-medium hover:underline">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
