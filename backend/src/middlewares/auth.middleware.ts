import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { env } from '../config/env'
import { UserRole } from '../entities/User'
import { AppError } from '../errors/AppError'

interface JwtPayload {
    sub?: string
    role?: UserRole
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const authorization = req.header('authorization')
    const [scheme, token] = authorization?.split(' ') ?? []

    if (scheme !== 'Bearer' || !token) {
        next(new AppError('Token de autenticação não informado.', 401))
        return
    }

    try {
        const payload = jwt.verify(token, env.jwtSecret) as JwtPayload
        const userId = Number(payload.sub)

        if (!Number.isInteger(userId) || !Object.values(UserRole).includes(payload.role as UserRole)) {
            throw new Error('Invalid token payload')
        }

        req.auth = { userId, role: payload.role as UserRole }
        next()
    } catch {
        next(new AppError('Token inválido ou expirado.', 401))
    }
}

export function authorizeRoles(...roles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.auth || !roles.includes(req.auth.role)) {
            next(new AppError('Você não possui permissão para executar esta ação.', 403))
            return
        }

        next()
    }
}
