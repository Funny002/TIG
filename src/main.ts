import App from './app/index.vue';
import { createApp } from 'vue';
import router from './router';

createApp(App).use(router).mount('#app');
