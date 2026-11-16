import { Router } from 'express'

import * as activityController from '../controllers/activity.controller'
import * as memberController from '../controllers/member.controller'
import * as projectController from '../controllers/project.controller'
import { authenticate } from '../middlewares/auth.middleware'

export const projectRouter = Router()

projectRouter.use(authenticate)

projectRouter.get('/', projectController.list)
projectRouter.post('/', projectController.create)
projectRouter.get('/:id', projectController.get)
projectRouter.put('/:id', projectController.update)

projectRouter.get('/:id/members', memberController.list)
projectRouter.post('/:id/members', memberController.create)
projectRouter.delete('/:id/members/:memberId', memberController.remove)

projectRouter.get('/:id/activities', activityController.listForProject)
projectRouter.post('/:id/activities', activityController.create)
projectRouter.put('/:id/activities/:activityId', activityController.update)
projectRouter.patch('/:id/activities/:activityId/status', activityController.updateStatus)
projectRouter.delete('/:id/activities/:activityId', activityController.remove)
