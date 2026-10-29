<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import FilterBar from '@/components/ui/FilterBar.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import ProgressIndicator from '@/components/ui/ProgressIndicator.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { calculateProjectMetrics, listProjectActivities } from '@/services/activity'
import { getErrorMessage } from '@/services/errors'
import { listProjects } from '@/services/project'
import { useAuthStore } from '@/stores/auth.store'
import type { ProjectMetrics } from '@/types/Activity'
import type { Project, ProjectStatus } from '@/types/Project'
import { formatDate, projectStatusLabels } from '@/utils/labels'

interface ProjectListItem { project: Project; metrics: ProjectMetrics }

const authStore = useAuthStore()
const items = ref<ProjectListItem[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const search = ref('')
const statusFilter = ref<'TODOS' | ProjectStatus>('TODOS')
const roleFilter = ref<'TODOS' | 'GERENTE' | 'MEMBRO'>('TODOS')

function isManager(project: Project): boolean {
    return project.gerenteId === authStore.user?.id || project.papelAtual === 'GERENTE'
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
        items.value = await Promise.all(projects.map(async (project) => ({
            project,
            metrics: calculateProjectMetrics(await listProjectActivities(project.id)),
        })))
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar os projetos.')
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <section class="page-stack">
        <PageHeader eyebrow="Workspace" title="Projetos" description="Acompanhe os projetos que você gerencia e aqueles dos quais participa.">
            <template #actions><router-link class="primary-link" :to="{ name: 'project-create' }"><AppIcon name="plus" :size="17" />Novo projeto</router-link></template>
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
                <BaseCard v-for="{ project, metrics } in filteredItems" :key="project.id" interactive class="project-card">
                    <div class="card-top">
                        <span class="project-icon"><AppIcon name="projects" :size="19" /></span>
                        <StatusBadge :value="project.status" :label="projectStatusLabels[project.status]" />
                    </div>
                    <div class="card-copy"><h2>{{ project.nome }}</h2><p>{{ project.descricao || 'Projeto sem descrição.' }}</p></div>
                    <ProgressIndicator :value="metrics.percentualConclusao" :label="`${metrics.concluidas} de ${metrics.total} concluídas`" size="sm" />
                    <div class="project-meta"><span><AppIcon name="calendar" :size="15" />{{ formatDate(project.dataInicio) }} — {{ formatDate(project.dataFim) }}</span><span>{{ isManager(project) ? 'Você gerencia' : 'Você participa' }}</span></div>
                    <router-link class="card-link" :to="{ name: 'project-overview', params: { projectId: project.id } }">Abrir projeto <AppIcon name="arrow-right" :size="16" /><span class="sr-only">{{ project.nome }}</span></router-link>
                </BaseCard>
            </div>

            <EmptyState v-else-if="items.length" icon="search" title="Nenhum projeto encontrado" description="Ajuste a busca ou os filtros para encontrar outro projeto." />
            <EmptyState v-else icon="projects" title="Nenhum projeto por aqui" description="Crie um projeto para organizar a equipe, distribuir atividades e acompanhar o progresso.">
                <template #actions><router-link class="primary-link" :to="{ name: 'project-create' }">Criar primeiro projeto</router-link></template>
            </EmptyState>
        </template>
    </section>
</template>

<style scoped>
.primary-link { display: inline-flex; min-height: var(--control-height); align-items: center; justify-content: center; gap: var(--space-2); padding: 10px 16px; border-radius: var(--radius-md); background: var(--color-primary); color: var(--color-white); font-weight: var(--font-weight-semibold); transition: var(--transition-colors); }
.primary-link:hover { background: var(--color-primary-hover); }
.project-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-4); }
.project-card { position: relative; display: grid; min-height: 320px; align-content: start; gap: var(--space-5); }
.card-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.project-icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: var(--radius-md); background: var(--color-primary-soft); color: var(--color-primary); }
.card-copy { min-height: 76px; }
.card-copy h2 { font-size: 1rem; }
.card-copy p { display: -webkit-box; margin-top: var(--space-2); overflow: hidden; color: var(--color-text-secondary); font-size: var(--font-size-small); -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.project-meta { display: grid; gap: var(--space-2); padding-top: var(--space-4); border-top: 1px solid var(--color-divider); color: var(--color-text-muted); font-size: var(--font-size-caption); }
.project-meta span { display: flex; align-items: center; gap: var(--space-2); }
.card-link { display: inline-flex; align-items: center; gap: var(--space-1); width: fit-content; margin-top: auto; color: var(--color-primary); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }
.card-link::after { position: absolute; content: ''; inset: 0; }
@media (max-width: 1120px) { .project-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .project-grid { grid-template-columns: 1fr; } .project-card { min-height: auto; } }
</style>
