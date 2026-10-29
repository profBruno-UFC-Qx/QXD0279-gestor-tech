export type ProjectStatus = 'PLANEJADO' | 'EM_ANDAMENTO' | 'CONCLUIDO'
export type ProjectRole = 'GERENTE' | 'MEMBRO'

export interface Project {
    id: number
    nome: string
    descricao: string
    dataInicio: string
    dataFim: string
    status: ProjectStatus
    gerenteId: number
    gerente?: {
        id: number
        nome: string
    }
    papelAtual?: ProjectRole
}

export interface ProjectPayload {
    nome: string
    descricao: string
    dataInicio: string
    dataFim: string
    status: ProjectStatus
}
