export interface User {
    id: number
    nome: string
    email: string
    role: 'ADMIN' | 'USER'
}

export interface LoginRequest {
    email: string
    senha: string
}

export interface RegisterRequest {
    nome: string
    email: string
    senha: string
}

export interface AuthResponse {
    token: string
    user: User
}
