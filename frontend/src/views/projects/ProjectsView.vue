<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import AppIcon from '@/components/ui/AppIcon.vue'
import AppSheet from '@/components/ui/AppSheet.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FilterBar from '@/components/ui/FilterBar.vue'
import FormField from '@/components/ui/FormField.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import ProgressIndicator from '@/components/ui/ProgressIndicator.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { calculateProjectMetrics, listProjectActivities } from '@/services/activity'
import { getErrorMessage } from '@/services/errors'
import { listProjectMembers } from '@/services/member'
import { createProject, listProjects } from '@/services/project'
import { useAuthStore } from '@/stores/auth.store'
import type { ProjectMetrics } from '@/types/Activity'
import type { Project, ProjectPayload, ProjectStatus } from '@/types/Project'
import { formatDate, projectStatusLabels } from '@/utils/labels'

interface ProjectListItem {
    project: Project
    metrics: ProjectMetrics
    team: Array<{ id: number; name: string }>
}

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const items = ref<ProjectListItem[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const search = ref('')
const statusFilter = ref<'TODOS' | ProjectStatus>('TODOS')
const roleFilter = ref<'TODOS' | 'GERENTE' | 'MEMBRO'>('TODOS')
const showCreatePanel = ref(false)
const isSaving = ref(false)
const createError = ref('')
const form = reactive<ProjectPayload>({ nome: '', descricao: '', dataInicio: '', dataFim: '', status: 'PLANEJADO' })

function isManager(project: Project): boolean {
    return project.gerenteId === authStore.user?.id || project.papelAtual === 'GERENTE'
}

function projectHealth(item: ProjectListItem): { label: string; tone: 'success' | 'warning' | 'danger' } {
    if (item.project.status === 'CONCLUIDO') return { label: 'No prazo', tone: 'success' }

    const today = new Date()
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const start = new Date(`${item.project.dataInicio}T00:00:00`).getTime()
    const end = new Date(`${item.project.dataFim}T00:00:00`).getTime()
    if (current > end) return { label: 'Atrasado', tone: 'danger' }

    const expectedProgress = Math.min(100, Math.max(0, ((current - start) / Math.max(1, end - start)) * 100))
    if (item.metrics.atrasadas > 0 || expectedProgress - item.metrics.percentualConclusao >= 20) {
        return { label: 'Em risco', tone: 'warning' }
    }
    return { label: 'No prazo', tone: 'success' }
}

function resetCreateForm(): void {
    Object.assign(form, { nome: '', descricao: '', dataInicio: '', dataFim: '', status: 'PLANEJADO' })
    createError.value = ''
}

function openCreateProject(): void {
    resetCreateForm()
    showCreatePanel.value = true
}

function closeCreateProject(): void {
    showCreatePanel.value = false
    resetCreateForm()
}

async function consumeCreateQuery(): Promise<void> {
    if (route.query.novo !== '1') return
    openCreateProject()
    const { novo: _novo, ...query } = route.query
    await router.replace({ name: 'projects', query })
}

async function handleCreateProject(): Promise<void> {
    createError.value = ''
    if (!form.nome.trim() || !form.dataInicio || !form.dataFim) {
        createError.value = 'Preencha nome, data de início e data de término.'
        return
    }
    if (form.dataFim < form.dataInicio) {
        createError.value = 'A data de término não pode ser anterior à data de início.'
        return
    }

    isSaving.value = true
    try {
        const project = await createProject(form)
        items.value.unshift({
            project,
            metrics: { total: 0, concluidas: 0, pendentes: 0, atrasadas: 0, percentualConclusao: 0 },
            team: [{ id: project.gerenteId, name: project.gerente?.nome ?? authStore.user?.nome ?? 'Gerente' }],
        })
        closeCreateProject()
        toast.success('Projeto criado', { description: `${project.nome} foi adicionado ao portfólio.` })
    } catch (error: unknown) {
        createError.value = getErrorMessage(error, 'Não foi possível criar o projeto.')
    } finally {
        isSaving.value = false
    }
}

const filteredItems = computed(() => {
    const term = search.value.trim().toLocaleLowerCase('pt-BR')
    return items.value.filter(({ project }) => {
        const matchesSearch = !term || `${project.nome} ${project.descricao}`.toLocaleLowerCase('pt-BR').includes(term)
        const matchesStatus = statusFilter.value === 'TODOS' || project.status === statusFilter.value
        const role = isManager(project) ? 'GERENTE' : 'MEMBRO'
        return matchesSearch && matchesStatus && (roleFilter.value === 'TODOS' || roleFilter.value === role)
    })
})

onMounted(async () => {
    try {
        const projects = await listProjects()
        items.value = await Promise.all(projects.map(async (project) => {
            const [activities, members] = await Promise.all([listProjectActivities(project.id), listProjectMembers(project.id)])
            return {
                project,
                metrics: calculateProjectMetrics(activities),
                team: [
                    { id: project.gerenteId, name: project.gerente?.nome ?? 'Gerente do projeto' },
                    ...members.map((member) => ({ id: member.usuarioId, name: member.usuario.nome })),
                ],
            }
        }))
        await consumeCreateQuery()
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar os projetos.')
    } finally {
        isLoading.value = false
    }
})

watch(() => route.query.novo, async () => { if (!isLoading.value) await consumeCreateQuery() })
</script>

<template>
    <section class="page-stack">
        <PageHeader eyebrow="Workspace" title="Projetos" description="Acompanhe os projetos que você gerencia e aqueles dos quais participa.">
            <template #actions><BaseButton @click="openCreateProject"><template #icon><AppIcon name="plus" :size="17" /></template>Novo projeto</BaseButton></template>
        </PageHeader>

        <LoadingSkeleton v-if="isLoading" variant="cards" :rows="4" />
        <div v-else-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>
        <template v-else>
            <FilterBar v-if="items.length">
                <SearchInput v-model="search" placeholder="Buscar por nome ou descrição" label="Buscar projetos" />
                <template #filters>
                    <label><span class="sr-only">Filtrar por status</span><select v-model="statusFilter"><option value="TODOS">Todos os status</option><option value="PLANEJADO">Planejados</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDO">Concluídos</option></select></label>
                    <label><span class="sr-only">Filtrar por papel</span><select v-model="roleFilter"><option value="TODOS">Todos os papéis</option><option value="GERENTE">Gerenciados por mim</option><option value="MEMBRO">Participo</option></select></label>
                </template>
            </FilterBar>

            <div v-if="filteredItems.length" class="project-grid">
                <BaseCard v-for="item in filteredItems" :key="item.project.id" interactive class="project-card">
                    <div class="card-top">
                        <span class="project-icon"><AppIcon name="projects" :size="19" /></span>
                        <StatusBadge :value="item.project.status" :label="projectStatusLabels[item.project.status]" />
                    </div>
                    <div class="card-copy"><h2>{{ item.project.nome }}</h2><p>{{ item.project.descricao || 'Projeto sem descrição.' }}</p></div>
                    <div class="health-row"><span>Saúde do projeto</span><StatusBadge :label="projectHealth(item).label" :tone="projectHealth(item).tone" /></div>
                    <ProgressIndicator :value="item.metrics.percentualConclusao" :label="`${item.metrics.concluidas} de ${item.metrics.total} concluídas`" size="sm" />
                    <div class="project-meta"><span><AppIcon name="calendar" :size="15" />{{ formatDate(item.project.dataInicio) }} — {{ formatDate(item.project.dataFim) }}</span><span>{{ isManager(item.project) ? 'Você gerencia' : 'Você participa' }}</span></div>
                    <div class="card-footer">
                        <div class="avatar-stack" :aria-label="`${item.team.length} pessoas no projeto`">
                            <UserAvatar v-for="person in item.team.slice(0, 4)" :key="person.id" :name="person.name" size="sm" />
                            <span v-if="item.team.length > 4" class="avatar-more">+{{ item.team.length - 4 }}</span>
                        </div>
                        <router-link class="card-link" :to="{ name: 'project-overview', params: { projectId: item.project.id } }">Abrir projeto <AppIcon name="arrow-right" :size="16" /><span class="sr-only">{{ item.project.nome }}</span></router-link>
                    </div>
                </BaseCard>
            </div>

            <EmptyState v-else-if="items.length" icon="search" title="Nenhum projeto encontrado" description="Ajuste a busca ou os filtros para encontrar outro projeto." />
            <EmptyState v-else icon="projects" title="Nenhum projeto por aqui" description="Crie um projeto para organizar a equipe, distribuir atividades e acompanhar o progresso.">
                <template #actions><BaseButton @click="openCreateProject">Criar primeiro projeto</BaseButton></template>
            </EmptyState>
        </template>

        <AppSheet :open="showCreatePanel" title="Novo projeto" description="Crie o projeto sem sair do contexto do portfólio." @update:open="$event ? (showCreatePanel = true) : closeCreateProject()">
            <form id="project-create-form" class="project-form" novalidate @submit.prevent="handleCreateProject">
                <section class="sheet-section"><div><h2>Informações gerais</h2><p>Identificação e objetivo principal.</p></div><div class="fields"><BaseInput v-model="form.nome" label="Nome do projeto" placeholder="Ex.: Portal do cliente" autocomplete="off" required /><FormField label="Descrição" hint="Descreva o objetivo e o resultado esperado."><template #default="{ id, descriptionId }"><textarea :id="id" v-model="form.descricao" rows="4" :aria-describedby="descriptionId" placeholder="Objetivo, contexto e escopo principal" /></template></FormField></div></section>
                <section class="sheet-section"><div><h2>Planejamento</h2><p>Período e estágio da entrega.</p></div><div class="fields"><div class="form-row"><BaseInput v-model="form.dataInicio" type="date" label="Data de início" required /><BaseInput v-model="form.dataFim" type="date" label="Data de término" required /></div><FormField label="Status"><template #default="{ id }"><select :id="id" v-model="form.status"><option value="PLANEJADO">Planejado</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDO">Concluído</option></select></template></FormField></div></section>
                <div v-if="createError" class="error-banner" role="alert">{{ createError }}</div>
            </form>
            <template #footer><BaseButton variant="secondary" @click="closeCreateProject">Cancelar</BaseButton><BaseButton type="submit" form="project-create-form" :loading="isSaving">Criar projeto</BaseButton></template>
        </AppSheet>
    </section>
</template>

<style scoped>
.project-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); }
.project-card { position: relative; display: grid; min-height: 390px; align-content: start; gap: var(--space-4); }
.card-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.project-icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: var(--radius-md); background: var(--color-primary-soft); color: var(--color-primary); }
.card-copy { min-height: 68px; }
.card-copy h2 { font-size: 1rem; }
.card-copy p { display: -webkit-box; margin-top: var(--space-2); overflow: hidden; color: var(--color-text-secondary); font-size: var(--font-size-small); -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.health-row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); color: var(--color-text-muted); font-size: var(--font-size-caption); }
.project-meta { display: grid; gap: var(--space-2); padding-top: var(--space-4); border-top: 1px solid var(--color-divider); color: var(--color-text-muted); font-size: var(--font-size-caption); }
.project-meta span { display: flex; align-items: center; gap: var(--space-2); }
.card-footer { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-top: auto; padding-top: var(--space-1); }
.avatar-stack { display: flex; align-items: center; padding-left: 8px; }
.avatar-stack :deep(.avatar), .avatar-more { margin-left: -8px; border: 2px solid var(--color-surface); box-shadow: 0 2px 6px rgba(24, 32, 51, .08); }
.avatar-more { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 50%; background: var(--color-surface-subtle); color: var(--color-text-secondary); font-size: .62rem; font-weight: var(--font-weight-bold); }
.card-link { display: inline-flex; align-items: center; gap: var(--space-1); width: fit-content; color: var(--color-primary); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }
.card-link::after { position: absolute; content: ''; inset: 0; }
.project-form { display: grid; gap: var(--space-6); }
.sheet-section { display: grid; gap: var(--space-4); padding-bottom: var(--space-6); border-bottom: 1px solid var(--color-divider); }
.sheet-section:last-of-type { padding-bottom: 0; border-bottom: 0; }
.sheet-section h2 { font-size: var(--font-size-section-title); }
.sheet-section > div:first-child p { margin-top: 3px; color: var(--color-text-secondary); font-size: var(--font-size-small); }
.fields { display: grid; gap: var(--space-5); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
@media (max-width: 1120px) { .project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .project-grid { grid-template-columns: 1fr; } .project-card { min-height: auto; } .form-row { grid-template-columns: 1fr; } }
</style>
