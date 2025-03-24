// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './style.css';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css'; // Импортируем тему (можно выбрать другую, например, 'bootstrap')

const app = createApp(App);
const pinia = createPinia();

// Очистка localStorage при завершении сеанса
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('headlines');
});

app.use(pinia);
app.use(VueToast, {
  position: 'bottom-right', // Позиция уведомлений
  duration: 3000, // Длительность отображения (в миллисекундах)
});
app.mount('#app');
