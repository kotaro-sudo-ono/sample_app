import { createRouter, createWebHistory } from 'vue-router';
import home from '@/components/pages/home/home.vue';
import SignIn from '@/components/pages/signIn/SignIn.vue';
import signUp from '@/components/pages/signUp/signUp.vue';
import routePage from '@/components/pages/routePAge/routePage.vue';
import recordCalender from '@/components/pages/recordCalender/recordCalender.vue';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'homeGuest', component: home },
    { path: '/dashboard', name: 'homeDashboard', component: routePage },
    { path: '/signIn', name: 'signIn', component: SignIn },
    { path: '/signUp', name: 'signUp', component: signUp },
    { path: '/homeDashboard/recordCalender', name: 'recordCalender', component: recordCalender },
  ],
});
export default router;
