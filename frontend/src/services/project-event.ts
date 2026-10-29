import type { ProjectEvent, ProjectEventType } from '@/types/ProjectEvent'
import { getAuthUser } from './auth.storage'
import { nextLocalId, readLocalDatabase, type LocalDatabase } from './local-database'

export function appendProjectEvent(
    database: LocalDatabase,
    projectId: number,
    type: ProjectEventType,
    message: string,
): ProjectEvent {
    const currentUser = getAuthUser()
    const actor = currentUser
        ? database.users.find((user) => user.id === currentUser.id) ?? currentUser
        : null
    const event: ProjectEvent = {
        id: nextLocalId(database.projectEvents),
        projectId,
        actorId: actor?.id ?? null,
        actorName: actor?.nome ?? 'Sistema',
        type,
        message,
        createdAt: new Date().toISOString(),
    }

    database.projectEvents.unshift(event)
    return event
}

export async function listProjectEvents(projectId: number): Promise<ProjectEvent[]> {
    const database = readLocalDatabase()
    return database.projectEvents
        .filter((event) => event.projectId === projectId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
