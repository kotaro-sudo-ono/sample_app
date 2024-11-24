import { createApp, useAttrs } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import vuetify from './plugins/vuetify'



const app = createApp(App).use(vuetify).mount('#app')
