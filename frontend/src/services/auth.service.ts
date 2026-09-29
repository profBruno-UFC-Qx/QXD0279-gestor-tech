import type { AuthResponse, LoginRequest } from '@/types/Auth'
import api from './api'

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)

    return response.data
}
