import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { getVanillagrid, getVanillagridConfig } from 'vanillagrid2';
import type { Vanillagrid } from 'vanillagrid2';

const app = createApp(App);

// 1. Vanillagrid 객체 생성
const vgConfig = getVanillagridConfig();
const vg: Vanillagrid = getVanillagrid(vgConfig);
vg.init();
// 2. 전역 속성으로 등록
app.config.globalProperties.$vg = vg;

// 3. 앱 마운트
app.use(router).mount('#app');
