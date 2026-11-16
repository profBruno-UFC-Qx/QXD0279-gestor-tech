import 'dotenv/config'

function readPositiveInteger(value: string | undefined, fallback: number): number {
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
    if (value === undefined) return fallback
    return value.toLowerCase() === 'true'
}

const nodeEnv = process.env.NODE_ENV ?? 'development'
const jwtSecret = process.env.JWT_SECRET
    ?? 'gestor-tech-development-secret-change-before-production'

if (nodeEnv === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET precisa ser definido em produção.')
}

export const env = {
    nodeEnv,
    port: readPositiveInteger(process.env.PORT, 8080),
    databasePath: process.env.DATABASE_PATH ?? './data/gestor-tech.sqlite',
    databaseSynchronize: readBoolean(process.env.DATABASE_SYNCHRONIZE, nodeEnv !== 'production'),
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    admin: {
        name: process.env.ADMIN_NAME?.trim(),
        email: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
        password: process.env.ADMIN_PASSWORD,
    },
} as const
