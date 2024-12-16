import { createApp } from 'vue';
import App from './App.vue';
import uviewPlus, { setConfig } from 'uview-plus'
import { createPinia } from 'pinia';





const app = createApp(App);


const pinia = createPinia();

app.use(uviewPlus);
app.use(pinia);
app.mount('#app');
