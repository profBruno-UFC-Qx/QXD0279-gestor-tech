import type { NextFunction, Request, Response } from 'express'

import * as projectService from '../services/project.service'
import { positiveIdSchema, projectSchema } from './validation'

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.json(await projectService.listProjects(req.auth!.userId))
    } catch (error: unknown) {
        next(error)
    }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const project = await projectService.createProject(
            projectSchema.parse(req.body),
            req.auth!.userId,
        )
        res.status(201).json(project)
    } catch (error: unknown) {
        next(error)
    }
}

export async function get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        res.json(await projectService.getProject(projectId, req.auth!.userId))
    } catch (error: unknown) {
        next(error)
    }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        const project = await projectService.updateProject(
            projectId,
            projectSchema.parse(req.body),
            req.auth!.userId,
        )
        res.json(project)
    } catch (error: unknown) {
        next(error)
    }
}
