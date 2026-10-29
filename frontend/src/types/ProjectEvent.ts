export type ProjectEventType =
    | 'project-created'
    | 'project-updated'
    | 'activity-created'
    | 'activity-updated'
    | 'activity-status'
    | 'activity-deleted'
    | 'member-added'
    | 'member-removed'

export interface ProjectEvent {
    id: number
    projectId: number
    actorId: number | null
    actorName: string
    type: ProjectEventType
    message: string
    createdAt: string
}
