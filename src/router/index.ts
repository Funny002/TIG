import { createRouter, createWebHistory } from 'vue-router';
import { GameRouter } from '@games/index.ts';

const Views = [
  { name: 'Home', path: 'home', component: () => import('@views/Home/index.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: 'App', path: '/', redirect: '/home', component: () => import('@layout/index.vue'), children: Views },
    { name: 'Games', path: '/games', component: () => import('@layout/games.vue'), children: GameRouter },
    { name: 'Error', path: '/:pathMatch(.*)*', component: () => import('@views/Error/index.vue') },
  ],
});

// router.beforeEach((to, from, next) => {
//   next();
// });

export default router;
