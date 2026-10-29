<script setup lang="ts">
import { computed } from 'vue'
import { VisDonut, VisSingleContainer } from '@unovis/vue'

import EmptyState from '@/components/ui/EmptyState.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

export interface DistributionItem {
    label: string
    value: number
    color: string
}

const props = defineProps<{
    title: string
    description: string
    items: DistributionItem[]
}>()

const total = computed(() => props.items.reduce((sum, item) => sum + item.value, 0))
const value = (item: DistributionItem): number => item.value
const color = (item: DistributionItem): string => item.color
const percentage = (item: DistributionItem): number => total.value ? Math.round((item.value / total.value) * 100) : 0
</script>

<template>
    <article class="chart-panel">
        <SectionHeader :title="title" :description="description" />
        <template v-if="total">
            <div class="chart-body">
                <div class="chart-wrap" :aria-label="`${title}: ${total} atividades`">
                    <VisSingleContainer :data="items" :height="164">
                        <VisDonut
                            :value="value"
                            :color="color"
                            :arc-width="14"
                            :pad-angle="0.025"
                            :corner-radius="5"
                            :central-label="String(total)"
                            central-sub-label="atividades"
                        />
                    </VisSingleContainer>
                </div>
                <ul class="legend" aria-label="Legenda do gráfico">
                    <li v-for="item in items" :key="item.label">
                        <span class="legend-dot" :style="{ background: item.color }" />
                        <span>{{ item.label }}</span>
                        <strong>{{ item.value }} <small>{{ percentage(item) }}%</small></strong>
                    </li>
                </ul>
            </div>
        </template>
        <EmptyState v-else compact icon="activities" title="Sem dados para o gráfico" description="Cadastre atividades para visualizar esta distribuição." />
    </article>
</template>

<style scoped>
.chart-panel { display: grid; min-width: 0; align-content: start; gap: var(--space-4); }
.chart-body { display: grid; grid-template-columns: minmax(130px, 164px) minmax(130px, 1fr); align-items: center; gap: var(--space-4); }
.chart-wrap { min-height: 164px; }
.chart-wrap :deep(.vis-donut-central-label) { fill: var(--color-foreground); font-family: var(--font-body); font-size: 1.35rem; font-weight: 700; }
.chart-wrap :deep(.vis-donut-central-sub-label) { fill: var(--color-text-muted); font-family: var(--font-body); font-size: .68rem; }
.legend { display: grid; gap: var(--space-2); }
.legend li { display: grid; grid-template-columns: 8px minmax(0, 1fr) auto; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-small); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; }
.legend strong { color: var(--color-foreground); font-size: var(--font-size-small); }
.legend small { margin-left: 2px; color: var(--color-text-muted); font-size: var(--font-size-caption); font-weight: var(--font-weight-medium); }
@media (max-width: 420px) { .chart-body { grid-template-columns: 1fr; } .chart-wrap { width: min(180px, 100%); margin-inline: auto; } }
</style>
