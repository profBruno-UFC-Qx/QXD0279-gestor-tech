<script setup lang="ts">
import { computed } from 'vue'

import StatCard from '@/components/ui/StatCard.vue'
import type { Activity, ProjectMetrics } from '@/types/Activity'

const props = defineProps<{ metrics: ProjectMetrics; activities: Activity[] }>()

const inProgress = computed(() => props.activities.filter((activity) => activity.status === 'EM_ANDAMENTO').length)
const unassigned = computed(() => props.activities.filter((activity) => activity.status !== 'CONCLUIDA' && !activity.responsavelId).length)
const dueSoon = computed(() => {
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const end = start + (7 * 86_400_000)
    return props.activities.filter((activity) => {
        if (activity.status === 'CONCLUIDA') return false
        const deadline = new Date(`${activity.prazo}T00:00:00`).getTime()
        return deadline >= start && deadline <= end
    }).length
})

function percentageOfTotal(value: number): number {
    return props.metrics.total ? Math.round((value / props.metrics.total) * 100) : 0
}

const cards = computed(() => [
    { label: 'Total de atividades', value: props.metrics.total, detail: 'No projeto selecionado', progress: props.metrics.total ? 100 : 0, icon: 'activities' as const, tone: 'neutral' as const },
    { label: 'Concluídas', value: props.metrics.concluidas, detail: 'Entregas finalizadas', progress: percentageOfTotal(props.metrics.concluidas), icon: 'check-circle' as const, tone: 'success' as const },
    { label: 'Em andamento', value: inProgress.value, detail: 'Trabalho em execução', progress: percentageOfTotal(inProgress.value), icon: 'clock' as const, tone: 'primary' as const },
    { label: 'Pendentes', value: props.metrics.pendentes, detail: 'A fazer ou em andamento', progress: percentageOfTotal(props.metrics.pendentes), icon: 'clock' as const, tone: 'primary' as const },
    { label: 'Atrasadas', value: props.metrics.atrasadas, detail: 'Prazo vencido e não concluídas', progress: percentageOfTotal(props.metrics.atrasadas), icon: 'warning' as const, tone: props.metrics.atrasadas ? 'danger' as const : 'neutral' as const },
    { label: 'Próximos 7 dias', value: dueSoon.value, detail: 'Atividades com prazo próximo', progress: percentageOfTotal(dueSoon.value), icon: 'calendar' as const, tone: dueSoon.value ? 'warning' as const : 'neutral' as const },
    { label: 'Sem responsável', value: unassigned.value, detail: 'Pendências sem atribuição', progress: percentageOfTotal(unassigned.value), icon: 'user' as const, tone: unassigned.value ? 'warning' as const : 'neutral' as const },
    { label: 'Conclusão', value: `${props.metrics.percentualConclusao}%`, detail: 'Progresso calculado', progress: props.metrics.percentualConclusao, icon: 'target' as const, tone: 'primary' as const },
])
</script>

<template>
    <section class="stats-grid" aria-label="Indicadores do projeto">
        <StatCard v-for="card in cards" :key="card.label" v-bind="card" />
    </section>
</template>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-4); }
@media (max-width: 1180px) { .stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 760px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 420px) { .stats-grid { grid-template-columns: 1fr; } }
</style>
