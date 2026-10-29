import type { Activity, ActivityPayload, ActivityStatus, ProjectMetrics } from '@/types/Activity'
import { getAuthUser } from './auth.storage'
import {
    nextLocalId,
    readLocalDatabase,
    type LocalDatabase,
    writeLocalDatabase,
} from './local-database'

function hydrateActivity(activity: Activity, database: LocalDatabase): Activity {
    const responsible = activity.responsavelId === null
        ? null
        : database.users.find((user) => user.id === activity.responsavelId) ?? null
    const project = database.projects.find((item) => item.id === activity.projetoId)

    return {
        ...activity,
        responsavel: responsible,
        projeto: {
            id: activity.projetoId,
            nome: project?.nome ?? 'Projeto',
        },
    }
}

export async function listProjectActivities(projectId: number): Promise<Activity[]> {
    const database = readLocalDatabase()

    return database.activities
        .filter((activity) => activity.projetoId === projectId)
        .map((activity) => hydrateActivity(activity, database))
}

export async function listMyActivities(): Promise<Activity[]> {
    const database = readLocalDatabase()
    const currentUser = getAuthUser()
    if (!currentUser) return []

    return database.activities
        .filter((activity) => activity.responsavelId === currentUser.id)
        .map((activity) => hydrateActivity(activity, database))
}

export async function createActivity(projectId: number, data: ActivityPayload): Promise<Activity> {
    const database = readLocalDatabase()
    if (!database.projects.some((project) => project.id === projectId)) {
        throw new Error('Projeto não encontrado.')
    }

    const activity: Activity = {
        ...data,
        id: nextLocalId(database.activities),
        projetoId: projectId,
    }

    database.activities.push(activity)
    writeLocalDatabase(database)
    return hydrateActivity(activity, database)
}

export async function updateActivity(
    projectId: number,
    activityId: number,
    data: ActivityPayload,
): Promise<Activity> {
    const database = readLocalDatabase()
    const activityIndex = database.activities.findIndex((activity) => (
        activity.id === activityId && activity.projetoId === projectId
    ))
    if (activityIndex < 0) throw new Error('Atividade não encontrada.')

    const activity: Activity = {
        ...database.activities[activityIndex]!,
        ...data,
        id: activityId,
        projetoId: projectId,
    }

    database.activities[activityIndex] = activity
    writeLocalDatabase(database)
    return hydrateActivity(activity, database)
}

export async function updateActivityStatus(
    projectId: number,
    activityId: number,
    status: ActivityStatus,
): Promise<Activity> {
    const database = readLocalDatabase()
    const activityIndex = database.activities.findIndex((activity) => (
        activity.id === activityId && activity.projetoId === projectId
    ))
    if (activityIndex < 0) throw new Error('Atividade não encontrada.')

    const activity: Activity = {
        ...database.activities[activityIndex]!,
        status,
    }

    database.activities[activityIndex] = activity
    writeLocalDatabase(database)
    return hydrateActivity(activity, database)
}

export async function deleteActivity(projectId: number, activityId: number): Promise<void> {
    const database = readLocalDatabase()
    const exists = database.activities.some((activity) => (
        activity.id === activityId && activity.projetoId === projectId
    ))
    if (!exists) throw new Error('Atividade não encontrada.')

    database.activities = database.activities.filter((activity) => activity.id !== activityId)
    writeLocalDatabase(database)
}

function isBeforeToday(date: string, today: Date): boolean {
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const deadline = new Date(`${date}T00:00:00`)

    return deadline < normalizedToday
}

export function calculateProjectMetrics(
    activities: Activity[],
    today = new Date(),
): ProjectMetrics {
    const concluidas = activities.filter((activity) => activity.status === 'CONCLUIDA').length
    const atrasadas = activities.filter(
        (activity) => activity.status !== 'CONCLUIDA' && isBeforeToday(activity.prazo, today),
    ).length

    return {
        total: activities.length,
        concluidas,
        pendentes: activities.length - concluidas,
        atrasadas,
        percentualConclusao: activities.length
            ? Math.round((concluidas / activities.length) * 100)
            : 0,
    }
}
