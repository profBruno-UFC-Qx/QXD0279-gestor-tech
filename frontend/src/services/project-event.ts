import type { ProjectEvent } from '@/types/ProjectEvent'
import { apiRequest } from './api'

export async function listProjectEvents(projectId: number): Promise<ProjectEvent[]> {
    return apiRequest<ProjectEvent[]>(`/projects/${projectId}/events`)
}
