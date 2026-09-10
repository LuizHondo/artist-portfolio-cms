import client from './client';

export interface AdminUser {
  id: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  admin: AdminUser;
}

export interface ProfileResponse {
  success: boolean;
  data: AdminUser & { createdAt: string };
}

export const authApi = {
  login: (email: string, password: string) =>
    client.post<LoginResponse>('/admin/login', { email, password }),

  getProfile: () =>
    client.get<ProfileResponse>('/admin/profile'),

  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    client.post('/admin/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    }),
};
