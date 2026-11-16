import { Router } from 'express'

import { activityRouter } from './activity.routes'
import { authRouter } from './auth.routes'
import { projectRouter } from './project.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/projects', projectRouter)
apiRouter.use('/activities', activityRouter)
