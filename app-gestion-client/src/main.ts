import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

import Vuesax from 'vuesax'

import 'vuesax/dist/vuesax.css' //Vuesax styles

import App from './App.vue'
import router from './router'

// import '@/assets/css/bootstrap.min.css'
// import '@/assets/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'


const app = createApp(App)

app.use(createPinia())
app.use(router)
// app.use(Vuesax, {
//   // Options here
// })
app.use(VueCookies, {
  expires: '1d'
})
app.mount('#app')
