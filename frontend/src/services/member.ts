import type { ProjectMember } from '@/types/ProjectMember'
import { nextLocalId, readLocalDatabase, writeLocalDatabase } from './local-database'

function nameFromEmail(email: string): string {
    const name = email.split('@')[0]
        ?.replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
        .trim()

    return name || 'Novo membro'
}

export async function listProjectMembers(projectId: number): Promise<ProjectMember[]> {
    const database = readLocalDatabase()

    return database.members
        .filter((member) => member.projetoId === projectId)
        .map((member) => ({
            ...member,
            usuario: database.users.find((user) => user.id === member.usuarioId)
                ?? member.usuario,
        }))
}

export async function addProjectMember(projectId: number, email: string): Promise<ProjectMember> {
    const database = readLocalDatabase()
    const project = database.projects.find((item) => item.id === projectId)
    if (!project) throw new Error('Projeto não encontrado.')

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = database.users.find(
        (user) => user.email.toLowerCase() === normalizedEmail,
    )

    if (existingUser?.id === project.gerenteId) {
        throw new Error('Este usuário já é gerente do projeto.')
    }

    if (existingUser && database.members.some((member) => (
        member.projetoId === projectId && member.usuarioId === existingUser.id
    ))) {
        throw new Error('Este usuário já participa do projeto.')
    }

    const user = existingUser ?? {
        id: nextLocalId(database.users),
        nome: nameFromEmail(normalizedEmail),
        email: normalizedEmail,
    }

    if (!existingUser) database.users.push(user)

    const member: ProjectMember = {
        id: nextLocalId(database.members),
        usuarioId: user.id,
        projetoId: projectId,
        usuario: user,
    }

    database.members.push(member)
    writeLocalDatabase(database)
    return member
}

export async function removeProjectMember(projectId: number, memberId: number): Promise<void> {
    const database = readLocalDatabase()
    const member = database.members.find(
        (item) => item.id === memberId && item.projetoId === projectId,
    )
    if (!member) throw new Error('Membro não encontrado.')

    database.members = database.members.filter((item) => item.id !== memberId)
    database.activities = database.activities.map((activity) => (
        activity.projetoId === projectId && activity.responsavelId === member.usuarioId
            ? { ...activity, responsavelId: null, responsavel: null }
            : activity
    ))
    writeLocalDatabase(database)
}
