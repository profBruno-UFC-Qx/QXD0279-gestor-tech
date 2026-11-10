import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/Auth'
import { apiRequest } from './api'

export async function login(data: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function getCurrentUser(): Promise<User> {
    return apiRequest<User>('/auth/me')
}
