import type { NavigationGuard } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'

export const authGuard: NavigationGuard = async (to) => {
    const authStore = useAuthStore()
    const hasValidSession = await authStore.restoreSession()

    if (!hasValidSession) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }

    return true
}
