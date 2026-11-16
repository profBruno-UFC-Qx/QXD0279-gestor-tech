import { Router } from 'express'

import * as activityController from '../controllers/activity.controller'
import { authenticate } from '../middlewares/auth.middleware'

export const activityRouter = Router()

activityRouter.get('/mine', authenticate, activityController.listMine)
