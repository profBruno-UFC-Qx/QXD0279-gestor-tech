import 'reflect-metadata'

import { app } from './app'
import { env } from './config/env'
import { initializeDatabase } from './database/data-source'
import { seedAdminFromEnvironment } from './services/auth.service'

async function bootstrap(): Promise<void> {
    await initializeDatabase()
    const adminCreated = await seedAdminFromEnvironment()

    app.listen(env.port, () => {
        console.log(`API do Gestor Tech em http://localhost:${env.port}`)
        console.log(`SQLite conectado em ${env.databasePath}`)
        if (adminCreated) console.log(`Administrador criado: ${env.admin.email}`)
    })
}

bootstrap().catch((error: unknown) => {
    console.error('Não foi possível iniciar a API.', error)
    process.exitCode = 1
})
