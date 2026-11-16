import type { NextFunction, Request, Response } from 'express'

import * as memberService from '../services/member.service'
import { memberSchema, positiveIdSchema } from './validation'

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        res.json(await memberService.listMembers(projectId, req.auth!.userId))
    } catch (error: unknown) {
        next(error)
    }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        const { email } = memberSchema.parse(req.body)
        const member = await memberService.addMember(projectId, email, req.auth!.userId)
        res.status(201).json(member)
    } catch (error: unknown) {
        next(error)
    }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const projectId = positiveIdSchema.parse(req.params.id)
        const memberId = positiveIdSchema.parse(req.params.memberId)
        await memberService.removeMember(projectId, memberId, req.auth!.userId)
        res.status(204).send()
    } catch (error: unknown) {
        next(error)
    }
}
