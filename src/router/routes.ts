import { RouteRecordRaw } from 'vue-router';
import { defineAsyncComponent } from 'vue';

export type RoutesRaw = RouteRecordRaw & MenuItem;

export interface MenuItem {
  description?: string;
  version?: string;
}

// 贪吃蛇
const GluttonousSnake = defineAsyncComponent(() => import('@games/GluttonousSnake/index.vue'));

// 游戏路由
export const GameRoutes: RoutesRaw[] = [
  { path: 'GluttonousSnake', name: 'Gluttonous Snake', version: '0.0.1', component: GluttonousSnake },
];

// 页面路由
const Home = defineAsyncComponent(() => import('@views/home/index.vue'));
export const HomeRoutes: RoutesRaw[] = [
  { path: 'home', name: 'Home', component: Home },
];

// 路由
export const routes: RoutesRaw[] = [
  { path: '/', name: 'Layout', redirect: '/home', component: () => import('@layout/index.vue'), children: HomeRoutes },
  { path: '/games', name: 'LayoutGames', component: () => import('@layout/games.vue'), children: GameRoutes },
];

export default routes;
