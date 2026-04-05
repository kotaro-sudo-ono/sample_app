import { api } from '@/shared/api/api';

type LoginResponse = {
  token: string;
};

export const login = (email: string, password: string) => {
  return api.post<LoginResponse>('/user/login', { email, password });
};

export const register = (email: string, name: string, password: string) => {
  return api.post('/user/register', { email, name, password });
};
