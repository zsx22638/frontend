import { createApp } from 'vue';
import App from './App.vue';
import uviewPlus, { setConfig } from 'uview-plus'

const app = createApp(App);
import { createPinia } from 'pinia';

const pinia = createPinia();

app.use(uviewPlus);
app.use(pinia);
app.mount('#app');
