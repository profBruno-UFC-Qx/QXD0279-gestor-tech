<script setup lang="ts">
import { computed } from 'vue'
import { VisAxis, VisStackedBar, VisXYContainer } from '@unovis/vue'

import EmptyState from '@/components/ui/EmptyState.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { Activity } from '@/types/Activity'

interface WorkloadItem {
    index: number
    label: string
    pending: number
    completed: number
}

const props = defineProps<{ activities: Activity[] }>()

const data = computed<WorkloadItem[]>(() => {
    const grouped = new Map<string, { pending: number; completed: number }>()

    props.activities.forEach((activity) => {
        const label = activity.responsavel?.nome ?? 'Sem responsável'
        const current = grouped.get(label) ?? { pending: 0, completed: 0 }
        if (activity.status === 'CONCLUIDA') current.completed += 1
        else current.pending += 1
        grouped.set(label, current)
    })

    return [...grouped.entries()]
        .sort(([, a], [, b]) => (b.pending + b.completed) - (a.pending + a.completed))
        .slice(0, 6)
        .map(([label, values], index) => ({ index, label, ...values }))
})

const x = (item: WorkloadItem): number => item.index
const pending = (item: WorkloadItem): number => item.pending
const completed = (item: WorkloadItem): number => item.completed
const color = (_item: WorkloadItem, stackIndex: number): string => stackIndex === 1 ? 'var(--color-chart-aqua)' : 'var(--color-chart-blue)'
const tickFormat = (tick: number | Date): string => data.value[Number(tick)]?.label.split(' ')[0] ?? ''
const integerTick = (tick: number | Date): string => String(Math.round(Number(tick)))
</script>

<template>
    <article class="chart-panel">
        <SectionHeader title="Atividades por responsável" description="Volume de trabalho aberto e concluído por pessoa." />
        <template v-if="data.length">
            <div class="chart-wrap" :aria-label="`Carga de trabalho de ${data.length} responsáveis`">
                <VisXYContainer :data="data" :height="270" :padding="{ top: 10, right: 10, bottom: 10, left: 0 }">
                    <VisStackedBar :x="x" :y="[pending, completed]" :color="color" :bar-padding="0.25" :rounded-corners="4" />
                    <VisAxis type="x" :tick-values="data.map((item) => item.index)" :tick-format="tickFormat" :grid-line="false" :tick-line="false" />
                    <VisAxis type="y" :tick-format="integerTick" :num-ticks="4" :domain-line="false" />
                </VisXYContainer>
            </div>
            <ul class="legend" aria-label="Legenda do gráfico">
                <li><span class="legend-dot pending" />Abertas</li>
                <li><span class="legend-dot completed" />Concluídas</li>
            </ul>
        </template>
        <EmptyState v-else compact icon="team" title="Sem dados de equipe" description="As atribuições aparecerão aqui quando houver atividades." />
    </article>
</template>

<style scoped>
.chart-panel { display: grid; min-width: 0; align-content: start; gap: var(--space-4); }
.chart-wrap { min-height: 270px; }
.chart-wrap :deep(.vis-axis text) { fill: var(--color-text-muted); font-family: var(--font-body); font-size: .7rem; }
.chart-wrap :deep(.vis-axis .gridline) { stroke: var(--color-divider); }
.legend { display: flex; flex-wrap: wrap; gap: var(--space-4); color: var(--color-text-secondary); font-size: var(--font-size-small); }
.legend li { display: flex; align-items: center; gap: var(--space-2); }
.legend-dot { width: 9px; height: 9px; border-radius: 3px; }
.legend-dot.pending { background: var(--color-chart-blue); }
.legend-dot.completed { background: var(--color-chart-aqua); }
</style>
