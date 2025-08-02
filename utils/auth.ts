// import api from './api';

// type AuthResponse = { token: string };

// export async function register(data: {
//   username: string;
//   email: string;
//   password: string;
//   role?: 'user' | 'admin';
// }): Promise<AuthResponse> {
//   const res = await api.post<AuthResponse>('/api/auth/register', data);
//   return res.data;
// }

// export async function login(data: {
//   email: string;
//   password: string;
// }): Promise<AuthResponse> {
//   const res = await api.post<AuthResponse>('/api/auth/login', data);
//   return res.data;
// }

import api from './api';

type AuthResponse = { token: string };

export async function register(data: {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}): Promise<AuthResponse> {
  // ❌ was '/api/auth/register' — now fixed
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  // ❌ was '/api/auth/login' — now fixed
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
}
