import type { ErrorRequestHandler, RequestHandler } from 'express'
import { ZodError } from 'zod'

import { env } from '../config/env'
import { AppError } from '../errors/AppError'

export const notFoundHandler: RequestHandler = (req, _res, next) => {
    next(new AppError(`Rota ${req.method} ${req.path} não encontrada.`, 404))
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    if (error instanceof ZodError) {
        res.status(422).json({
            message: 'Os dados enviados são inválidos.',
            errors: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        })
        return
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            message: error.message,
            ...(error.details === undefined ? {} : { details: error.details }),
        })
        return
    }

    if (env.nodeEnv !== 'test') console.error(error)
    res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' })
}
