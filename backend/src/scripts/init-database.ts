import 'reflect-metadata'

import { env } from '../config/env'
import { AppDataSource, initializeDatabase } from '../database/data-source'
import { seedAdminFromEnvironment } from '../services/auth.service'

async function run(): Promise<void> {
    await initializeDatabase()
    const adminCreated = await seedAdminFromEnvironment()

    console.log(`Banco SQLite inicializado em ${env.databasePath}.`)
    console.log(adminCreated
        ? `Administrador criado: ${env.admin.email}`
        : 'Nenhum novo administrador precisou ser criado.')

    await AppDataSource.destroy()
}

run().catch((error: unknown) => {
    console.error('Falha ao inicializar o banco.', error)
    process.exitCode = 1
})
