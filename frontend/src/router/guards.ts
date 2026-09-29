import type { NavigationGuard } from 'vue-router'

import { getAuthToken } from '@/services/auth.storage'

export const authGuard: NavigationGuard = () => {
    if (!getAuthToken()) {
        return { name: 'login' }
    }

    return true
}
