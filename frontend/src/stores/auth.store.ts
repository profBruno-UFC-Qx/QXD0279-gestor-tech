import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import * as authService from '@/services/auth'
import { AUTH_UNAUTHORIZED_EVENT } from '@/services/api'
import {
    getAuthToken,
    getAuthUser,
    removeAuthSession,
    setAuthToken,
    setAuthUser,
} from '@/services/auth.storage'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/Auth'

function isUser(value: unknown): value is User {
    return Boolean(
        value
        && typeof value === 'object'
        && typeof (value as Partial<User>).id === 'number'
        && typeof (value as Partial<User>).nome === 'string'
        && typeof (value as Partial<User>).email === 'string',
    )
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(getAuthUser())
    const token = ref<string | null>(getAuthToken())
    const isInitialized = ref(false)
    const isAuthenticated = computed(() => Boolean(token.value && user.value))

    function saveSession(response: AuthResponse | null | undefined): void {
        if (
            !response
            || typeof response.token !== 'string'
            || !response.token.trim()
            || !isUser(response.user)
        ) {
            throw new Error('A resposta de autenticação da API é inválida.')
        }

        token.value = response.token
        user.value = response.user
        setAuthToken(response.token)
        setAuthUser(response.user)
        isInitialized.value = true
    }

    async function login(credentials: LoginRequest): Promise<void> {
        const response = await authService.login(credentials)

        saveSession(response)
    }

    async function register(data: RegisterRequest): Promise<void> {
        const response = await authService.register(data)

        saveSession(response)
    }

    async function restoreSession(): Promise<boolean> {
        if (isInitialized.value) return isAuthenticated.value

        if (!token.value) {
            isInitialized.value = true
            return false
        }

        try {
            const currentUser = await authService.getCurrentUser()
            if (!isUser(currentUser)) throw new Error('A sessão retornada pela API é inválida.')

            user.value = currentUser
            setAuthUser(currentUser)
            return true
        } catch {
            logout()
            return false
        } finally {
            isInitialized.value = true
        }
    }

    function logout(): void {
        user.value = null
        token.value = null
        removeAuthSession()
        isInitialized.value = true
    }

    function handleUnauthorized(): void {
        user.value = null
        token.value = null
        isInitialized.value = true
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)

    if (import.meta.hot) {
        import.meta.hot.dispose(() => {
            window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
        })
    }

    return {
        user,
        token,
        isInitialized,
        isAuthenticated,
        login,
        register,
        restoreSession,
        logout,
    }
})
