import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.use(createPinia());

app.mount('#app');
