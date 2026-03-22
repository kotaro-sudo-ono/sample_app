import axios from 'axios';
import { api } from '@/shared/api/api';

type LoginResponse = {
  token: string;
};

export const login = (email: string, password: string) => {
  return api.post<LoginResponse>('/user/login', { email, password });
};

export const register = (email: string, name: string, password: string) => {
  return axios.post('http://localhost:8081/user/register', { email, name, password });
};
