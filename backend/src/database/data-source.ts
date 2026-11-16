import 'reflect-metadata'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DataSource } from 'typeorm'

import { env } from '../config/env'
import { Activity } from '../entities/Activity'
import { Project } from '../entities/Project'
import { ProjectMember } from '../entities/ProjectMember'
import { User } from '../entities/User'

const databasePath = resolve(process.cwd(), env.databasePath)
mkdirSync(dirname(databasePath), { recursive: true })

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: databasePath,
    entities: [User, Project, ProjectMember, Activity],
    synchronize: env.databaseSynchronize,
    logging: env.nodeEnv === 'development' ? ['error', 'warn'] : false,
})

export async function initializeDatabase(): Promise<DataSource> {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize()
    return AppDataSource
}
