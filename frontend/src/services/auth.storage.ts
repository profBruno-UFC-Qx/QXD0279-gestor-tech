import type { User } from '@/types/Auth'

const AUTH_TOKEN_KEY = 'gestor-tech:auth:token'
const AUTH_USER_KEY = 'gestor-tech:auth:user'
const LEGACY_MOCK_KEYS = ['gestor-tech:local-database:v1', 'token', 'user'] as const

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
        const user: unknown = JSON.parse(storedUser)
        if (
            user
            && typeof user === 'object'
            && typeof (user as Partial<User>).id === 'number'
            && typeof (user as Partial<User>).nome === 'string'
            && typeof (user as Partial<User>).email === 'string'
        ) {
            return user as User
        }

        getLocalStorage()?.removeItem(AUTH_USER_KEY)
        return null
    } catch {
        getLocalStorage()?.removeItem(AUTH_USER_KEY)
        return null
    }
}

export function setAuthUser(user: User): void {
    getLocalStorage()?.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export function removeAuthSession(): void {
    getLocalStorage()?.removeItem(AUTH_TOKEN_KEY)
    getLocalStorage()?.removeItem(AUTH_USER_KEY)
}

export function clearLegacyMockStorage(): void {
    const storage = getLocalStorage()
    LEGACY_MOCK_KEYS.forEach((key) => storage?.removeItem(key))
}
