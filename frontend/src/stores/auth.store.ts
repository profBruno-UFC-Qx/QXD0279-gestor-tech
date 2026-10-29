import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import * as authService from '@/services/auth'
import {
    getAuthToken,
    getAuthUser,
    removeAuthToken,
    setAuthToken,
    setAuthUser,
} from '@/services/auth.storage'
import type { LoginRequest, RegisterRequest, User } from '@/types/Auth'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(getAuthUser())
    const token = ref<string | null>(getAuthToken())
    const isAuthenticated = computed(() => Boolean(token.value))

    async function login(credentials: LoginRequest): Promise<void> {
        const response = await authService.login(credentials)

        token.value = response.token
        user.value = response.user
        setAuthToken(response.token)
        setAuthUser(response.user)
    }

    async function register(data: RegisterRequest): Promise<void> {
        const response = await authService.register(data)

        token.value = response.token
        user.value = response.user
        setAuthToken(response.token)
        setAuthUser(response.user)
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
        register,
        logout,
    }
})
