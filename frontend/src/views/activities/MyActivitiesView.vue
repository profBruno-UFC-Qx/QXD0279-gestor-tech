<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'reka-ui'

import AppDataTable from '@/components/ui/AppDataTable.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FilterBar from '@/components/ui/FilterBar.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import { listMyActivities, updateActivityStatus } from '@/services/activity'
import { getErrorMessage } from '@/services/errors'
import type { Activity, ActivityPriority, ActivityStatus } from '@/types/Activity'
import type { IconName } from '@/types/Ui'
import { isActivityOverdue } from '@/utils/activities'
import { activityStatusLabels, formatDate, priorityLabels } from '@/utils/labels'

const router = useRouter()
const activities = ref<Activity[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const search = ref('')
const statusFilter = ref<'TODOS' | ActivityStatus>('TODOS')
const priorityFilter = ref<'TODAS' | ActivityPriority>('TODAS')
const viewMode = ref<'list' | 'kanban'>('list')
const draggedActivityId = ref<number | null>(null)
const dragOverStatus = ref<ActivityStatus | null>(null)

const kanbanColumns: Array<{ status: ActivityStatus; label: string }> = [
    { status: 'A_FAZER', label: 'A fazer' },
    { status: 'EM_ANDAMENTO', label: 'Em andamento' },
    { status: 'CONCLUIDA', label: 'Concluída' },
]

const filteredActivities = computed(() => {
    const term = search.value.trim().toLocaleLowerCase('pt-BR')
    return activities.value.filter((activity) => {
        const matchesSearch = !term || `${activity.titulo} ${activity.descricao} ${activity.projeto?.nome ?? ''}`.toLocaleLowerCase('pt-BR').includes(term)
        const matchesStatus = statusFilter.value === 'TODOS' || activity.status === statusFilter.value
        const matchesPriority = priorityFilter.value === 'TODAS' || activity.prioridade === priorityFilter.value
        return matchesSearch && matchesStatus && matchesPriority
    })
})

onMounted(async () => {
    try {
        activities.value = await listMyActivities()
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar suas atividades.')
    } finally {
        isLoading.value = false
    }
})

function statusIcon(status: ActivityStatus): IconName {
    if (status === 'CONCLUIDA') return 'check-circle'
    if (status === 'EM_ANDAMENTO') return 'clock'
    return 'activities'
}

function activitiesForStatus(status: ActivityStatus): Activity[] {
    return filteredActivities.value.filter((activity) => activity.status === status)
}

function openActivity(activity: Activity): void {
    void router.push({ name: 'project-activities', params: { projectId: activity.projetoId }, query: { atividade: String(activity.id) } })
}

async function handleStatusChange(activity: Activity, status: ActivityStatus): Promise<void> {
    if (activity.status === status) return
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

function startDragging(activity: Activity, event: DragEvent): void {
    draggedActivityId.value = activity.id
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(activity.id))
    }
}

function stopDragging(): void {
    draggedActivityId.value = null
    dragOverStatus.value = null
}

async function dropActivity(status: ActivityStatus): Promise<void> {
    const activity = activities.value.find((item) => item.id === draggedActivityId.value)
    stopDragging()
    if (activity) await handleStatusChange(activity, status)
}
</script>

<template>
    <section class="activities-page page-stack">
        <header class="page-heading">
            <span class="eyebrow">Meu trabalho</span>
            <div class="title-row"><h1>Minhas atividades</h1><span class="total-badge" :aria-label="`${activities.length} atividades`">{{ activities.length }}</span></div>
            <p>Atividades atribuídas a você em todos os projetos.</p>
        </header>

        <LoadingSkeleton v-if="isLoading" variant="table" />
        <div v-else-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>
        <template v-else>
            <FilterBar v-if="activities.length" class="control-bar">
                <SearchInput v-model="search" placeholder="Pesquisar por atividade ou projeto" label="Buscar minhas atividades" shortcut="Ctrl K" />
                <template #filters>
                    <label><span class="sr-only">Filtrar por status</span><select v-model="statusFilter"><option value="TODOS">Todos os status</option><option value="A_FAZER">A fazer</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluída</option></select></label>
                    <label><span class="sr-only">Filtrar por prioridade</span><select v-model="priorityFilter"><option value="TODAS">Todas as prioridades</option><option value="ALTA">Alta</option><option value="MEDIA">Média</option><option value="BAIXA">Baixa</option></select></label>
                </template>
                <template #actions>
                    <div class="view-toggle" aria-label="Modo de visualização">
                        <button type="button" :class="{ active: viewMode === 'list' }" :aria-pressed="viewMode === 'list'" @click="viewMode = 'list'"><AppIcon name="activities" :size="16" />Lista</button>
                        <button type="button" :class="{ active: viewMode === 'kanban' }" :aria-pressed="viewMode === 'kanban'" @click="viewMode = 'kanban'"><AppIcon name="dashboard" :size="16" />Kanban</button>
                    </div>
                </template>
            </FilterBar>

            <EmptyState v-if="!filteredActivities.length" :icon="activities.length ? 'search' : 'activities'" :title="activities.length ? 'Nenhuma atividade encontrada' : 'Você não possui atividades atribuídas'" :description="activities.length ? 'Ajuste a pesquisa ou os filtros para encontrar outras atividades.' : 'Quando uma atividade for atribuída a você, ela aparecerá aqui.'" />

            <AppDataTable v-else-if="viewMode === 'list'" label="Minhas atividades">
                <template #header><div class="list-heading"><div><h2>Atividades atribuídas</h2><p>{{ filteredActivities.length }} de {{ activities.length }} exibidas</p></div><span>{{ filteredActivities.length }} {{ filteredActivities.length === 1 ? 'tarefa' : 'tarefas' }}</span></div></template>
                <template #default>
                    <thead><tr><th>Atividade</th><th>Projeto</th><th>Prioridade</th><th>Prazo</th><th>Status</th><th><span class="sr-only">Ações</span></th></tr></thead>
                    <tbody>
                        <tr v-for="activity in filteredActivities" :key="activity.id">
                            <td><div class="activity-copy"><strong>{{ activity.titulo }}</strong><span>{{ activity.descricao || 'Sem descrição.' }}</span><span v-if="isActivityOverdue(activity)" class="overdue-label">Prazo vencido</span></div></td>
                            <td><router-link class="project-link" :to="{ name: 'project-activities', params: { projectId: activity.projetoId } }"><span />{{ activity.projeto?.nome ?? `Projeto #${activity.projetoId}` }}</router-link></td>
                            <td><span class="priority-badge" :class="`priority-badge--${activity.prioridade.toLowerCase()}`"><i />{{ priorityLabels[activity.prioridade] }}</span></td>
                            <td><span class="deadline" :class="{ overdue: isActivityOverdue(activity) }">{{ formatDate(activity.prazo) }}</span></td>
                            <td><label class="status-control" :class="`status-control--${activity.status.toLowerCase()}`"><span class="sr-only">Status de {{ activity.titulo }}</span><AppIcon :name="statusIcon(activity.status)" :size="15" /><select :value="activity.status" @change="handleStatusChange(activity, ($event.target as HTMLSelectElement).value as ActivityStatus)"><option v-for="(label, status) in activityStatusLabels" :key="status" :value="status">{{ label }}</option></select></label></td>
                            <td><div class="row-actions"><button type="button" class="icon-action" :aria-label="`Editar ${activity.titulo}`" @click="openActivity(activity)"><AppIcon name="pencil" :size="16" /></button><DropdownMenuRoot><DropdownMenuTrigger class="icon-action" :aria-label="`Mais opções para ${activity.titulo}`"><AppIcon name="more-vertical" :size="17" /></DropdownMenuTrigger><DropdownMenuPortal><DropdownMenuContent class="task-menu" align="end" :side-offset="6"><DropdownMenuItem class="task-menu-item" @select="openActivity(activity)"><AppIcon name="arrow-right" :size="16" />Abrir no projeto</DropdownMenuItem><DropdownMenuSeparator class="task-menu-separator" /><DropdownMenuItem v-if="activity.status !== 'CONCLUIDA'" class="task-menu-item" @select="handleStatusChange(activity, 'CONCLUIDA')"><AppIcon name="check-circle" :size="16" />Marcar como concluída</DropdownMenuItem><DropdownMenuItem v-else class="task-menu-item" @select="handleStatusChange(activity, 'A_FAZER')"><AppIcon name="activities" :size="16" />Mover para A fazer</DropdownMenuItem></DropdownMenuContent></DropdownMenuPortal></DropdownMenuRoot></div></td>
                        </tr>
                    </tbody>
                </template>
            </AppDataTable>

            <section v-else class="kanban-board" aria-label="Quadro Kanban das minhas atividades">
                <article v-for="column in kanbanColumns" :key="column.status" class="kanban-column" :class="{ 'kanban-column--over': dragOverStatus === column.status }" @dragover.prevent="dragOverStatus = column.status" @dragleave.self="dragOverStatus = null" @drop.prevent="dropActivity(column.status)">
                    <header><div><span class="column-dot" :class="`column-dot--${column.status.toLowerCase()}`" /><h2>{{ column.label }}</h2></div><strong>{{ activitiesForStatus(column.status).length }}</strong></header>
                    <div class="kanban-list">
                        <article v-for="activity in activitiesForStatus(column.status)" :key="activity.id" class="kanban-card" :class="{ 'kanban-card--dragging': draggedActivityId === activity.id }" draggable="true" @dragstart="startDragging(activity, $event)" @dragend="stopDragging">
                            <div class="kanban-card-top"><span class="project-chip"><i />{{ activity.projeto?.nome ?? `Projeto #${activity.projetoId}` }}</span><span class="priority-badge" :class="`priority-badge--${activity.prioridade.toLowerCase()}`"><i />{{ priorityLabels[activity.prioridade] }}</span></div>
                            <div><h3>{{ activity.titulo }}</h3><p>{{ activity.descricao || 'Sem descrição.' }}</p></div>
                            <div class="kanban-footer"><span :class="{ overdue: isActivityOverdue(activity) }"><AppIcon name="calendar" :size="14" />{{ formatDate(activity.prazo) }}</span><button type="button" :aria-label="`Abrir ${activity.titulo}`" @click="openActivity(activity)"><AppIcon name="arrow-right" :size="16" /></button></div>
                        </article>
                        <div v-if="!activitiesForStatus(column.status).length" class="column-empty">Arraste uma tarefa para esta coluna</div>
                    </div>
                </article>
            </section>
        </template>
    </section>
</template>

<style scoped>
.activities-page { min-width: 0; }
.page-heading { display: grid; gap: var(--space-2); }
.eyebrow { color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-bold); letter-spacing: .09em; text-transform: uppercase; }
.title-row { display: flex; align-items: center; gap: var(--space-3); }
.title-row h1 { font-size: clamp(1.55rem, 2.5vw, 2rem); font-weight: 750; letter-spacing: -.035em; text-transform: uppercase; }
.total-badge { display: grid; min-width: 30px; height: 30px; place-items: center; padding-inline: 8px; border-radius: var(--radius-pill); background: var(--color-primary-soft); color: var(--color-primary-active); font-size: var(--font-size-small); font-weight: var(--font-weight-bold); }
.page-heading p { color: var(--color-text-secondary); }
.control-bar :deep(.search-slot) { min-width: min(320px, 100%); }
.view-toggle { display: inline-flex; padding: 3px; border: 1px solid var(--color-border); border-radius: var(--radius-pill); background: var(--color-surface-subtle); }
.view-toggle button { display: inline-flex; min-height: 32px; align-items: center; gap: 6px; padding: 6px 11px; border: 0; border-radius: var(--radius-pill); background: transparent; color: var(--color-text-secondary); cursor: pointer; font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); }
.view-toggle button.active { background: var(--color-sidebar); color: var(--color-white); box-shadow: var(--shadow-xs); }
.list-heading { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); }
.list-heading h2 { font-size: var(--font-size-section-title); }
.list-heading p { margin-top: 2px; color: var(--color-text-secondary); font-size: var(--font-size-small); }
.list-heading > span { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.activity-copy { display: grid; max-width: 320px; gap: 3px; }
.activity-copy strong { overflow: hidden; color: var(--color-foreground); font-weight: var(--font-weight-semibold); text-overflow: ellipsis; white-space: nowrap; }
.activity-copy > span:not(.overdue-label) { display: -webkit-box; overflow: hidden; color: var(--color-text-muted); font-size: var(--font-size-caption); -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
.overdue-label { width: fit-content; margin-top: 3px; color: var(--color-danger); font-size: .6875rem; font-weight: var(--font-weight-semibold); }
.project-link { display: inline-flex; max-width: 220px; align-items: center; gap: var(--space-2); overflow: hidden; color: var(--color-foreground); font-weight: var(--font-weight-medium); text-overflow: ellipsis; white-space: nowrap; }
.project-link > span, .project-chip i { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 3px; background: var(--color-chart-blue); }
.priority-badge { display: inline-flex; min-height: 28px; align-items: center; gap: 6px; padding: 5px 10px; border-radius: var(--radius-pill); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); white-space: nowrap; }
.priority-badge i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.priority-badge--alta { background: #fbecef; color: #9d4259; }
.priority-badge--media { background: #fff5df; color: #94620b; }
.priority-badge--baixa { background: #eef1f5; color: #5b6677; }
.deadline { color: var(--color-text-secondary); white-space: nowrap; }
.deadline.overdue, .kanban-footer > span.overdue { color: var(--color-danger); font-weight: var(--font-weight-semibold); }
.status-control { position: relative; display: inline-flex; min-width: 146px; align-items: center; border: 1px solid transparent; border-radius: var(--radius-pill); }
.status-control > svg { position: absolute; z-index: 1; left: 10px; pointer-events: none; }
.status-control select { min-width: 144px; min-height: 34px; padding: 6px 28px 6px 31px; border: 0; border-radius: inherit; background: transparent; color: inherit; font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); }
.status-control--a_fazer { background: #eef1f5; color: #5b6677; }
.status-control--em_andamento { border-color: #cfdcff; background: #edf3ff; color: #3558b5; }
.status-control--concluida { border-color: #cde9e4; background: #eaf7f4; color: #237b70; }
.row-actions { display: flex; justify-content: flex-end; gap: var(--space-1); }
.icon-action { display: grid; width: 34px; height: 34px; place-items: center; border: 0; border-radius: var(--radius-sm); background: transparent; color: var(--color-text-muted); cursor: pointer; transition: var(--transition-colors); }
.icon-action:hover, .icon-action[data-state='open'] { background: var(--color-surface-subtle); color: var(--color-foreground); }
.kanban-board { display: grid; grid-template-columns: repeat(3, minmax(270px, 1fr)); align-items: start; gap: var(--space-4); overflow-x: auto; padding-bottom: var(--space-2); }
.kanban-column { min-height: 440px; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: rgba(244, 246, 248, .78); transition: var(--transition-colors); }
.kanban-column--over { border-color: var(--color-primary); background: var(--color-primary-subtle); }
.kanban-column > header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) var(--space-1) var(--space-4); }
.kanban-column > header div { display: flex; align-items: center; gap: var(--space-2); }
.kanban-column > header h2 { font-size: var(--font-size-card-title); }
.kanban-column > header strong { display: grid; min-width: 25px; height: 25px; place-items: center; border-radius: 50%; background: var(--color-surface); color: var(--color-text-secondary); font-size: var(--font-size-caption); }
.column-dot { width: 8px; height: 8px; border-radius: 50%; }
.column-dot--a_fazer { background: var(--color-text-muted); }
.column-dot--em_andamento { background: var(--color-chart-blue); }
.column-dot--concluida { background: var(--color-chart-aqua); }
.kanban-list { display: grid; gap: var(--space-3); }
.kanban-card { display: grid; gap: var(--space-3); padding: var(--space-4); border: 1px solid rgba(231, 234, 240, .8); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-sm); cursor: grab; transition: opacity var(--duration-fast), transform var(--duration-fast); }
.kanban-card:active { cursor: grabbing; }
.kanban-card--dragging { opacity: .4; transform: rotate(1deg) scale(.98); }
.kanban-card-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); }
.project-chip { display: inline-flex; min-width: 0; align-items: center; gap: 6px; overflow: hidden; color: var(--color-text-muted); font-size: .6875rem; text-overflow: ellipsis; white-space: nowrap; }
.kanban-card h3 { color: var(--color-foreground); font-size: var(--font-size-card-title); }
.kanban-card p { display: -webkit-box; margin-top: 3px; overflow: hidden; color: var(--color-text-secondary); font-size: var(--font-size-caption); -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.kanban-footer { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--color-divider); }
.kanban-footer > span { display: flex; align-items: center; gap: 6px; color: var(--color-text-muted); font-size: var(--font-size-caption); }
.kanban-footer button { display: grid; width: 30px; height: 30px; place-items: center; border: 0; border-radius: 50%; background: var(--color-primary-soft); color: var(--color-primary); cursor: pointer; }
.column-empty { display: grid; min-height: 88px; place-items: center; padding: var(--space-4); border: 1px dashed var(--color-border-strong); border-radius: var(--radius-lg); color: var(--color-text-muted); font-size: var(--font-size-caption); text-align: center; }
:global(.task-menu) { z-index: 110; min-width: 210px; padding: 6px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-dialog); }
:global(.task-menu-item) { display: flex; min-height: 38px; align-items: center; gap: var(--space-2); padding: 8px 10px; border-radius: var(--radius-sm); color: var(--color-text-secondary); cursor: pointer; font-size: var(--font-size-small); outline: none; }
:global(.task-menu-item[data-highlighted]) { background: var(--color-surface-subtle); color: var(--color-foreground); }
:global(.task-menu-separator) { height: 1px; margin: 4px 0; background: var(--color-divider); }
@media (max-width: 900px) { .kanban-board { grid-template-columns: repeat(3, minmax(280px, 82vw)); } }
@media (max-width: 760px) { .list-heading > span { display: none; } .control-bar :deep(.actions) { justify-content: flex-end; } }
</style>
