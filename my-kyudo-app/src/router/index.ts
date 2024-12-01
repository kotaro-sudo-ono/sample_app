import { createRouter, createWebHistory } from 'vue-router';
import home from '../components/Home/home.vue';
import login from '../components/login/login.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: home },
    { path: '/login', name: 'login', component: login },
  ],
});
export default router;
