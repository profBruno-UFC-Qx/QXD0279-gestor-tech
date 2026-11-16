export class AppError extends Error {
    constructor(
        message: string,
        readonly statusCode = 400,
        readonly details?: unknown,
    ) {
        super(message)
        this.name = 'AppError'
    }
}
