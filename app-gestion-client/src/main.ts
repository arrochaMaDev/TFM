// import './assets/main.css' // vue por defecto
import { G } from './G'
import('@fortawesome/fontawesome-free/css/all.css')

import 'primevue/resources/primevue.min.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
// import 'prismjs/themes/prism-coy.css'
import './assets/styles/layout.scss'
import './assets/styles/main.scss'

import { createApp, reactive } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'
// import App from './App.vue'
import App from '@/App/AppLayout.vue' // SkaiTS
import router from './router'

// Primevue
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

// import 'primeflex/primeflex.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'

// import 'primeflex/themes/primeone-dark.scss'
// import 'primeflex/themes/primeone-light.scss'

const app = createApp(App)

app.config.globalProperties.$appState = reactive({ theme: 'lara-light-indigo', darkTheme: false })

app.use(createPinia())
app.use(router)
app.use(VueCookies, {
  expires: '1d'
})

//Primevue
app.use(PrimeVue, { ripple: true, inputStyle: 'outlined' }) // oulined??
app.use(ConfirmationService)
app.use(ToastService)
app.directive('tooltip', Tooltip)

// router.beforeEach(function (to: any, from: any, next: any) {
//   window.scrollTo(0, 0)
//   next()
// })

// if (import.meta.env.PROD) {
//   app.config.errorHandler = function (err, vm, info) {
//     console.log(err);
//   };
// }

app.mount('#app')
