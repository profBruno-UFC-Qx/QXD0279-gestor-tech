<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import ProjectTabs from '@/components/projects/ProjectTabs.vue'
import AppDataTable from '@/components/ui/AppDataTable.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppSheet from '@/components/ui/AppSheet.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FilterBar from '@/components/ui/FilterBar.vue'
import FormField from '@/components/ui/FormField.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import PriorityBadge from '@/components/ui/PriorityBadge.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import {
    createActivity,
    deleteActivity,
    listProjectActivities,
    updateActivity,
    updateActivityStatus,
} from '@/services/activity'
import { getErrorMessage } from '@/services/errors'
import { listProjectMembers } from '@/services/member'
import { getProject } from '@/services/project'
import { useAuthStore } from '@/stores/auth.store'
import type { Activity, ActivityPayload, ActivityPriority, ActivityStatus } from '@/types/Activity'
import type { Project } from '@/types/Project'
import type { ProjectMember } from '@/types/ProjectMember'
import { isActivityOverdue } from '@/utils/activities'
import { activityStatusLabels, formatDate } from '@/utils/labels'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const projectId = Number(route.params.projectId)
const project = ref<Project | null>(null)
const activities = ref<Activity[]>([])
const members = ref<ProjectMember[]>([])
const isLoading = ref(true)
const isSaving = ref(false)
const isDeleting = ref(false)
const showForm = ref(false)
const editingId = ref<number | null>(null)
const activityToDelete = ref<Activity | null>(null)
const errorMessage = ref('')
const search = ref('')
const statusFilter = ref<'TODOS' | ActivityStatus | 'ATRASADA'>('TODOS')
const priorityFilter = ref<'TODAS' | ActivityPriority>('TODAS')
const canManage = computed(() => project.value?.gerenteId === authStore.user?.id || project.value?.papelAtual === 'GERENTE')
const assignableMembers = computed(() => members.value.filter((member) => member.usuarioId !== project.value?.gerenteId))
const form = reactive<ActivityPayload>({ titulo: '', descricao: '', prioridade: 'MEDIA', status: 'A_FAZER', prazo: '', responsavelId: null })

const filteredActivities = computed(() => {
    const term = search.value.trim().toLocaleLowerCase('pt-BR')
    return activities.value.filter((activity) => {
        const matchesSearch = !term || `${activity.titulo} ${activity.descricao} ${activity.responsavel?.nome ?? ''}`.toLocaleLowerCase('pt-BR').includes(term)
        const matchesStatus = statusFilter.value === 'TODOS'
            || (statusFilter.value === 'ATRASADA' ? isActivityOverdue(activity) : activity.status === statusFilter.value)
        return matchesSearch && matchesStatus && (priorityFilter.value === 'TODAS' || activity.prioridade === priorityFilter.value)
    })
})

function resetForm(): void {
    Object.assign(form, { titulo: '', descricao: '', prioridade: 'MEDIA', status: 'A_FAZER', prazo: '', responsavelId: null })
    editingId.value = null
    errorMessage.value = ''
}

function openCreateForm(): void {
    resetForm()
    showForm.value = true
}

function openEditForm(activity: Activity): void {
    Object.assign(form, { titulo: activity.titulo, descricao: activity.descricao, prioridade: activity.prioridade, status: activity.status, prazo: activity.prazo, responsavelId: activity.responsavelId })
    editingId.value = activity.id
    showForm.value = true
}

function closeForm(): void {
    showForm.value = false
    resetForm()
}

async function consumeCreateQuery(): Promise<void> {
    if (route.query.nova === '1' && canManage.value) {
        openCreateForm()
        await router.replace({ name: 'project-activities', params: { projectId } })
    }
}

onMounted(async () => {
    try {
        const [projectData, activityData, memberData] = await Promise.all([getProject(projectId), listProjectActivities(projectId), listProjectMembers(projectId)])
        project.value = projectData
        activities.value = activityData
        members.value = memberData
        await consumeCreateQuery()
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar as atividades.')
    } finally {
        isLoading.value = false
    }
})

watch(() => route.query.nova, async () => { if (!isLoading.value) await consumeCreateQuery() })

async function handleSave(): Promise<void> {
    if (!form.titulo.trim() || !form.prazo) {
        errorMessage.value = 'Informe o título e o prazo da atividade.'
        return
    }
    isSaving.value = true
    errorMessage.value = ''
    try {
        if (editingId.value) {
            const updated = await updateActivity(projectId, editingId.value, form)
            activities.value = activities.value.map((item) => item.id === updated.id ? updated : item)
            toast.success('Atividade atualizada', { description: updated.titulo })
        } else {
            const created = await createActivity(projectId, form)
            activities.value.push(created)
            toast.success('Atividade criada', { description: created.titulo })
        }
        closeForm()
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível salvar a atividade.')
        toast.error('Não foi possível salvar a atividade')
    } finally {
        isSaving.value = false
    }
}

function canUpdateStatus(activity: Activity): boolean {
    return canManage.value || activity.responsavelId === authStore.user?.id
}

async function handleStatusChange(activity: Activity, status: ActivityStatus): Promise<void> {
    const previousStatus = activity.status
    activity.status = status
    try {
        const updated = await updateActivityStatus(projectId, activity.id, status)
        activities.value = activities.value.map((item) => item.id === updated.id ? updated : item)
        toast.success('Status atualizado', { description: `${activity.titulo}: ${activityStatusLabels[status]}.` })
    } catch (error: unknown) {
        activity.status = previousStatus
        errorMessage.value = getErrorMessage(error, 'Não foi possível atualizar o status.')
        toast.error('Não foi possível atualizar o status')
    }
}

async function confirmDelete(): Promise<void> {
    if (!activityToDelete.value) return
    isDeleting.value = true
    try {
        const deleted = activityToDelete.value
        await deleteActivity(projectId, deleted.id)
        activities.value = activities.value.filter((item) => item.id !== deleted.id)
        activityToDelete.value = null
        toast.success('Atividade excluída', { description: deleted.titulo })
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível excluir a atividade.')
        toast.error('Não foi possível excluir a atividade')
    } finally {
        isDeleting.value = false
    }
}
</script>

<template>
    <section class="page-stack">
        <LoadingSkeleton v-if="isLoading" variant="table" />
        <template v-else-if="project">
            <PageHeader eyebrow="Projeto" :title="project.nome" description="Distribua atividades, responsáveis e prazos em uma visão organizada.">
                <template v-if="canManage" #actions><BaseButton @click="openCreateForm"><template #icon><AppIcon name="plus" :size="17" /></template>Nova atividade</BaseButton></template>
            </PageHeader>
            <ProjectTabs :project-id="projectId" />
            <div v-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>

            <FilterBar v-if="activities.length">
                <SearchInput v-model="search" placeholder="Buscar atividade ou responsável" label="Buscar atividades" />
                <template #filters>
                    <label><span class="sr-only">Filtrar por status</span><select v-model="statusFilter"><option value="TODOS">Todos os status</option><option value="A_FAZER">A fazer</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluídas</option><option value="ATRASADA">Atrasadas</option></select></label>
                    <label><span class="sr-only">Filtrar por prioridade</span><select v-model="priorityFilter"><option value="TODAS">Todas as prioridades</option><option value="BAIXA">Baixa</option><option value="MEDIA">Média</option><option value="ALTA">Alta</option></select></label>
                </template>
            </FilterBar>

            <AppDataTable label="Atividades do projeto" :empty="filteredActivities.length === 0">
                <template #header><SectionHeader title="Atividades" :description="`${filteredActivities.length} de ${activities.length} exibidas`" /></template>
                <template #default>
                    <thead><tr><th>Atividade</th><th>Responsável</th><th>Prioridade</th><th>Prazo</th><th>Status</th><th><span class="sr-only">Ações</span></th></tr></thead>
                    <tbody>
                        <tr v-for="activity in filteredActivities" :key="activity.id">
                            <td><div class="activity-title"><strong>{{ activity.titulo }}</strong><span>{{ activity.descricao || 'Sem descrição.' }}</span><StatusBadge v-if="isActivityOverdue(activity)" value="ATRASADA" label="Atrasada" /></div></td>
                            <td><div class="person"><UserAvatar :name="activity.responsavel?.nome ?? 'Sem responsável'" size="sm" /><span>{{ activity.responsavel?.nome ?? 'Não definido' }}</span></div></td>
                            <td><PriorityBadge :priority="activity.prioridade" /></td>
                            <td><span class="deadline" :class="{ overdue: isActivityOverdue(activity) }">{{ formatDate(activity.prazo) }}</span></td>
                            <td><label class="status-select"><span class="sr-only">Status de {{ activity.titulo }}</span><select :value="activity.status" :disabled="!canUpdateStatus(activity)" @change="handleStatusChange(activity, ($event.target as HTMLSelectElement).value as ActivityStatus)"><option v-for="(label, status) in activityStatusLabels" :key="status" :value="status">{{ label }}</option></select></label></td>
                            <td><div v-if="canManage" class="row-actions"><BaseButton variant="ghost" size="sm" :aria-label="`Editar ${activity.titulo}`" @click="openEditForm(activity)"><template #icon><AppIcon name="pencil" :size="16" /></template></BaseButton><BaseButton variant="ghost" size="sm" :aria-label="`Excluir ${activity.titulo}`" class="delete-button" @click="activityToDelete = activity"><template #icon><AppIcon name="trash" :size="16" /></template></BaseButton></div></td>
                        </tr>
                    </tbody>
                </template>
                <template #empty><EmptyState compact :icon="activities.length ? 'search' : 'activities'" :title="activities.length ? 'Nenhuma atividade encontrada' : 'Nenhuma atividade cadastrada'" :description="activities.length ? 'Ajuste a busca ou os filtros.' : 'Crie a primeira atividade para iniciar o planejamento desta entrega.'"><template v-if="canManage && !activities.length" #actions><BaseButton @click="openCreateForm">Criar atividade</BaseButton></template></EmptyState></template>
            </AppDataTable>
        </template>
        <EmptyState v-else icon="alert-triangle" title="Atividades indisponíveis" :description="errorMessage || 'Não foi possível encontrar este projeto.'" />

        <AppSheet :open="showForm" :title="editingId ? 'Editar atividade' : 'Nova atividade'" description="Defina escopo, responsável, prioridade e prazo." @update:open="$event ? (showForm = true) : closeForm()">
            <form id="activity-form" class="activity-form" @submit.prevent="handleSave">
                <BaseInput v-model="form.titulo" label="Título" placeholder="Ex.: Revisar fluxo de cadastro" required />
                <FormField label="Descrição"><template #default="{ id }"><textarea :id="id" v-model="form.descricao" rows="4" placeholder="Contexto e critérios da atividade" /></template></FormField>
                <FormField label="Responsável"><template #default="{ id }"><select :id="id" v-model="form.responsavelId"><option :value="null">Sem responsável</option><option :value="project?.gerenteId">{{ project?.gerente?.nome ?? 'Gerente do projeto' }} (gerente)</option><option v-for="member in assignableMembers" :key="member.usuarioId" :value="member.usuarioId">{{ member.usuario.nome }}</option></select></template></FormField>
                <div class="form-row"><FormField label="Prioridade"><template #default="{ id }"><select :id="id" v-model="form.prioridade"><option value="BAIXA">Baixa</option><option value="MEDIA">Média</option><option value="ALTA">Alta</option></select></template></FormField><FormField label="Status"><template #default="{ id }"><select :id="id" v-model="form.status"><option value="A_FAZER">A fazer</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluída</option></select></template></FormField></div>
                <BaseInput v-model="form.prazo" type="date" label="Prazo" required />
                <div v-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>
            </form>
            <template #footer><BaseButton variant="secondary" @click="closeForm">Cancelar</BaseButton><BaseButton type="submit" form="activity-form" :loading="isSaving">{{ editingId ? 'Salvar alterações' : 'Criar atividade' }}</BaseButton></template>
        </AppSheet>

        <ConfirmDialog :open="Boolean(activityToDelete)" title="Excluir atividade?" :description="activityToDelete ? `A atividade “${activityToDelete.titulo}” será removida permanentemente deste navegador.` : ''" confirm-label="Excluir atividade" danger :busy="isDeleting" @update:open="!$event && (activityToDelete = null)" @confirm="confirmDelete" />
    </section>
</template>

<style scoped>
.activity-title { display: grid; max-width: 300px; gap: 3px; }
.activity-title strong { overflow: hidden; color: var(--color-foreground); font-size: var(--font-size-small); text-overflow: ellipsis; white-space: nowrap; }
.activity-title > span:not(.badge) { display: -webkit-box; overflow: hidden; color: var(--color-text-muted); font-size: var(--font-size-caption); -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
.activity-title :deep(.badge) { margin-top: 3px; }
.person { display: flex; min-width: 150px; align-items: center; gap: var(--space-2); color: var(--color-foreground); }
.deadline { white-space: nowrap; }.deadline.overdue { color: var(--color-danger); font-weight: var(--font-weight-semibold); }
.status-select select { min-width: 138px; min-height: var(--control-height-sm); padding-block: 7px; font-size: var(--font-size-small); }
.row-actions { display: flex; justify-content: flex-end; gap: 2px; }.row-actions :deep(.button) { width: 34px; padding: 0; }.delete-button { color: var(--color-danger) !important; }
.activity-form { display: grid; gap: var(--space-5); }.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
@media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
</style>
