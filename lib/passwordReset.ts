const API_BASE = 'https://school-bus-tracker-be.onrender.com/api';

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetRequestResponse {
  success: boolean;
  message: string;
  resetToken?: string;
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

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const requestPasswordReset = async (
  email: string
): Promise<PasswordResetRequestResponse> => {
  const response = await fetch(`${API_BASE}/auth/password-reset/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw {
      message: data?.message || 'Failed to send reset email',
      status: response.status,
      code: data?.code,
    } as ApiError;
  }
  return data as PasswordResetRequestResponse;
};

export const confirmPasswordReset = async (
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<PasswordResetConfirmResponse> => {
  const response = await fetch(`${API_BASE}/auth/password-reset/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw {
      message: data?.message || 'Failed to reset password',
      status: response.status,
      code: data?.code,
    } as ApiError;
  }
  return data as PasswordResetConfirmResponse;
};