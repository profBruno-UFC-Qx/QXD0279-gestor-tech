import type { Project, ProjectPayload } from '@/types/Project'
import { apiRequest } from './api'

export async function listProjects(): Promise<Project[]> {
    return apiRequest<Project[]>('/projects')
}

export async function getProject(projectId: number): Promise<Project> {
    return apiRequest<Project>(`/projects/${projectId}`)
}

export async function createProject(data: ProjectPayload): Promise<Project> {
    return apiRequest<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateProject(projectId: number, data: ProjectPayload): Promise<Project> {
    return apiRequest<Project>(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}
