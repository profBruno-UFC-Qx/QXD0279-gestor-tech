import type { User } from './Auth'

export interface ProjectMember {
    id: number
    usuarioId: number
    projetoId: number
    usuario: User
}
