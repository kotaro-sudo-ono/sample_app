import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/API/user/userApi';
import { authStore } from '@/store/auth';

export const useSignIn = (email: Ref<string>, password: Ref<string>) => {
  const router = useRouter();
  const loginError = ref('');
  const useAuthStore = authStore();

  const loginForm = async () => {
    try {
      const response = await login(email.value, password.value);
      const token = response.data.token;
      useAuthStore.login(token);
      router.push({ name: 'homeDashboard' });
    } catch {
      loginError.value = 'ログインに失敗しました';
    }
  };

  return { loginForm, loginError };
};
