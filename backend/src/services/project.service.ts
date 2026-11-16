import { AppDataSource } from '../database/data-source'
import { Project, ProjectStatus } from '../entities/Project'
import { getAccessibleProject, requireProjectManager } from './project-access.service'

export interface ProjectInput {
    nome: string
    descricao: string
    dataInicio: string
    dataFim: string
    status: ProjectStatus
}

export interface ProjectResponse {
    id: number
    nome: string
    descricao: string
    dataInicio: string
    dataFim: string
    status: ProjectStatus
    gerenteId: number
    gerente: {
        id: number
        nome: string
    }
    papelAtual: 'GERENTE' | 'MEMBRO'
}

function toProjectResponse(project: Project, userId: number): ProjectResponse {
    return {
        id: project.id,
        nome: project.nome,
        descricao: project.descricao,
        dataInicio: project.dataInicio,
        dataFim: project.dataFim,
        status: project.status,
        gerenteId: project.gerenteId,
        gerente: {
            id: project.gerente.id,
            nome: project.gerente.nome,
        },
        papelAtual: project.gerenteId === userId ? 'GERENTE' : 'MEMBRO',
    }
}

function normalizedInput(input: ProjectInput): ProjectInput {
    return {
        ...input,
        nome: input.nome.trim(),
        descricao: input.descricao.trim(),
    }
}

export async function listProjects(userId: number): Promise<ProjectResponse[]> {
    const projects = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .innerJoinAndSelect('project.gerente', 'gerente')
        .leftJoin('project_members', 'member', 'member.projetoId = project.id')
        .where('project.gerenteId = :userId OR member.usuarioId = :userId', { userId })
        .distinct(true)
        .orderBy('project.createdAt', 'DESC')
        .addOrderBy('project.id', 'DESC')
        .getMany()

    return projects.map((project) => toProjectResponse(project, userId))
}

export async function createProject(input: ProjectInput, userId: number): Promise<ProjectResponse> {
    const repository = AppDataSource.getRepository(Project)
    const project = repository.create({
        ...normalizedInput(input),
        gerenteId: userId,
    })

    await repository.save(project)
    const savedProject = await repository.findOneOrFail({
        where: { id: project.id },
        relations: { gerente: true },
    })

    return toProjectResponse(savedProject, userId)
}

export async function getProject(projectId: number, userId: number): Promise<ProjectResponse> {
    const project = await getAccessibleProject(projectId, userId)
    return toProjectResponse(project, userId)
}

export async function updateProject(
    projectId: number,
    input: ProjectInput,
    userId: number,
): Promise<ProjectResponse> {
    const project = await requireProjectManager(projectId, userId)
    Object.assign(project, normalizedInput(input))
    await AppDataSource.getRepository(Project).save(project)
    return toProjectResponse(project, userId)
}
