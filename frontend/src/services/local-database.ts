import type { Activity } from '@/types/Activity'
import type { User } from '@/types/Auth'
import type { Project } from '@/types/Project'
import type { ProjectMember } from '@/types/ProjectMember'

const DATABASE_KEY = 'gestor-tech:local-database:v1'

export interface LocalDatabase {
    users: User[]
    projects: Project[]
    members: ProjectMember[]
    activities: Activity[]
}

function createInitialDatabase(): LocalDatabase {
    const users: User[] = [
        { id: 1, nome: 'Usuário de demonstração', email: 'demo@gestortech.local' },
        { id: 2, nome: 'Ana Lima', email: 'ana.lima@gestortech.local' },
        { id: 3, nome: 'Bruno Costa', email: 'bruno.costa@gestortech.local' },
    ]

    const projects: Project[] = [
        {
            id: 1,
            nome: 'Desenvolvimento de Software',
            descricao: 'Planeamento e acompanhamento das entregas da nova plataforma digital.',
            dataInicio: '2026-10-01',
            dataFim: '2026-12-19',
            status: 'EM_ANDAMENTO',
            gerenteId: 1,
        },
    ]

    const members: ProjectMember[] = [
        { id: 1, usuarioId: 2, projetoId: 1, usuario: users[1]! },
        { id: 2, usuarioId: 3, projetoId: 1, usuario: users[2]! },
    ]

    const activities: Activity[] = [
        {
            id: 1,
            titulo: 'Mapear a jornada do usuário',
            descricao: 'Consolidar os principais fluxos e pontos de contato do portal.',
            prioridade: 'ALTA',
            status: 'CONCLUIDA',
            prazo: '2026-10-10',
            responsavelId: 2,
            projetoId: 1,
        },
        {
            id: 2,
            titulo: 'Construir o dashboard inicial',
            descricao: 'Implementar os cards e estados da visão geral.',
            prioridade: 'ALTA',
            status: 'EM_ANDAMENTO',
            prazo: '2026-10-24',
            responsavelId: 1,
            projetoId: 1,
        },
        {
            id: 3,
            titulo: 'Revisar componentes responsivos',
            descricao: 'Validar o comportamento das telas em dispositivos menores.',
            prioridade: 'MEDIA',
            status: 'A_FAZER',
            prazo: '2026-11-07',
            responsavelId: 3,
            projetoId: 1,
        },
    ]

    return { users, projects, members, activities }
}

function getStorage(): Storage | null {
    return typeof window === 'undefined' ? null : window.localStorage
}

function isLocalDatabase(value: unknown): value is LocalDatabase {
    if (!value || typeof value !== 'object') return false

    const database = value as Partial<LocalDatabase>
    return Array.isArray(database.users)
        && Array.isArray(database.projects)
        && Array.isArray(database.members)
        && Array.isArray(database.activities)
}

export function readLocalDatabase(): LocalDatabase {
    const storage = getStorage()
    const storedDatabase = storage?.getItem(DATABASE_KEY)

    if (storedDatabase) {
        try {
            const database: unknown = JSON.parse(storedDatabase)
            if (isLocalDatabase(database)) {
                const defaultProject = database.projects.find((project) => (
                    project.id === 1 && project.nome === 'Portal do Cliente'
                ))

                if (defaultProject) {
                    defaultProject.nome = 'Desenvolvimento de Software'
                    defaultProject.descricao = 'Planeamento e acompanhamento das entregas da nova plataforma digital.'
                    writeLocalDatabase(database)
                }

                return database
            }
        } catch {
            storage?.removeItem(DATABASE_KEY)
        }
    }

    const database = createInitialDatabase()
    writeLocalDatabase(database)
    return database
}

export function writeLocalDatabase(database: LocalDatabase): void {
    getStorage()?.setItem(DATABASE_KEY, JSON.stringify(database))
}

export function nextLocalId(items: Array<{ id: number }>): number {
    return Math.max(0, ...items.map((item) => item.id)) + 1
}

export function saveLocalUser(user: User): void {
    const database = readLocalDatabase()
    database.users = [
        ...database.users.filter((item) => item.id !== user.id),
        user,
    ]
    writeLocalDatabase(database)
}
