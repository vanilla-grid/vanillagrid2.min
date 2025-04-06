import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
/*
import { getVanillanote, getVanillanoteConfig } from 'vanillanote2';
import type { Vanillanote } from 'vanillanote2';
*/
const app = createApp(App);
/*
// 1. Vanillanote 객체 생성
const vnConfig = getVanillanoteConfig();
const vn: Vanillanote = getVanillanote(vnConfig);
vn.init();
// 2. 전역 속성으로 등록

app.config.globalProperties.$vn = vn;
*/
// 3. 앱 마운트
app.use(router).mount('#app');
