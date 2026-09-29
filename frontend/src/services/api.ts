import axios from 'axios'

import { getAuthToken } from './auth.storage'

export const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10_000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = getAuthToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

interface ApiErrorPayload {
    message?: string
    error?: string | { message?: string }
}

export function getApiErrorMessage(
    error: unknown,
    fallback = 'Não foi possível concluir a solicitação.',
): string {
    if (!axios.isAxiosError<ApiErrorPayload>(error)) {
        return fallback
    }

    if (!error.response) {
        return 'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
    }

    const payload = error.response.data

    if (typeof payload?.error === 'string') {
        return payload.error
    }

    return payload?.error?.message ?? payload?.message ?? fallback
}

export default api
