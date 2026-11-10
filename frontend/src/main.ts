import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

import '@fontsource-variable/inter'
import 'vue-sonner/style.css'
import './assets/styles/global.css'

import App from './App.vue'
import { AUTH_UNAUTHORIZED_EVENT } from './services/api'
import { clearLegacyMockStorage } from './services/auth.storage'

clearLegacyMockStorage()

const app = createApp(App)

app.use(createPinia())
app.use(router)

window.addEventListener(AUTH_UNAUTHORIZED_EVENT, () => {
    const currentRoute = router.currentRoute.value
    const isPublicRoute = currentRoute.name === 'login' || currentRoute.name === 'register'

    if (currentRoute.name && !isPublicRoute) {
        void router.replace({
            name: 'login',
            query: { redirect: currentRoute.fullPath },
        })
    }
})

app.mount('#app')
