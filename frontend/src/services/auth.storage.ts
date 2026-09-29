const AUTH_TOKEN_KEY = 'token'

function getLocalStorage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage
}

export function getAuthToken(): string | null {
    return getLocalStorage()?.getItem(AUTH_TOKEN_KEY) ?? null
}

export function setAuthToken(token: string): void {
    getLocalStorage()?.setItem(AUTH_TOKEN_KEY, token)
}

export function removeAuthToken(): void {
    getLocalStorage()?.removeItem(AUTH_TOKEN_KEY)
}
