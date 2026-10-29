import type { User } from './Auth'

export type ActivityPriority = 'BAIXA' | 'MEDIA' | 'ALTA'
export type ActivityStatus = 'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDA'

export interface Activity {
    id: number
    titulo: string
    descricao: string
    prioridade: ActivityPriority
    status: ActivityStatus
    prazo: string
    responsavelId: number | null
    projetoId: number
    responsavel?: User | null
    projeto?: {
        id: number
        nome: string
    }
}

export interface ActivityPayload {
    titulo: string
    descricao: string
    prioridade: ActivityPriority
    status: ActivityStatus
    prazo: string
    responsavelId: number | null
}

export interface ProjectMetrics {
    total: number
    concluidas: number
    pendentes: number
    atrasadas: number
    percentualConclusao: number
}
