import 'reflect-metadata'

import { env } from '../config/env'
import { AppDataSource, initializeDatabase } from '../database/data-source'
import { User } from '../entities/User'

interface TableRow {
    name: string
}

async function run(): Promise<void> {
    await initializeDatabase()

    const tables = await AppDataSource.query(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
    ) as TableRow[]
    const users = await AppDataSource.getRepository(User).find({
        select: { id: true, nome: true, email: true, role: true, createdAt: true },
        order: { id: 'ASC' },
    })

    console.log(`Arquivo: ${env.databasePath}`)
    console.log(`Tabelas: ${tables.map((table) => table.name).join(', ') || 'nenhuma'}`)
    console.table(users)

    await AppDataSource.destroy()
}

run().catch((error: unknown) => {
    console.error('Falha ao consultar o banco.', error)
    process.exitCode = 1
})
