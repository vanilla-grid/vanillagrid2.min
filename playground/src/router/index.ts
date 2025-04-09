import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import GridTest from '../pages/GridTest.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/grid-test', name: 'GridTest', component: GridTest },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
