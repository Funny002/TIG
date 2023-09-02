import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'App',
      redirect: '/home',
      children: [
        { name: 'Home', path: 'home', component: () => import('@views/Home/index.vue') },
        { name: 'Docs', path: 'docs/:name', component: () => import('@/Docs/index.vue') },
        { name: 'Game', path: 'game/:name', component: () => import('@/Game/index.vue') },
      ],
    },
    { name: 'Error', path: '/:pathMatch(.*)*', component: () => import('@views/Error/index.vue') },
  ],
});

router.beforeEach((_, __, next) => {
  document.title = window.__CONFIG__.title;
  next();
});

export default router;
