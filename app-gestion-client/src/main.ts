// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'

// Bootstrap

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// Adlash template
import './assets/custom.scss'

// Primevue
import PrimeVue from 'primevue/config'
import 'primeflex/primeflex.scss'
import 'primeicons/primeicons.css'

// Vue Toastification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(VueCookies, {
  expires: '1d'
})

// Primevue
app.use(PrimeVue, { ripple: true })

// Vue Toastification
app.use(Toast, { transition: 'Vue-Toastification__bounce', maxToasts: 20, newestOnTop: true })

app.mount('#app')
