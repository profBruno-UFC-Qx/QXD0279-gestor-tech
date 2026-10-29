import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/Auth'
import { saveLocalUser } from './local-database'

function createLocalSession(email: string, nome: string): AuthResponse {
    const user = {
        id: 1,
        nome,
        email,
    }

    saveLocalUser(user)

    return {
        token: 'local-development-session',
        user,
    }
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const email = data.email.trim()
    const nameFromEmail = email.split('@')[0]?.trim() ?? ''

    return createLocalSession(email, nameFromEmail || 'Usuário')
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    return createLocalSession(data.email.trim(), data.nome.trim())
}
