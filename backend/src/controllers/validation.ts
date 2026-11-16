import { z } from 'zod'

import { ActivityPriority, ActivityStatus } from '../entities/Activity'
import { ProjectStatus } from '../entities/Project'

function isValidDate(value: string): boolean {
    const parts = value.split('-').map(Number)
    const [year, month, day] = parts
    if (!year || !month || !day) return false

    const date = new Date(Date.UTC(year, month - 1, day))
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day
}

const dateSchema = z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use uma data no formato AAAA-MM-DD.')
    .refine(isValidDate, 'Informe uma data válida.')

export const positiveIdSchema = z.coerce.number()
    .int('O identificador deve ser um número inteiro.')
    .positive('O identificador deve ser positivo.')

export const projectSchema = z.object({
    nome: z.string().trim().min(2, 'Informe o nome do projeto.').max(120),
    descricao: z.string().trim().max(4_000).default(''),
    dataInicio: dateSchema,
    dataFim: dateSchema,
    status: z.enum(ProjectStatus),
}).strict().refine(
    (data) => data.dataFim >= data.dataInicio,
    { path: ['dataFim'], message: 'A data de término não pode ser anterior à data de início.' },
)

export const memberSchema = z.object({
    email: z.string().trim().email('Informe um e-mail válido.').max(180),
}).strict()

export const activitySchema = z.object({
    titulo: z.string().trim().min(2, 'Informe o título da atividade.').max(160),
    descricao: z.string().trim().max(4_000).default(''),
    prioridade: z.enum(ActivityPriority),
    status: z.enum(ActivityStatus),
    prazo: dateSchema,
    responsavelId: z.number().int().positive().nullable().optional().default(null),
}).strict()

export const activityStatusSchema = z.object({
    status: z.enum(ActivityStatus),
}).strict()
