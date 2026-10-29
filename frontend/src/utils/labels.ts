import type { ActivityPriority, ActivityStatus } from '@/types/Activity'
import type { ProjectStatus } from '@/types/Project'

export const projectStatusLabels: Record<ProjectStatus, string> = {
    PLANEJADO: 'Planejado',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDO: 'Concluído',
}

export const activityStatusLabels: Record<ActivityStatus, string> = {
    A_FAZER: 'A fazer',
    EM_ANDAMENTO: 'Em andamento',
    CONCLUIDA: 'Concluída',
}

export const priorityLabels: Record<ActivityPriority, string> = {
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta',
}

export function formatDate(value: string): string {
    if (!value) return 'Sem prazo'
    return new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T00:00:00`))
}
