<script setup lang="ts">
import AppDataTable from '@/components/ui/AppDataTable.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import PriorityBadge from '@/components/ui/PriorityBadge.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Activity } from '@/types/Activity'
import { activityStatusLabels, formatDate } from '@/utils/labels'
import { isActivityOverdue } from '@/utils/activities'

defineProps<{ activities: Activity[]; projectId: number }>()
</script>

<template>
    <AppDataTable label="Atividades relevantes" :empty="activities.length === 0">
        <template #header>
            <SectionHeader title="Atividades relevantes" description="Próximas entregas e tarefas em andamento.">
                <template #actions><router-link class="view-all" :to="{ name: 'project-activities', params: { projectId } }">Ver todas</router-link></template>
            </SectionHeader>
        </template>
        <template #default>
            <thead><tr><th>Atividade</th><th>Status</th><th>Responsável</th><th>Prazo</th><th>Prioridade</th></tr></thead>
            <tbody>
                <tr v-for="activity in activities" :key="activity.id">
                    <td><strong class="task-title">{{ activity.titulo }}</strong></td>
                    <td><StatusBadge v-if="isActivityOverdue(activity)" value="ATRASADA" label="Atrasada" /><StatusBadge v-else :value="activity.status" :label="activityStatusLabels[activity.status]" /></td>
                    <td><div class="person"><UserAvatar :name="activity.responsavel?.nome ?? 'Sem responsável'" size="sm" /><span>{{ activity.responsavel?.nome ?? 'Não definido' }}</span></div></td>
                    <td><span :class="{ overdue: isActivityOverdue(activity) }">{{ formatDate(activity.prazo) }}</span></td>
                    <td><PriorityBadge :priority="activity.prioridade" /></td>
                </tr>
            </tbody>
        </template>
        <template #empty><EmptyState compact icon="activities" title="Nenhuma atividade" description="As atividades do projeto aparecerão aqui." /></template>
    </AppDataTable>
</template>

<style scoped>
.view-all { color: var(--color-primary); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }
.task-title { display: block; max-width: 280px; overflow: hidden; color: var(--color-foreground); font-weight: var(--font-weight-semibold); text-overflow: ellipsis; white-space: nowrap; }
.person { display: flex; min-width: 150px; align-items: center; gap: var(--space-2); color: var(--color-foreground); }
.overdue { color: var(--color-danger); font-weight: var(--font-weight-semibold); }
</style>
