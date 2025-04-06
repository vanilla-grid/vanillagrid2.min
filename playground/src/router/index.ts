import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import EditorTest from '../pages/EditorTest.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/editor-test', name: 'EditorTest', component: EditorTest },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
