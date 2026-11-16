import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

import * as authService from '../services/auth.service'

const emailSchema = z.string().trim().email('Informe um e-mail válido.').max(180)

const registerSchema = z.object({
    nome: z.string().trim().min(2, 'Informe seu nome.').max(120),
    email: emailSchema,
    senha: z.string().min(6, 'Use pelo menos 6 caracteres.').max(72),
}).strict()

const loginSchema = z.object({
    email: emailSchema,
    senha: z.string().min(1, 'Informe sua senha.').max(72),
}).strict()

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const response = await authService.register(registerSchema.parse(req.body))
        res.status(201).json(response)
    } catch (error: unknown) {
        next(error)
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const response = await authService.login(loginSchema.parse(req.body))
        res.json(response)
    } catch (error: unknown) {
        next(error)
    }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await authService.getCurrentUser(req.auth!.userId)
        res.json(user)
    } catch (error: unknown) {
        next(error)
    }
}

export function logout(_req: Request, res: Response): void {
    res.status(204).send()
}
