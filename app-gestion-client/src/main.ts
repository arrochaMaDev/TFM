// import './assets/main.css'
import './main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

import App from './App.vue'
import router from './router'

// Primevue
import PrimeVue from 'primevue/config'
// import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCookies, {
  expires: '1d'
})

//Primevue
app.use(PrimeVue, { ripple: true })

app.mount('#app')
