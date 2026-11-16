import { AppDataSource } from '../database/data-source'
import { Activity, ActivityPriority, ActivityStatus } from '../entities/Activity'
import { Project, type ProjectStatus } from '../entities/Project'
import { ProjectMember } from '../entities/ProjectMember'
import { type UserRole } from '../entities/User'
import { AppError } from '../errors/AppError'
import { getAccessibleProject, requireProjectManager } from './project-access.service'

export interface ActivityInput {
    titulo: string
    descricao: string
    prioridade: ActivityPriority
    status: ActivityStatus
    prazo: string
    responsavelId: number | null
}

export interface ActivityResponse {
    id: number
    titulo: string
    descricao: string
    prioridade: ActivityPriority
    status: ActivityStatus
    prazo: string
    responsavelId: number | null
    projetoId: number
    responsavel: {
        id: number
        nome: string
        email: string
        role: UserRole
    } | null
    projeto?: {
        id: number
        nome: string
        status?: ProjectStatus
    }
}

function toActivityResponse(activity: Activity, includeProject = false): ActivityResponse {
    return {
        id: activity.id,
        titulo: activity.titulo,
        descricao: activity.descricao,
        prioridade: activity.prioridade,
        status: activity.status,
        prazo: activity.prazo,
        responsavelId: activity.responsavelId,
        projetoId: activity.projetoId,
        responsavel: activity.responsavel
            ? {
                id: activity.responsavel.id,
                nome: activity.responsavel.nome,
                email: activity.responsavel.email,
                role: activity.responsavel.role,
            }
            : null,
        ...(includeProject
            ? { projeto: { id: activity.projeto.id, nome: activity.projeto.nome, status: activity.projeto.status } }
            : {}),
    }
}

function normalizedInput(input: ActivityInput): ActivityInput {
    return {
        ...input,
        titulo: input.titulo.trim(),
        descricao: input.descricao.trim(),
    }
}

async function validateAssignee(project: Project, responsavelId: number | null): Promise<void> {
    if (responsavelId === null || responsavelId === project.gerenteId) return

    const isMember = await AppDataSource.getRepository(ProjectMember).existsBy({
        projetoId: project.id,
        usuarioId: responsavelId,
    })
    if (!isMember) {
        throw new AppError('O responsável deve ser o gerente ou um membro deste projeto.', 422)
    }
}

async function findProjectActivity(projectId: number, activityId: number): Promise<Activity> {
    const activity = await AppDataSource.getRepository(Activity).findOne({
        where: { id: activityId, projetoId: projectId },
        relations: { responsavel: true },
    })
    if (!activity) throw new AppError('Atividade não encontrada neste projeto.', 404)
    return activity
}

export async function listProjectActivities(
    projectId: number,
    userId: number,
): Promise<ActivityResponse[]> {
    await getAccessibleProject(projectId, userId)
    const activities = await AppDataSource.getRepository(Activity).find({
        where: { projetoId: projectId },
        relations: { responsavel: true },
        order: { prazo: 'ASC', id: 'ASC' },
    })
    return activities.map((activity) => toActivityResponse(activity))
}

export async function listMyActivities(userId: number): Promise<ActivityResponse[]> {
    const activities = await AppDataSource.getRepository(Activity).find({
        where: { responsavelId: userId },
        relations: { responsavel: true, projeto: true },
        order: { prazo: 'ASC', id: 'ASC' },
    })
    return activities.map((activity) => toActivityResponse(activity, true))
}

export async function createActivity(
    projectId: number,
    input: ActivityInput,
    userId: number,
): Promise<ActivityResponse> {
    const project = await requireProjectManager(projectId, userId)
    await validateAssignee(project, input.responsavelId)

    const repository = AppDataSource.getRepository(Activity)
    const activity = repository.create({
        ...normalizedInput(input),
        projetoId: projectId,
    })
    await repository.save(activity)

    return toActivityResponse(await findProjectActivity(projectId, activity.id))
}

export async function updateActivity(
    projectId: number,
    activityId: number,
    input: ActivityInput,
    userId: number,
): Promise<ActivityResponse> {
    const project = await requireProjectManager(projectId, userId)
    const activity = await findProjectActivity(projectId, activityId)
    await validateAssignee(project, input.responsavelId)

    await AppDataSource.getRepository(Activity).update(activity.id, normalizedInput(input))
    return toActivityResponse(await findProjectActivity(projectId, activity.id))
}

export async function updateActivityStatus(
    projectId: number,
    activityId: number,
    status: ActivityStatus,
    userId: number,
): Promise<ActivityResponse> {
    const project = await getAccessibleProject(projectId, userId)
    const activity = await findProjectActivity(projectId, activityId)

    if (project.gerenteId !== userId && activity.responsavelId !== userId) {
        throw new AppError('Apenas o gerente ou o responsável pode alterar o status desta atividade.', 403)
    }

    activity.status = status
    await AppDataSource.getRepository(Activity).save(activity)
    return toActivityResponse(activity)
}

export async function deleteActivity(
    projectId: number,
    activityId: number,
    userId: number,
): Promise<void> {
    await requireProjectManager(projectId, userId)
    const activity = await findProjectActivity(projectId, activityId)
    await AppDataSource.getRepository(Activity).remove(activity)
}
