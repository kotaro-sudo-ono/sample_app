import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8082',
});

// リクエストごとに最新の JWT を自動でヘッダーに付ける
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// レスポンスで 401 を受けたら自動ログアウト用インターセプター
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      delete api.defaults.headers.common['Authorization'];
      // ここで router.push('/login') とかやると便利（ただし router を import するか注入する必要あり）
    }
    return Promise.reject(error);
  }
);
