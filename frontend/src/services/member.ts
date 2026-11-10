import type { ProjectMember } from '@/types/ProjectMember'
import { apiRequest } from './api'

export async function listProjectMembers(projectId: number): Promise<ProjectMember[]> {
    return apiRequest<ProjectMember[]>(`/projects/${projectId}/members`)
}

export async function addProjectMember(projectId: number, email: string): Promise<ProjectMember> {
    return apiRequest<ProjectMember>(`/projects/${projectId}/members`, {
        method: 'POST',
        body: JSON.stringify({ email }),
    })
}

export async function removeProjectMember(projectId: number, memberId: number): Promise<void> {
    await apiRequest<void>(`/projects/${projectId}/members/${memberId}`, {
        method: 'DELETE',
    })
}
