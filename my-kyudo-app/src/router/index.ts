import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/home/Home.vue';
import SignIn from '../components/signIn/SignIn.vue';
import SignUp from '../components/signUp/SignUp.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/signIn', name: 'signIn', component: SignIn },
    { path: '/signUp', name: 'signUp', component: SignUp },
  ],
});
export default router;
