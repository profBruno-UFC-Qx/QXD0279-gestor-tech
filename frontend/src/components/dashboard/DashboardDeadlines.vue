<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PriorityBadge from '@/components/ui/PriorityBadge.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import type { Activity } from '@/types/Activity'
import { formatDate } from '@/utils/labels'
import { isActivityOverdue, relativeDeadline } from '@/utils/activities'

defineProps<{ activities: Activity[]; projectId: number }>()
</script>

<template>
    <aside class="deadline-card">
        <SectionHeader title="Próximos prazos" description="Atividades não concluídas por data." />
        <ul v-if="activities.length" class="deadline-list">
            <li v-for="activity in activities" :key="activity.id">
                <span class="calendar" :class="{ overdue: isActivityOverdue(activity) }"><AppIcon name="calendar" :size="17" /></span>
                <div class="deadline-copy">
                    <router-link :to="{ name: 'project-activities', params: { projectId } }">{{ activity.titulo }}</router-link>
                    <span :class="{ overdue: isActivityOverdue(activity) }">{{ relativeDeadline(activity.prazo) }} · {{ formatDate(activity.prazo) }}</span>
                </div>
                <PriorityBadge :priority="activity.prioridade" />
            </li>
        </ul>
        <EmptyState v-else compact icon="calendar" title="Sem prazos pendentes" description="Não há atividades abertas com prazo neste projeto." />
    </aside>
</template>

<style scoped>
.deadline-card { display: grid; align-content: start; gap: var(--space-4); padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-xs); }
.deadline-list { display: grid; }
.deadline-list li { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: var(--space-3); padding: var(--space-3) 0; border-top: 1px solid var(--color-divider); }
.calendar { display: grid; width: 34px; height: 34px; place-items: center; border-radius: var(--radius-md); background: var(--color-primary-soft); color: var(--color-primary); }
.calendar.overdue { background: var(--color-danger-soft); color: var(--color-danger); }
.deadline-copy { display: grid; min-width: 0; }
.deadline-copy a { overflow: hidden; color: var(--color-foreground); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); text-overflow: ellipsis; white-space: nowrap; }
.deadline-copy span { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.deadline-copy span.overdue { color: var(--color-danger); }
@media (max-width: 460px) { .deadline-list li { grid-template-columns: auto minmax(0, 1fr); } .deadline-list :deep(.badge) { grid-column: 2; } }
</style>
