import AppView from './App/index.vue';
import { createApp, App } from 'vue';
import router from './router';

async function bootstrap(app: App<Element>) {
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

bootstrap(createApp(AppView)).then(() => {
  console.log('bootstrap');
});
