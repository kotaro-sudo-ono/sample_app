import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8081',
});

// 保存してある JWT を自動でヘッダーに付ける
const token = localStorage.getItem('jwt');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

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
