import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { ToastService } from 'primevue'
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
      darkModeSelector: '.dark',
    },
  },
  pt: {
    card: {
      content: { class: 'flex flex-wrap gap-4' },
      root: { class: 'hover:shadow-md rounded-lg' },
    },
  },
})
app.use(ToastService)
app.mount('#app')
