import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { env } from './config/env'
import { AppDataSource } from './database/data-source'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware'
import { apiRouter } from './routes'

export const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
    origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) {
            callback(null, true)
            return
        }

        callback(new Error('Origem não permitida pelo CORS.'))
    },
}))
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
    })
})

app.use(apiRouter)
app.use(notFoundHandler)
app.use(errorHandler)
