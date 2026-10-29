<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import ProjectTabs from '@/components/projects/ProjectTabs.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import ProgressIndicator from '@/components/ui/ProgressIndicator.vue'
import StatCard from '@/components/ui/StatCard.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { calculateProjectMetrics, listProjectActivities } from '@/services/activity'
import { getErrorMessage } from '@/services/errors'
import { getProject } from '@/services/project'
import { useAuthStore } from '@/stores/auth.store'
import type { ProjectMetrics } from '@/types/Activity'
import type { Project } from '@/types/Project'
import { formatDate, projectStatusLabels } from '@/utils/labels'

const route = useRoute()
const authStore = useAuthStore()
const projectId = Number(route.params.projectId)
const project = ref<Project | null>(null)
const metrics = ref<ProjectMetrics | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')
const canManage = computed(() => project.value?.gerenteId === authStore.user?.id || project.value?.papelAtual === 'GERENTE')

onMounted(async () => {
    try {
        const [projectData, activities] = await Promise.all([getProject(projectId), listProjectActivities(projectId)])
        project.value = projectData
        metrics.value = calculateProjectMetrics(activities)
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar o projeto.')
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <section class="page-stack">
        <LoadingSkeleton v-if="isLoading" />
        <EmptyState v-else-if="!project || !metrics" icon="alert-triangle" title="Projeto indisponível" :description="errorMessage || 'Este projeto não foi encontrado.'">
            <template #actions><router-link class="secondary-link" :to="{ name: 'projects' }">Voltar aos projetos</router-link></template>
        </EmptyState>
        <template v-else>
            <PageHeader eyebrow="Projeto" :title="project.nome" :description="project.descricao || 'Projeto sem descrição.'">
                <template v-if="canManage" #actions><router-link class="secondary-link" :to="{ name: 'project-edit', params: { projectId } }"><AppIcon name="pencil" :size="16" />Editar projeto</router-link></template>
            </PageHeader>
            <ProjectTabs :project-id="projectId" />

            <BaseCard class="overview-card">
                <div class="overview-main"><div><span class="label">Progresso do projeto</span><strong>{{ metrics.percentualConclusao }}%</strong><p>Calculado a partir das atividades concluídas.</p></div><ProgressIndicator :value="metrics.percentualConclusao" :show-value="false" /></div>
                <dl class="project-details">
                    <div><dt>Status</dt><dd><StatusBadge :value="project.status" :label="projectStatusLabels[project.status]" /></dd></div>
                    <div><dt>Período</dt><dd>{{ formatDate(project.dataInicio) }} — {{ formatDate(project.dataFim) }}</dd></div>
                    <div><dt>Gerente</dt><dd>{{ project.gerente?.nome ?? 'Não informado' }}</dd></div>
                    <div><dt>Seu papel</dt><dd>{{ canManage ? 'Gerente' : 'Membro' }}</dd></div>
                </dl>
            </BaseCard>

            <div class="metrics-grid">
                <StatCard label="Total" :value="metrics.total" detail="Atividades cadastradas" icon="activities" />
                <StatCard label="Concluídas" :value="metrics.concluidas" detail="Entregas finalizadas" icon="check-circle" tone="success" />
                <StatCard label="Pendentes" :value="metrics.pendentes" detail="A fazer ou em andamento" icon="clock" tone="primary" />
                <StatCard label="Atrasadas" :value="metrics.atrasadas" detail="Prazo vencido" icon="warning" :tone="metrics.atrasadas ? 'danger' : 'neutral'" />
            </div>
        </template>
    </section>
</template>

<style scoped>
.secondary-link { display: inline-flex; min-height: var(--control-height); align-items: center; justify-content: center; gap: var(--space-2); padding: 9px 14px; border: 1px solid var(--color-border-strong); border-radius: var(--radius-md); background: var(--color-surface); color: var(--color-foreground); font-weight: var(--font-weight-semibold); transition: var(--transition-colors); }
.secondary-link:hover { background: var(--color-surface-subtle); }
.overview-card { display: grid; grid-template-columns: minmax(260px, .8fr) minmax(0, 1.2fr); gap: var(--space-8); }
.overview-main { display: grid; align-content: center; gap: var(--space-5); }
.overview-main .label { color: var(--color-text-secondary); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }
.overview-main strong { display: block; margin-top: var(--space-2); color: var(--color-primary); font-family: var(--font-heading); font-size: clamp(2.2rem, 5vw, 3.2rem); line-height: 1; }
.overview-main p { margin-top: var(--space-2); color: var(--color-text-muted); font-size: var(--font-size-caption); }
.project-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border: 1px solid var(--color-divider); border-radius: var(--radius-md); background: var(--color-surface-subtle); }
.project-details > div { display: grid; align-content: center; gap: var(--space-2); min-height: 92px; padding: var(--space-4); }
.project-details > div:nth-child(odd) { border-right: 1px solid var(--color-divider); }
.project-details > div:nth-child(-n+2) { border-bottom: 1px solid var(--color-divider); }
dt { color: var(--color-text-muted); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); text-transform: uppercase; }
dd { color: var(--color-foreground); font-weight: var(--font-weight-medium); }
.metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }
@media (max-width: 820px) { .overview-card { grid-template-columns: 1fr; } .metrics-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .metrics-grid, .project-details { grid-template-columns: 1fr; } .project-details > div { border-right: 0 !important; border-bottom: 1px solid var(--color-divider); } .project-details > div:last-child { border-bottom: 0; } }
</style>
