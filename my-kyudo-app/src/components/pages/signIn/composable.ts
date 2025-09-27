import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/shared/api/api'; // 共通APIをインポート

interface LoginResponse {
  token: string;
}

export const useSignIn = (email: Ref<string>, password: Ref<string>) => {
  const router = useRouter();
  const loginError = ref('');

  const loginForm = async () => {
    try {
      const response = await api.post<LoginResponse>('/user/login', {
        email: email.value,
        password: password.value,
      });

      const token = response.data.token;
      localStorage.setItem('jwt', token);

      router.push({ name: 'homeDashboard' });
    } catch (error) {
      loginError.value = 'ログインに失敗しました';
    }
  };

  return {
    loginForm,
    loginError,
  };
};
