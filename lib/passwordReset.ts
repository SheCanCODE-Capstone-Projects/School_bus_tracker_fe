// Line 1: Import the configured axios instance
import api from './api';

// Line 4: Define TypeScript interfaces for API requests and responses
export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetRequestResponse {
  success: boolean;
  message: string;
  resetToken?: string; // Optional, might be included for debugging
}

export interface PasswordResetConfirmData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetConfirmResponse {
  success: boolean;
  message: string;
}

// Line 22: API Error interface for consistent error handling
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Line 28: Function to request password reset (Step 1: Send email)
export const requestPasswordReset = async (
  email: string
): Promise<PasswordResetRequestResponse> => {
  try {
    // Line 32: Make POST request to password reset request endpoint
    const response = await api.post<PasswordResetRequestResponse>(
      'https://school-bus-tracker-be.onrender.com/api/auth/password-reset/request',
      { email }
    );
    
    // Line 37: Return successful response data
    return response.data;
  } catch (error: any) {
    // Line 40: Handle different types of errors
    if (error.response) {
      // Server responded with error status
      throw {
        message: error.response.data?.message || 'Failed to send reset email',
        status: error.response.status,
        code: error.response.data?.code
      } as ApiError;
    } else if (error.request) {
      // Network error - no response received
      throw {
        message: 'Network error. Please check your connection.',
        status: 0
      } as ApiError;
    } else {
      // Other error
      throw {
        message: error.message || 'An unexpected error occurred',
        status: 0
      } as ApiError;
    }
  }
};

// Line 60: Function to confirm password reset (Step 2: Reset with token)
export const confirmPasswordReset = async (
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<PasswordResetConfirmResponse> => {
  try {
    // Line 65: Make POST request to password reset confirm endpoint
    const response = await api.post<PasswordResetConfirmResponse>(
      'https://school-bus-tracker-be.onrender.com/api/auth/password-reset/confirm',
      { 
        token, 
        newPassword,
        confirmPassword
      }
    );
    
    // Line 73: Return successful response data
    return response.data;
  } catch (error: any) {
    // Line 76: Handle different types of errors
    if (error.response) {
      // Server responded with error status
      throw {
        message: error.response.data?.message || 'Failed to reset password',
        status: error.response.status,
        code: error.response.data?.code
      } as ApiError;
    } else if (error.request) {
      // Network error - no response received
      throw {
        message: 'Network error. Please check your connection.',
        status: 0
      } as ApiError;
    } else {
      // Other error
      throw {
        message: error.message || 'An unexpected error occurred',
        status: 0
      } as ApiError;
    }
  }
};