import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import * as authService from '@/services/auth.service'
import { getAuthToken, removeAuthToken, setAuthToken } from '@/services/auth.storage'
import type { LoginRequest, User } from '@/types/Auth'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(getAuthToken())
    const isAuthenticated = computed(() => Boolean(token.value))

    async function login(credentials: LoginRequest): Promise<void> {
        const response = await authService.login(credentials)

        token.value = response.token
        user.value = response.user
        setAuthToken(response.token)
    }

    function logout(): void {
        user.value = null
        token.value = null
        removeAuthToken()
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
    }
})
