export type UserRole = 'MANAGER' | 'MEMBER'

export interface User {
    id: number
    name: string
    email: string
    role: UserRole
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: User
}
