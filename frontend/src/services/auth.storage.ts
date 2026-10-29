import type { User } from '@/types/Auth'

const AUTH_TOKEN_KEY = 'token'
const AUTH_USER_KEY = 'user'

function getLocalStorage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage
}

export function getAuthToken(): string | null {
    return getLocalStorage()?.getItem(AUTH_TOKEN_KEY) ?? null
}

export function setAuthToken(token: string): void {
    getLocalStorage()?.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthUser(): User | null {
    const storedUser = getLocalStorage()?.getItem(AUTH_USER_KEY)

    if (!storedUser) {
        return null
    }

    try {
        return JSON.parse(storedUser) as User
    } catch {
        getLocalStorage()?.removeItem(AUTH_USER_KEY)
        return null
    }
}

export function setAuthUser(user: User): void {
    getLocalStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function removeAuthToken(): void {
    getLocalStorage()?.removeItem(AUTH_TOKEN_KEY)
    getLocalStorage()?.removeItem(AUTH_USER_KEY)
}
