import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Activity, ActivityStatus } from '@/types/Activity'
import type { Project } from '@/types/Project'
import { isActivityOverdue } from '@/utils/activities'
import { apiRequest } from './api'
import { calculateProjectMetrics, listKanbanData } from './activity'
import { listProjects } from './project'

vi.mock('./api', () => ({ apiRequest: vi.fn() }))
vi.mock('./project', () => ({ listProjects: vi.fn() }))

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

    describe('dados do Kanban', () => {
        beforeEach(() => {
            vi.resetAllMocks()
        })

        it('combina as atividades atribuídas ao usuário com todas as atividades dos projetos que gerencia', async () => {
            const projects: Project[] = [
                {
                    id: 1,
                    nome: 'Projeto gerenciado',
                    descricao: '',
                    dataInicio: '2026-01-01',
                    dataFim: '2026-12-31',
                    status: 'EM_ANDAMENTO',
                    gerenteId: 10,
                    papelAtual: 'GERENTE',
                },
                {
                    id: 2,
                    nome: 'Projeto de membro',
                    descricao: '',
                    dataInicio: '2026-01-01',
                    dataFim: '2026-12-31',
                    status: 'EM_ANDAMENTO',
                    gerenteId: 20,
                    papelAtual: 'MEMBRO',
                },
            ]
            const assignedToMe = { ...activity(1, '2026-11-20', 'A_FAZER'), projetoId: 2, responsavelId: 10 }
            const assignedToSomeoneElse = { ...activity(2, '2026-11-21', 'EM_ANDAMENTO'), responsavelId: 30 }
            const managedActivity = { ...activity(3, '2026-11-22', 'A_FAZER'), responsavelId: 30 }

            vi.mocked(listProjects).mockResolvedValue(projects)
            vi.mocked(apiRequest)
                .mockResolvedValueOnce([assignedToMe])
                .mockResolvedValueOnce([assignedToSomeoneElse, managedActivity])

            const result = await listKanbanData()

            expect(result.projects).toEqual(projects)
            expect(result.activities).toHaveLength(3)
            expect(result.activities.find((item) => item.id === 1)?.projeto?.nome).toBe('Projeto de membro')
            expect(result.activities.find((item) => item.id === 2)?.projeto?.nome).toBe('Projeto gerenciado')
            expect(result.activities.find((item) => item.id === 3)?.projeto?.nome).toBe('Projeto gerenciado')
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
