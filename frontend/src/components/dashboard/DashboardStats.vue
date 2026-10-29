<script setup lang="ts">
import { computed } from 'vue'

import StatCard from '@/components/ui/StatCard.vue'
import type { ProjectMetrics } from '@/types/Activity'

const props = defineProps<{ metrics: ProjectMetrics }>()

const cards = computed(() => [
    { label: 'Total de atividades', value: props.metrics.total, detail: 'No projeto selecionado', icon: 'activities' as const, tone: 'neutral' as const },
    { label: 'Concluídas', value: props.metrics.concluidas, detail: 'Entregas finalizadas', icon: 'check-circle' as const, tone: 'success' as const },
    { label: 'Pendentes', value: props.metrics.pendentes, detail: 'A fazer ou em andamento', icon: 'clock' as const, tone: 'primary' as const },
    { label: 'Atrasadas', value: props.metrics.atrasadas, detail: 'Prazo vencido e não concluídas', icon: 'warning' as const, tone: props.metrics.atrasadas ? 'danger' as const : 'neutral' as const },
    { label: 'Conclusão', value: `${props.metrics.percentualConclusao}%`, detail: 'Progresso calculado', icon: 'target' as const, tone: 'primary' as const },
])
</script>

<template>
    <section class="stats-grid" aria-label="Indicadores do projeto">
        <StatCard v-for="card in cards" :key="card.label" v-bind="card" />
    </section>
</template>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--space-3); }
@media (max-width: 1180px) { .stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 760px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 420px) { .stats-grid { grid-template-columns: 1fr; } }
</style>
