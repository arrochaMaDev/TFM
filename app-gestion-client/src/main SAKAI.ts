// import './assets/main.css'

// import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'
// import 'primevue/resources/primevue.min.css'
// import 'primevue/resources/themes/aura-light-green/theme.css'

import 'primeflex/primeflex.scss'
import 'primeicons/primeicons.css'

import './assets/styles.scss'
// import './assets/theme.css'
// import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(PrimeVue, { ripple: true })
app.use(ToastService)

app.use(router)

app.use(createPinia())
app.use(VueCookies, {
  expires: '1d'
})

app.mount('#app')
