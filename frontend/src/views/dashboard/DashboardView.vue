<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import ActivityDistributionChart, { type DistributionItem } from '@/components/dashboard/ActivityDistributionChart.vue'
import DashboardActivityList from '@/components/dashboard/DashboardActivityList.vue'
import DashboardDeadlines from '@/components/dashboard/DashboardDeadlines.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardTeam from '@/components/dashboard/DashboardTeam.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import ProgressIndicator from '@/components/ui/ProgressIndicator.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { calculateProjectMetrics, listProjectActivities } from '@/services/activity'
import { getErrorMessage } from '@/services/errors'
import { listProjectMembers } from '@/services/member'
import { listProjects } from '@/services/project'
import { useAuthStore } from '@/stores/auth.store'
import type { Activity, ProjectMetrics } from '@/types/Activity'
import type { Project } from '@/types/Project'
import type { ProjectMember } from '@/types/ProjectMember'
import { compareByDeadline } from '@/utils/activities'
import { projectStatusLabels } from '@/utils/labels'

const authStore = useAuthStore()
const projects = ref<Project[]>([])
const selectedProjectId = ref<number | null>(null)
const activities = ref<Activity[]>([])
const members = ref<ProjectMember[]>([])
const isLoading = ref(true)
const isProjectLoading = ref(false)
const errorMessage = ref('')

const emptyMetrics: ProjectMetrics = { total: 0, concluidas: 0, pendentes: 0, atrasadas: 0, percentualConclusao: 0 }
const project = computed(() => projects.value.find((item) => item.id === selectedProjectId.value) ?? null)
const metrics = computed(() => activities.value.length ? calculateProjectMetrics(activities.value) : emptyMetrics)
const canManage = computed(() => project.value?.gerenteId === authStore.user?.id || project.value?.papelAtual === 'GERENTE')

const statusDistribution = computed<DistributionItem[]>(() => [
    { label: 'A fazer', value: activities.value.filter((item) => item.status === 'A_FAZER').length, color: 'var(--color-text-muted)' },
    { label: 'Em andamento', value: activities.value.filter((item) => item.status === 'EM_ANDAMENTO').length, color: 'var(--color-primary)' },
    { label: 'Concluídas', value: activities.value.filter((item) => item.status === 'CONCLUIDA').length, color: 'var(--color-success)' },
])

const priorityDistribution = computed<DistributionItem[]>(() => [
    { label: 'Baixa', value: activities.value.filter((item) => item.prioridade === 'BAIXA').length, color: 'var(--color-success)' },
    { label: 'Média', value: activities.value.filter((item) => item.prioridade === 'MEDIA').length, color: 'var(--color-warning)' },
    { label: 'Alta', value: activities.value.filter((item) => item.prioridade === 'ALTA').length, color: 'var(--color-danger)' },
])

const relevantActivities = computed(() => [...activities.value]
    .filter((item) => item.status !== 'CONCLUIDA')
    .sort(compareByDeadline)
    .slice(0, 6))

async function loadProjectData(projectId: number): Promise<void> {
    isProjectLoading.value = true
    errorMessage.value = ''
    try {
        const [activityData, memberData] = await Promise.all([listProjectActivities(projectId), listProjectMembers(projectId)])
        activities.value = activityData
        members.value = memberData
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar os dados do projeto.')
    } finally {
        isProjectLoading.value = false
    }
}

async function handleProjectChange(event: Event): Promise<void> {
    const id = Number((event.target as HTMLSelectElement).value)
    selectedProjectId.value = id
    await loadProjectData(id)
}

onMounted(async () => {
    try {
        projects.value = await listProjects()
        const firstProject = projects.value[0]
        if (firstProject) {
            selectedProjectId.value = firstProject.id
            await loadProjectData(firstProject.id)
        }
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar o dashboard.')
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <section class="dashboard-page page-stack">
        <LoadingSkeleton v-if="isLoading" variant="cards" :rows="5" />
        <EmptyState v-else-if="!projects.length" icon="projects" title="Seu dashboard começa com um projeto" description="Crie o primeiro projeto para acompanhar atividades, prazos e progresso.">
            <template #actions><router-link class="primary-link" :to="{ name: 'project-create' }">Criar projeto</router-link></template>
        </EmptyState>
        <template v-else-if="project">
            <PageHeader eyebrow="Visão geral" :title="project.nome" description="Acompanhe o ritmo da equipe e os principais sinais da entrega.">
                <template #actions>
                    <label class="project-selector"><span class="sr-only">Projeto ativo</span><select :value="selectedProjectId" @change="handleProjectChange"><option v-for="item in projects" :key="item.id" :value="item.id">{{ item.nome }}</option></select></label>
                </template>
            </PageHeader>

            <div class="project-summary">
                <div><StatusBadge :value="project.status" :label="projectStatusLabels[project.status]" /><span>{{ members.length + 1 }} {{ members.length ? 'pessoas' : 'pessoa' }}</span></div>
                <ProgressIndicator :value="metrics.percentualConclusao" label="Progresso geral" />
            </div>

            <div v-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>
            <LoadingSkeleton v-if="isProjectLoading" variant="cards" :rows="5" />
            <template v-else>
                <DashboardStats :metrics="metrics" />
                <div class="charts-grid">
                    <ActivityDistributionChart title="Distribuição por status" description="Atraso é tratado como condição de prazo." :items="statusDistribution" />
                    <ActivityDistributionChart title="Distribuição por prioridade" description="Concentração das tarefas por nível." :items="priorityDistribution" />
                    <DashboardDeadlines :activities="relevantActivities.slice(0, 5)" :project-id="project.id" />
                </div>
                <div class="dashboard-content">
                    <DashboardActivityList :activities="relevantActivities" :project-id="project.id" />
                    <DashboardTeam :project="project" :members="members" :can-manage="canManage" />
                </div>
            </template>
        </template>
    </section>
</template>

<style scoped>
.project-selector select { min-width: 220px; max-width: 320px; }
.project-summary { display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 420px); align-items: center; gap: var(--space-6); padding: var(--space-4) var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
.project-summary > div:first-child { display: flex; align-items: center; gap: var(--space-3); color: var(--color-text-secondary); font-size: var(--font-size-small); }
.charts-grid { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, .85fr) minmax(320px, 1.3fr); gap: var(--space-4); }
.dashboard-content { display: grid; align-items: start; grid-template-columns: minmax(0, 1fr) 290px; gap: var(--space-4); }
.primary-link { display: inline-flex; min-height: var(--control-height); align-items: center; padding: 10px 16px; border-radius: var(--radius-md); background: var(--color-primary); color: var(--color-white); font-weight: var(--font-weight-semibold); }
@media (max-width: 1240px) { .charts-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .charts-grid > :last-child { grid-column: 1 / -1; } }
@media (max-width: 1040px) { .dashboard-content { grid-template-columns: 1fr; } }
@media (max-width: 760px) { .project-summary { grid-template-columns: 1fr; } .charts-grid { grid-template-columns: 1fr; } .charts-grid > :last-child { grid-column: auto; } .project-selector, .project-selector select { width: 100%; max-width: none; } }
</style>
