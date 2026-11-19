import type { Activity, ActivityPayload, ActivityStatus, ProjectMetrics } from '@/types/Activity'
import type { Project } from '@/types/Project'
import { apiRequest } from './api'
import { listProjects } from './project'

export async function listProjectActivities(projectId: number): Promise<Activity[]> {
    return apiRequest<Activity[]>(`/projects/${projectId}/activities`)
}

export async function listMyActivities(): Promise<Activity[]> {
    return apiRequest<Activity[]>('/activities/mine')
}

export async function listKanbanData(): Promise<{ projects: Project[]; activities: Activity[] }> {
    const [projects, myActivities] = await Promise.all([listProjects(), listMyActivities()])
    const managedProjects = projects.filter((project) => project.papelAtual === 'GERENTE')
    const managedActivityGroups = await Promise.all(
        managedProjects.map(async (project) => ({
            project,
            activities: await listProjectActivities(project.id),
        })),
    )
    const activityById = new Map<number, Activity>()
    const projectById = new Map(projects.map((project) => [project.id, project] as const))

    for (const activity of myActivities) {
        const project = projectById.get(activity.projetoId)
        activityById.set(
            activity.id,
            project
                ? { ...activity, projeto: { id: project.id, nome: project.nome } }
                : activity,
        )
    }

    for (const { project, activities } of managedActivityGroups) {
        for (const activity of activities) {
            activityById.set(activity.id, {
                ...activity,
                projeto: { id: project.id, nome: project.nome },
            })
        }
    }

    return {
        projects,
        activities: [...activityById.values()].sort(
            (first, second) => first.prazo.localeCompare(second.prazo) || first.id - second.id,
        ),
    }
}

export async function createActivity(projectId: number, data: ActivityPayload): Promise<Activity> {
    return apiRequest<Activity>(`/projects/${projectId}/activities`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateActivity(
    projectId: number,
    activityId: number,
    data: ActivityPayload,
): Promise<Activity> {
    return apiRequest<Activity>(`/projects/${projectId}/activities/${activityId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export async function updateActivityStatus(
    projectId: number,
    activityId: number,
    status: ActivityStatus,
): Promise<Activity> {
    return apiRequest<Activity>(`/projects/${projectId}/activities/${activityId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    })
}

export async function deleteActivity(projectId: number, activityId: number): Promise<void> {
    await apiRequest<void>(`/projects/${projectId}/activities/${activityId}`, {
        method: 'DELETE',
    })
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
