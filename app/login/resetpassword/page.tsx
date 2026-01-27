'use client';

import React, { useState } from 'react';
import { Bus, Mail, Lock, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';

type Step = 'email' | 'verification' | 'newPassword' | 'success';

export default function PasswordResetFlow() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Validation states
  const isPasswordLongEnough = newPassword.length >= 8;
  const doPasswordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const showPasswordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  const handleSendCode = async (): Promise<void> => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('verification');
    }, 1500);
  };

  const handleVerifyCode = async (): Promise<void> => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('newPassword');
    }, 1500);
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('success');
    }, 1500);
  };

  const handleResendCode = (): void => {
    setError('');
    // Simulate resending code
    alert('Verification code sent to ' + email);
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

        {/* Reset Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Back Button */}
          {currentStep !== 'success' && (
            <a 
              href="/login" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </a>
          )}

          {/* Step 1: Enter Email */}
          {currentStep === 'email' && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600">
                  Enter your email address and we&apos;ll send you a verification code to reset your password.
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          )}

          {/* Step 2: Verify Code */}
          {currentStep === 'verification' && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-600">
                  We&apos;ve sent a 6-digit verification code to
                </p>
                <p className="text-blue-600 font-medium mt-1">{email}</p>
              </div>

              <div className="mb-6">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 text-center text-2xl tracking-widest font-semibold"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyCode}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 mb-4"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Didn&apos;t receive the code?{' '}
                <button 
                  onClick={handleResendCode}
                  className="text-blue-500 hover:text-blue-600 font-medium hover:underline"
                >
                  Resend Code
                </button>
              </p>
            </div>
          )}

          {/* Step 3: New Password */}
          {currentStep === 'newPassword' && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Lock className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h2>
                <p className="text-gray-600">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              <div className="mb-5">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {newPassword.length > 0 && !isPasswordLongEnough && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <span className="mr-1">⚠</span> Password must be at least 8 characters
                  </p>
                )}
                {isPasswordLongEnough && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <span className="mr-1">✓</span>Password is now valid
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {showPasswordMismatch && (
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <span className="mr-1">⚠</span> Passwords do not match
                  </p>
                )}
                {doPasswordsMatch && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <span className="mr-1">✓</span> Passwords match
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 'success' && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                <p className="text-gray-600">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
              </div>

              <a
                href="/login"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 text-center"
              >
                Back to Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}