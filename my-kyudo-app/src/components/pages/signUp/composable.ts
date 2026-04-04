import { ref, Ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/API/user/userApi';

export const useSignUp = (email: Ref<string>, name: Ref<string>, password: Ref<string>) => {
  const router = useRouter();

  const emailError = ref('');
  const nameError = ref('');
  const passwordError = ref('');
  const showEmailError = ref(false);
  const showNameError = ref(false);
  const showPasswordError = ref(false);

  const emailValidation = (): true | string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value) {
      return 'メールアドレスを入力してください';
    }
    if (!emailRegex.test(email.value)) {
      return '有効なメールアドレス形式で入力してください';
    }
    return true;
  };

  const submitForm = async () => {
    const emailCheck = emailValidation();
    if (emailCheck !== true) {
      showEmailError.value = true;
      setTimeout(() => (showEmailError.value = false), 1500);
      emailError.value = emailCheck;
      return;
    }

    if (!name.value) {
      showNameError.value = true;
      setTimeout(() => (showNameError.value = false), 1500);
      nameError.value = '名前を入力してください';
      return;
    }

    if (!password.value) {
      showPasswordError.value = true;
      setTimeout(() => (showNameError.value = false), 1500);
      passwordError.value = 'パスワードを入力してください';
    }

    try {
      const response = await register(email.value, name.value, password.value);
      console.log('登録成功:', response.data);
      if (response.status === 200) {
        router.push({ name: 'signIn' });
      }
    } catch (error: any) {
      if (error.response?.data?.email) {
        emailError.value = error.response.data.email;
      }
      if (error.response?.data?.name) {
        nameError.value = error.response.data.name;
      }
    }
  };

  watch(email, () => { emailError.value = ''; });
  watch(name, () => { nameError.value = ''; });

  return {
    submitForm,
    emailError,
    nameError,
    passwordError,
    showEmailError,
    showNameError,
    showPasswordError,
  };
};
