import { getAuthToken, removeAuthSession } from './auth.storage'

const DEFAULT_API_URL = 'http://localhost:8080'
const DEFAULT_TIMEOUT_MS = 15_000
export const AUTH_UNAUTHORIZED_EVENT = 'gestor-tech:auth:unauthorized'

const apiUrl = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '')
const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS)
const requestTimeout = Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_TIMEOUT_MS

interface ErrorPayload {
    message?: unknown
    error?: unknown
    errors?: unknown
}

export class ApiError extends Error {
    readonly status: number
    readonly details: unknown

    constructor(message: string, status: number, details?: unknown) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

function extractErrorMessage(payload: unknown, fallback: string): string {
    if (typeof payload === 'string' && payload.trim()) return payload
    if (!payload || typeof payload !== 'object') return fallback

    const { message, error, errors } = payload as ErrorPayload
    if (typeof message === 'string' && message.trim()) return message
    if (typeof error === 'string' && error.trim()) return error

    if (error && typeof error === 'object') {
        const nestedMessage = (error as ErrorPayload).message
        if (typeof nestedMessage === 'string' && nestedMessage.trim()) return nestedMessage
    }

    if (Array.isArray(errors)) {
        const firstError = errors[0]
        if (typeof firstError === 'string' && firstError.trim()) return firstError
        if (firstError && typeof firstError === 'object') {
            const firstMessage = (firstError as ErrorPayload).message
            if (typeof firstMessage === 'string' && firstMessage.trim()) return firstMessage
        }
    }

    return fallback
}

async function readResponseBody(response: Response): Promise<unknown> {
    if (response.status === 204) return undefined

    const contentType = response.headers.get('content-type') ?? ''
    const text = await response.text()
    if (!text) return undefined

    if (contentType.includes('json')) {
        try {
            return JSON.parse(text) as unknown
        } catch {
            throw new ApiError('A API retornou um JSON inválido.', response.status, text)
        }
    }

    return text
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), requestTimeout)
    const headers = new Headers(options.headers)
    const token = getAuthToken()

    headers.set('Accept', 'application/json')
    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }
    if (token) headers.set('Authorization', `Bearer ${token}`)

    try {
        const response = await fetch(`${apiUrl}${path.startsWith('/') ? path : `/${path}`}`, {
            ...options,
            headers,
            signal: controller.signal,
        })
        const body = await readResponseBody(response)

        if (!response.ok) {
            if (response.status === 401) {
                removeAuthSession()
                window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
            }

            throw new ApiError(
                extractErrorMessage(body, `A API respondeu com o status ${response.status}.`),
                response.status,
                body,
            )
        }

        return body as T
    } catch (error: unknown) {
        if (error instanceof ApiError) throw error
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiError('A API demorou demais para responder. Tente novamente.', 0)
        }

        throw new ApiError(
            `Não foi possível conectar à API em ${apiUrl}. Verifique se o backend está em execução.`,
            0,
            error,
        )
    } finally {
        window.clearTimeout(timeoutId)
    }
}
