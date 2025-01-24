import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import ytxTheme from './ytx.theme.'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: ytxTheme,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'base, primevue, components, utilities',
      },
    },
  },
})
app.mount('#app')
