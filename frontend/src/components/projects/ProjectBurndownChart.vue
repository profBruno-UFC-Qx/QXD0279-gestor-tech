<script setup lang="ts">
import { computed } from 'vue'

import BaseCard from '@/components/ui/BaseCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { Activity } from '@/types/Activity'
import { formatDate } from '@/utils/labels'

const props = defineProps<{ activities: Activity[]; startDate: string; endDate: string }>()

interface ChartPoint { x: number; y: number }

const total = computed(() => props.activities.length)
const pending = computed(() => props.activities.filter((activity) => activity.status !== 'CONCLUIDA').length)
const sortedActivities = computed(() => [...props.activities].sort((a, b) => a.prazo.localeCompare(b.prazo)))

const actualPoints = computed<ChartPoint[]>(() => {
    if (!total.value) return []
    let remaining = total.value
    const points: ChartPoint[] = [{ x: 24, y: 18 }]
    sortedActivities.value.forEach((activity, index) => {
        if (activity.status === 'CONCLUIDA') remaining -= 1
        points.push({
            x: 24 + ((index + 1) / total.value) * 432,
            y: 18 + (1 - (remaining / total.value)) * 112,
        })
    })
    return points
})

const idealPoints = computed<ChartPoint[]>(() => total.value ? [{ x: 24, y: 18 }, { x: 456, y: 130 }] : [])
const asPolyline = (points: ChartPoint[]): string => points.map((point) => `${point.x},${point.y}`).join(' ')
</script>

<template>
    <BaseCard class="burndown-card">
        <SectionHeader title="Ritmo da entrega" description="Curva estimada pelos prazos e pelo estado atual." />
        <template v-if="total">
            <div class="burndown-summary"><div><strong>{{ pending }}</strong><span>tarefas restantes</span></div><span>{{ total - pending }} de {{ total }} concluídas</span></div>
            <div class="chart-wrap" role="img" :aria-label="`${pending} de ${total} tarefas restantes`">
                <svg viewBox="0 0 480 156" preserveAspectRatio="none" aria-hidden="true">
                    <path class="grid-line" d="M24 18H456M24 74H456M24 130H456" />
                    <polyline class="ideal-line" :points="asPolyline(idealPoints)" />
                    <polyline class="actual-line" :points="asPolyline(actualPoints)" />
                    <circle v-for="point in actualPoints" :key="`${point.x}-${point.y}`" class="actual-point" :cx="point.x" :cy="point.y" r="4" />
                </svg>
            </div>
            <div class="chart-footer"><span>{{ formatDate(startDate) }}</span><ul><li><i class="actual" />Atual</li><li><i class="ideal" />Ideal</li></ul><span>{{ formatDate(endDate) }}</span></div>
        </template>
        <EmptyState v-else compact icon="activities" title="Sem dados para o ritmo" description="Cadastre atividades para acompanhar a curva de entrega." />
    </BaseCard>
</template>

<style scoped>
.burndown-card { display: grid; align-content: start; gap: var(--space-4); height: 100%; }
.burndown-summary { display: flex; align-items: end; justify-content: space-between; gap: var(--space-4); }
.burndown-summary > div { display: flex; align-items: baseline; gap: var(--space-2); }
.burndown-summary strong { color: var(--color-primary); font-size: 1.75rem; line-height: 1; }
.burndown-summary span { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.chart-wrap { min-height: 190px; }
.chart-wrap svg { display: block; width: 100%; height: 190px; overflow: visible; }
.grid-line { fill: none; stroke: var(--color-divider); stroke-width: 1; }
.actual-line, .ideal-line { fill: none; vector-effect: non-scaling-stroke; }
.actual-line { stroke: var(--color-chart-blue); stroke-linecap: round; stroke-linejoin: round; stroke-width: 3; }
.ideal-line { stroke: var(--color-chart-purple); stroke-dasharray: 7 6; stroke-width: 2; }
.actual-point { fill: var(--color-surface); stroke: var(--color-chart-blue); stroke-width: 2.5; vector-effect: non-scaling-stroke; }
.chart-footer { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--space-3); color: var(--color-text-muted); font-size: var(--font-size-caption); }
.chart-footer ul { display: flex; justify-content: center; gap: var(--space-3); }
.chart-footer li { display: flex; align-items: center; gap: 5px; }
.chart-footer i { width: 14px; height: 3px; border-radius: var(--radius-pill); }
.chart-footer i.actual { background: var(--color-chart-blue); }
.chart-footer i.ideal { background: var(--color-chart-purple); }
</style>
