<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { ProjectEvent } from '@/types/ProjectEvent'

defineProps<{ events: ProjectEvent[] }>()

function formatEventTime(value: string): string {
    const date = new Date(value)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()
    const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date)

    if (isToday) return `Hoje, ${time}`
    if (isYesterday) return `Ontem, ${time}`
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
}
</script>

<template>
    <BaseCard class="feed-card">
        <SectionHeader title="Feed de atividades" description="Movimentações recentes registradas automaticamente.">
            <template #actions><span class="live-label"><span />Atualizado</span></template>
        </SectionHeader>
        <ol v-if="events.length" class="timeline">
            <li v-for="event in events.slice(0, 6)" :key="event.id">
                <div class="timeline-avatar"><UserAvatar :name="event.actorName" size="sm" /><span class="timeline-line" /></div>
                <div class="event-copy">
                    <p><strong>{{ event.actorName }}</strong> {{ event.message }}</p>
                    <time :datetime="event.createdAt"><AppIcon name="clock" :size="13" />{{ formatEventTime(event.createdAt) }}</time>
                </div>
            </li>
        </ol>
        <EmptyState v-else compact icon="activities" title="Sem movimentações" description="As próximas alterações do projeto aparecerão nesta linha do tempo." />
    </BaseCard>
</template>

<style scoped>
.feed-card { display: grid; align-content: start; gap: var(--space-5); height: 100%; }
.live-label { display: inline-flex; align-items: center; gap: 6px; color: var(--color-success-strong); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); }
.live-label span { width: 7px; height: 7px; border-radius: 50%; background: var(--color-success); box-shadow: 0 0 0 4px var(--color-success-soft); }
.timeline { display: grid; }
.timeline li { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: var(--space-3); min-height: 68px; }
.timeline-avatar { position: relative; display: flex; justify-content: center; }
.timeline-line { position: absolute; top: 34px; bottom: 0; width: 1px; background: var(--color-divider); }
.timeline li:last-child .timeline-line { display: none; }
.event-copy { padding: 3px 0 var(--space-4); }
.event-copy p { color: var(--color-text-secondary); font-size: var(--font-size-small); line-height: 1.45; }
.event-copy strong { color: var(--color-foreground); font-weight: var(--font-weight-semibold); }
.event-copy time { display: flex; align-items: center; gap: var(--space-1); margin-top: var(--space-1); color: var(--color-text-muted); font-size: var(--font-size-caption); }
</style>
