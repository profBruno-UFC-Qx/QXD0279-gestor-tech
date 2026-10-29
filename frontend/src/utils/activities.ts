import type { Activity } from '@/types/Activity'

function toLocalDate(value: string): Date {
    return new Date(`${value}T00:00:00`)
}

export function isActivityOverdue(activity: Activity, today = new Date()): boolean {
    if (activity.status === 'CONCLUIDA') return false
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return toLocalDate(activity.prazo) < normalizedToday
}

export function compareByDeadline(a: Activity, b: Activity): number {
    return toLocalDate(a.prazo).getTime() - toLocalDate(b.prazo).getTime()
}

export function relativeDeadline(value: string, today = new Date()): string {
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const difference = Math.round((toLocalDate(value).getTime() - normalizedToday.getTime()) / 86_400_000)

    if (difference < 0) return difference === -1 ? 'Atrasada há 1 dia' : `Atrasada há ${Math.abs(difference)} dias`
    if (difference === 0) return 'Vence hoje'
    if (difference === 1) return 'Vence amanhã'
    return `Vence em ${difference} dias`
}
