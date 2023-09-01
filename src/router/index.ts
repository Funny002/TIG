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
    // { name: 'Games', path: '/games', component: () => import('@layout/games.vue'), children: GameRouter },
    { name: 'Error', path: '/:pathMatch(.*)*', component: () => import('@views/Error/index.vue') },
  ],
});

export default router;
