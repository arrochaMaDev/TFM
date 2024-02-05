// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'
import App from './App.vue'

import router from './router'

// adlash template
import { createBootstrap } from 'bootstrap-vue-next'
import PortalVue from 'portal-vue'

import VueApexCharts from 'vue3-apexcharts'
// import Swiper from 'swiper' // facilita hacer galerías y presentaciones. Permite hacer swaps en pantalla tactil. No está en el main original del template

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

// import 'swiper/css' // para hacer galerías y presentaciones
// import 'swiper/css/bundle'
// import 'flatpickr/dist/flatpickr.css' // selector de fechas y hora desde un calendario
import './assets/custom.scss'

// Primevue
import PrimeVue from 'primevue/config'
// import ToastService from 'primevue/toastservice'

import 'primeflex/primeflex.scss'
import 'primeicons/primeicons.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(VueCookies, {
  expires: '1d'
})

// adlash template
// app.use(BootstrapVueNext)
app.use(createBootstrap())
app.use(VueApexCharts)
app.use(PortalVue)

// Primevue
app.use(PrimeVue, { ripple: true })
// app.use(ToastService)

app.use(Toast, { transition: 'Vue-Toastification__bounce', maxToasts: 20, newestOnTop: true })

app.mount('#app')
