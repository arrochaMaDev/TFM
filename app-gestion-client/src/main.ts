import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

import App from './App.vue'
import router from './router'

// PRIMEVUE
import PrimeVue from 'primevue/config';
// import 'primevue/resources/themes/lara-light-amber/theme.css';
// import 'primevue/resources/themes/lara-dark-amber/theme.css';

// import '../node_modules/primeflex/primeflex.css'
// import 'primeflex/primeflex.scss';
// import 'primeicons/primeicons.css'

// import '@/assets/styles.scss';


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCookies, {
  expires: '1d'
})
app.use(PrimeVue)



app.mount('#app')
