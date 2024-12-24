import { createRouter, createWebHistory } from 'vue-router';
import home from '../components/Home/home.vue';
import logIn from '../components/logIn/logIn.vue';
import signUp from '../components/signUp/signUp.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: home },
    { path: '/logIn', name: 'logIn', component: logIn },
    { path: '/signUp', name: 'signUp', component: signUp },
  ],
});
export default router;
