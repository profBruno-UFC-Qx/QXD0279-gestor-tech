export function getErrorMessage(
    error: unknown,
    fallback = 'Não foi possível concluir a solicitação.',
): string {
    return error instanceof Error && error.message ? error.message : fallback
}
