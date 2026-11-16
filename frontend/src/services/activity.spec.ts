import { describe, expect, it } from 'vitest'

import type { Activity, ActivityStatus } from '@/types/Activity'
import { isActivityOverdue } from '@/utils/activities'
import { calculateProjectMetrics } from './activity'

function activity(id: number, prazo: string, status: ActivityStatus): Activity {
    return {
        id,
        titulo: `Atividade ${id}`,
        descricao: '',
        prioridade: 'MEDIA',
        status,
        prazo,
        responsavelId: null,
        projetoId: 1,
        responsavel: null,
    }
}

describe('indicadores do projeto', () => {
    const today = new Date(2026, 10, 16, 15, 30)

    it('retorna zero por cento para um projeto vazio', () => {
        expect(calculateProjectMetrics([], today)).toEqual({
            total: 0,
            concluidas: 0,
            pendentes: 0,
            atrasadas: 0,
            percentualConclusao: 0,
        })
    })

    it('calcula todas as atividades e considera atrasada somente a pendente anterior a hoje', () => {
        const activities = [
            activity(1, '2026-11-16', 'A_FAZER'),
            activity(2, '2026-11-15', 'EM_ANDAMENTO'),
            activity(3, '2026-11-14', 'CONCLUIDA'),
            activity(4, '2026-11-20', 'A_FAZER'),
        ]

        expect(calculateProjectMetrics(activities, today)).toEqual({
            total: 4,
            concluidas: 1,
            pendentes: 3,
            atrasadas: 1,
            percentualConclusao: 25,
        })
        expect(isActivityOverdue(activities[0]!, today)).toBe(false)
        expect(isActivityOverdue(activities[1]!, today)).toBe(true)
        expect(isActivityOverdue(activities[2]!, today)).toBe(false)
    })
})
