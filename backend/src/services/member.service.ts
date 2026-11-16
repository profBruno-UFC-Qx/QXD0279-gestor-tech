import { QueryFailedError } from 'typeorm'

import { AppDataSource } from '../database/data-source'
import { Activity } from '../entities/Activity'
import { ProjectMember } from '../entities/ProjectMember'
import { User, type UserRole } from '../entities/User'
import { AppError } from '../errors/AppError'
import { getAccessibleProject, requireProjectManager } from './project-access.service'

export interface ProjectMemberResponse {
    id: number
    usuarioId: number
    projetoId: number
    usuario: {
        id: number
        nome: string
        email: string
        role: UserRole
    }
}

function toMemberResponse(member: ProjectMember): ProjectMemberResponse {
    return {
        id: member.id,
        usuarioId: member.usuarioId,
        projetoId: member.projetoId,
        usuario: {
            id: member.usuario.id,
            nome: member.usuario.nome,
            email: member.usuario.email,
            role: member.usuario.role,
        },
    }
}

export async function listMembers(projectId: number, userId: number): Promise<ProjectMemberResponse[]> {
    await getAccessibleProject(projectId, userId)
    const members = await AppDataSource.getRepository(ProjectMember).find({
        where: { projetoId: projectId },
        relations: { usuario: true },
        order: { createdAt: 'ASC', id: 'ASC' },
    })
    return members.map(toMemberResponse)
}

export async function addMember(
    projectId: number,
    emailInput: string,
    userId: number,
): Promise<ProjectMemberResponse> {
    const project = await requireProjectManager(projectId, userId)
    const email = emailInput.trim().toLowerCase()
    const user = await AppDataSource.getRepository(User).findOne({ where: { email } })

    if (!user) throw new AppError('Não existe uma conta cadastrada com este e-mail.', 404)
    if (user.id === project.gerenteId) {
        throw new AppError('O gerente já participa do projeto e não pode ser adicionado como membro.', 409)
    }

    const repository = AppDataSource.getRepository(ProjectMember)
    const existingMember = await repository.findOneBy({ projetoId: projectId, usuarioId: user.id })
    if (existingMember) throw new AppError('Esta conta já faz parte da equipe do projeto.', 409)

    const member = repository.create({ projetoId: projectId, usuarioId: user.id, usuario: user })
    try {
        await repository.save(member)
    } catch (error: unknown) {
        if (error instanceof QueryFailedError) {
            throw new AppError('Esta conta já faz parte da equipe do projeto.', 409)
        }
        throw error
    }

    return toMemberResponse(member)
}

export async function removeMember(projectId: number, memberId: number, userId: number): Promise<void> {
    const project = await requireProjectManager(projectId, userId)
    const repository = AppDataSource.getRepository(ProjectMember)
    const member = await repository.findOne({
        where: { id: memberId, projetoId: projectId },
        relations: { usuario: true },
    })

    if (!member) {
        if (project.gerenteId === memberId) {
            throw new AppError('O gerente do projeto não pode ser removido da equipe.', 409)
        }
        throw new AppError('Membro não encontrado neste projeto.', 404)
    }

    const assignedActivities = await AppDataSource.getRepository(Activity).countBy({
        projetoId: projectId,
        responsavelId: member.usuarioId,
    })
    if (assignedActivities > 0) {
        throw new AppError(
            `Não é possível remover ${member.usuario.nome}: reatribua ou deixe sem responsável as atividades atribuídas a esta pessoa primeiro.`,
            409,
        )
    }

    await repository.remove(member)
}
