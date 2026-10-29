import type { Project, ProjectPayload } from '@/types/Project'
import { getAuthUser } from './auth.storage'
import { appendProjectEvent } from './project-event'
import {
    nextLocalId,
    readLocalDatabase,
    type LocalDatabase,
    writeLocalDatabase,
} from './local-database'

function hydrateProject(project: Project, database: LocalDatabase): Project {
    const currentUser = getAuthUser()
    const manager = database.users.find((user) => user.id === project.gerenteId)
    const isMember = currentUser
        ? database.members.some((member) => (
            member.projetoId === project.id && member.usuarioId === currentUser.id
        ))
        : false

    return {
        ...project,
        gerente: {
            id: project.gerenteId,
            nome: manager?.nome ?? 'Gerente do projeto',
        },
        papelAtual: currentUser?.id === project.gerenteId
            ? 'GERENTE'
            : isMember ? 'MEMBRO' : project.papelAtual,
    }
}

export async function listProjects(): Promise<Project[]> {
    const database = readLocalDatabase()
    return database.projects.map((project) => hydrateProject(project, database))
}

export async function getProject(projectId: number): Promise<Project> {
    const database = readLocalDatabase()
    const project = database.projects.find((item) => item.id === projectId)
    if (!project) throw new Error('Projeto não encontrado.')

    return hydrateProject(project, database)
}

export async function createProject(data: ProjectPayload): Promise<Project> {
    const database = readLocalDatabase()
    const currentUser = getAuthUser()
    if (!currentUser) throw new Error('Entre novamente para criar um projeto.')

    const project: Project = {
        ...data,
        id: nextLocalId(database.projects),
        gerenteId: currentUser.id,
    }

    database.projects.push(project)
    appendProjectEvent(database, project.id, 'project-created', `criou o projeto “${project.nome}”.`)
    writeLocalDatabase(database)
    return hydrateProject(project, database)
}

export async function updateProject(projectId: number, data: ProjectPayload): Promise<Project> {
    const database = readLocalDatabase()
    const projectIndex = database.projects.findIndex((item) => item.id === projectId)
    if (projectIndex < 0) throw new Error('Projeto não encontrado.')

    const project: Project = {
        ...database.projects[projectIndex]!,
        ...data,
        id: projectId,
    }

    database.projects[projectIndex] = project
    appendProjectEvent(database, projectId, 'project-updated', `atualizou as informações do projeto “${project.nome}”.`)
    writeLocalDatabase(database)
    return hydrateProject(project, database)
}
