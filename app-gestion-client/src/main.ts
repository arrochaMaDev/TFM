// import './assets/main.css'
import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

import App from './App.vue'

import router from './router'

// Primevue
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'

import 'primevue/resources/themes/aura-light-green/theme.css'

import '/node_modules/primeflex/primeflex.css'

// import 'primeflex/themes/primeone-dark.scss'
// import 'primeflex/themes/primeone-light.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCookies, {
  expires: '1d'
})

//Primevue
app.use(PrimeVue, {
  ripple: true
})

app.mount('#app')
