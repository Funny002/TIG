import AppView from './App/index.vue';
import { createApp, App } from 'vue';
import router from './router';

import { GameRouter } from '@games/index.ts';

async function bootstrap(app: App<Element>) {
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

bootstrap(createApp(AppView)).then(() => {
  console.log(GameRouter);
  console.log('bootstrap');
});
