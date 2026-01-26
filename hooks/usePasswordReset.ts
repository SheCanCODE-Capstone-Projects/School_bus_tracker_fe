// Line 1: Import React hooks and API functions
import { useState } from 'react';
import { requestPasswordReset, confirmPasswordReset, ApiError } from '../lib/passwordReset';

// Line 5: Define the hook's return type
export interface UsePasswordResetReturn {
  // State variables
  isLoading: boolean;
  error: string;
  success: boolean;
  
  // Functions
  sendResetEmail: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  clearError: () => void;
  clearSuccess: () => void;
}

// Line 17: Custom hook for password reset functionality
export const usePasswordReset = (): UsePasswordResetReturn => {
  // Line 19: State for loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Line 22: State for error messages
  const [error, setError] = useState<string>('');
  
  // Line 25: State for success indicator
  const [success, setSuccess] = useState<boolean>(false);

  // Line 28: Function to send password reset email
  const sendResetEmail = async (email: string): Promise<boolean> => {
    // Line 30: Clear previous states
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Line 35: Call API to request password reset
      const response = await requestPasswordReset(email);
      
      // Line 38: Handle successful response
      if (response.success) {
        setSuccess(true);
        console.log('Password reset email sent successfully');
        return true;
      } else {
        // Line 43: Handle API success=false response
        setError(response.message || 'Failed to send reset email');
        return false;
      }
    } catch (apiError) {
      // Line 48: Handle API errors
      const error = apiError as ApiError;
      setError(error.message);
      console.error('Password reset request failed:', error);
      return false;
    } finally {
      // Line 54: Always stop loading
      setIsLoading(false);
    }
  };

  // Line 58: Function to reset password with token
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // Line 60: Clear previous states
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Line 65: Call API to confirm password reset
      const response = await confirmPasswordReset(token, newPassword);
      
      // Line 68: Handle successful response
      if (response.success) {
        setSuccess(true);
        console.log('Password reset successfully');
        return true;
      } else {
        // Line 73: Handle API success=false response
        setError(response.message || 'Failed to reset password');
        return false;
      }
    } catch (apiError) {
      // Line 78: Handle API errors
      const error = apiError as ApiError;
      setError(error.message);
      console.error('Password reset failed:', error);
      return false;
    } finally {
      // Line 84: Always stop loading
      setIsLoading(false);
    }
  };

  // Line 88: Function to clear error state
  const clearError = (): void => {
    setError('');
  };

  // Line 93: Function to clear success state
  const clearSuccess = (): void => {
    setSuccess(false);
  };

  // Line 98: Return all state and functions
  return {
    isLoading,
    error,
    success,
    sendResetEmail,
    resetPassword,
    clearError,
    clearSuccess,
  };
};