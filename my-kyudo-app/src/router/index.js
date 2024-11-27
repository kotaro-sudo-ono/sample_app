import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login/login.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
