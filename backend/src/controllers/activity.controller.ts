import type { NextFunction, Request, Response } from 'express'

import * as activityService from '../services/activity.service'
import { activitySchema, activityStatusSchema, positiveIdSchema } from './validation'

export async function listForProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        res.json(await activityService.listProjectActivities(projectId, req.auth!.userId))
    } catch (error: unknown) {
        next(error)
    }
}

export async function listMine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.json(await activityService.listMyActivities(req.auth!.userId))
    } catch (error: unknown) {
        next(error)
    }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        const activity = await activityService.createActivity(
            projectId,
            activitySchema.parse(req.body),
            req.auth!.userId,
        )
        res.status(201).json(activity)
    } catch (error: unknown) {
        next(error)
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        const activityId = positiveIdSchema.parse(req.params.activityId)
        const activity = await activityService.updateActivity(
            projectId,
            activityId,
            activitySchema.parse(req.body),
            req.auth!.userId,
        )
        res.json(activity)
    } catch (error: unknown) {
        next(error)
    }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        const activityId = positiveIdSchema.parse(req.params.activityId)
        const { status } = activityStatusSchema.parse(req.body)
        const activity = await activityService.updateActivityStatus(
            projectId,
            activityId,
            status,
            req.auth!.userId,
        )
        res.json(activity)
    } catch (error: unknown) {
        next(error)
    }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        const activityId = positiveIdSchema.parse(req.params.activityId)
        await activityService.deleteActivity(projectId, activityId, req.auth!.userId)
        res.status(204).send()
    } catch (error: unknown) {
        next(error)
    }
}
