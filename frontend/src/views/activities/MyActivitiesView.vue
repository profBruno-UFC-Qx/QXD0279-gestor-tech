<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

import AppDataTable from '@/components/ui/AppDataTable.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FilterBar from '@/components/ui/FilterBar.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import PriorityBadge from '@/components/ui/PriorityBadge.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { listMyActivities, updateActivityStatus } from '@/services/activity'
import { getErrorMessage } from '@/services/errors'
import type { Activity, ActivityStatus } from '@/types/Activity'
import { isActivityOverdue } from '@/utils/activities'
import { activityStatusLabels, formatDate } from '@/utils/labels'

const activities = ref<Activity[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const search = ref('')
const statusFilter = ref<'TODOS' | ActivityStatus | 'ATRASADA'>('TODOS')

const filteredActivities = computed(() => {
    const term = search.value.trim().toLocaleLowerCase('pt-BR')
    return activities.value.filter((activity) => {
        const matchesSearch = !term || `${activity.titulo} ${activity.descricao} ${activity.projeto?.nome ?? ''}`.toLocaleLowerCase('pt-BR').includes(term)
        return matchesSearch && (statusFilter.value === 'TODOS' || (statusFilter.value === 'ATRASADA' ? isActivityOverdue(activity) : activity.status === statusFilter.value))
    })
})

onMounted(async () => {
    try { activities.value = await listMyActivities() }
    catch (error: unknown) { errorMessage.value = getErrorMessage(error, 'Não foi possível carregar suas atividades.') }
    finally { isLoading.value = false }
})

async function handleStatusChange(activity: Activity, status: ActivityStatus): Promise<void> {
    const previousStatus = activity.status
    activity.status = status
    errorMessage.value = ''
    try {
        const updated = await updateActivityStatus(activity.projetoId, activity.id, status)
        activities.value = activities.value.map((item) => item.id === updated.id ? updated : item)
        toast.success('Status atualizado', { description: `${activity.titulo}: ${activityStatusLabels[status]}.` })
    } catch (error: unknown) {
        activity.status = previousStatus
        errorMessage.value = getErrorMessage(error, 'Não foi possível atualizar o status.')
        toast.error('Não foi possível atualizar o status')
    }
}
</script>

<template>
    <section class="page-stack">
        <PageHeader eyebrow="Meu trabalho" title="Minhas atividades" description="Atividades atribuídas a você em todos os projetos." />
        <LoadingSkeleton v-if="isLoading" variant="table" />
        <div v-else-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>
        <template v-else>
            <FilterBar v-if="activities.length">
                <SearchInput v-model="search" placeholder="Buscar atividade ou projeto" label="Buscar minhas atividades" />
                <template #filters><label><span class="sr-only">Filtrar por status</span><select v-model="statusFilter"><option value="TODOS">Todos os status</option><option value="A_FAZER">A fazer</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluídas</option><option value="ATRASADA">Atrasadas</option></select></label></template>
            </FilterBar>
            <AppDataTable label="Minhas atividades" :empty="filteredActivities.length === 0">
                <template #header><SectionHeader title="Atividades atribuídas" :description="`${filteredActivities.length} de ${activities.length} exibidas`" /></template>
                <template #default>
                    <thead><tr><th>Atividade</th><th>Projeto</th><th>Prioridade</th><th>Prazo</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr v-for="activity in filteredActivities" :key="activity.id">
                            <td><div class="activity-copy"><strong>{{ activity.titulo }}</strong><span>{{ activity.descricao || 'Sem descrição.' }}</span><StatusBadge v-if="isActivityOverdue(activity)" value="ATRASADA" label="Atrasada" /></div></td>
                            <td><router-link class="project-link" :to="{ name: 'project-activities', params: { projectId: activity.projetoId } }">{{ activity.projeto?.nome ?? `Projeto #${activity.projetoId}` }}</router-link></td>
                            <td><PriorityBadge :priority="activity.prioridade" /></td>
                            <td><span :class="{ overdue: isActivityOverdue(activity) }">{{ formatDate(activity.prazo) }}</span></td>
                            <td><label><span class="sr-only">Status de {{ activity.titulo }}</span><select class="status-select" :value="activity.status" @change="handleStatusChange(activity, ($event.target as HTMLSelectElement).value as ActivityStatus)"><option v-for="(label, status) in activityStatusLabels" :key="status" :value="status">{{ label }}</option></select></label></td>
                        </tr>
                    </tbody>
                </template>
                <template #empty><EmptyState compact :icon="activities.length ? 'search' : 'activities'" :title="activities.length ? 'Nenhuma atividade encontrada' : 'Você não possui atividades atribuídas'" :description="activities.length ? 'Ajuste a busca ou o filtro de status.' : 'Quando uma atividade for atribuída a você, ela aparecerá aqui.'" /></template>
            </AppDataTable>
        </template>
    </section>
</template>

<style scoped>
.activity-copy { display: grid; max-width: 320px; gap: 3px; }.activity-copy strong { overflow: hidden; color: var(--color-foreground); text-overflow: ellipsis; white-space: nowrap; }.activity-copy > span:not(.badge) { display: -webkit-box; overflow: hidden; color: var(--color-text-muted); font-size: var(--font-size-caption); -webkit-box-orient: vertical; -webkit-line-clamp: 1; }.activity-copy :deep(.badge) { margin-top: 3px; }
.project-link { color: var(--color-primary); font-weight: var(--font-weight-semibold); }.overdue { color: var(--color-danger); font-weight: var(--font-weight-semibold); }.status-select { min-width: 140px; min-height: var(--control-height-sm); padding-block: 7px; font-size: var(--font-size-small); }
</style>
