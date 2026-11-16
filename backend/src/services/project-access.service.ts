import { AppDataSource } from '../database/data-source'
import { Project } from '../entities/Project'
import { ProjectMember } from '../entities/ProjectMember'
import { AppError } from '../errors/AppError'

export async function getAccessibleProject(projectId: number, userId: number): Promise<Project> {
    const project = await AppDataSource.getRepository(Project).findOne({
        where: { id: projectId },
        relations: { gerente: true },
    })

    if (!project) throw new AppError('Projeto não encontrado.', 404)
    if (project.gerenteId === userId) return project

    const isMember = await AppDataSource.getRepository(ProjectMember).existsBy({
        projetoId: projectId,
        usuarioId: userId,
    })

    if (!isMember) throw new AppError('Projeto não encontrado.', 404)
    return project
}

export async function requireProjectManager(projectId: number, userId: number): Promise<Project> {
    const project = await getAccessibleProject(projectId, userId)

    if (project.gerenteId !== userId) {
        throw new AppError('Apenas o gerente do projeto pode executar esta ação.', 403)
    }

    return project
}
