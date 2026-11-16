import type { UserRole } from '../entities/User'

declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: number
                role: UserRole
            }
        }
    }
}

export {}
