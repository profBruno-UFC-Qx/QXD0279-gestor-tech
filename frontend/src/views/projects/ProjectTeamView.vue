<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

import ProjectTabs from '@/components/projects/ProjectTabs.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { getErrorMessage } from '@/services/errors'
import { addProjectMember, listProjectMembers, removeProjectMember } from '@/services/member'
import { getProject } from '@/services/project'
import { useAuthStore } from '@/stores/auth.store'
import type { Project } from '@/types/Project'
import type { ProjectMember } from '@/types/ProjectMember'

const route = useRoute()
const authStore = useAuthStore()
const projectId = Number(route.params.projectId)
const project = ref<Project | null>(null)
const members = ref<ProjectMember[]>([])
const email = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const isRemoving = ref(false)
const errorMessage = ref('')
const memberToRemove = ref<ProjectMember | null>(null)
const canManage = computed(() => project.value?.gerenteId === authStore.user?.id || project.value?.papelAtual === 'GERENTE')

onMounted(async () => {
    try {
        const [projectData, memberData] = await Promise.all([getProject(projectId), listProjectMembers(projectId)])
        project.value = projectData
        members.value = memberData
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível carregar a equipe.')
    } finally {
        isLoading.value = false
    }
})

async function handleAddMember(): Promise<void> {
    const normalizedEmail = email.value.trim()
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        errorMessage.value = 'Informe um e-mail válido.'
        return
    }
    isSaving.value = true
    errorMessage.value = ''
    try {
        const member = await addProjectMember(projectId, normalizedEmail)
        members.value.push(member)
        email.value = ''
        toast.success('Membro adicionado', { description: `${member.usuario.nome} agora participa do projeto.` })
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível adicionar o membro.')
        toast.error('Não foi possível adicionar o membro')
    } finally {
        isSaving.value = false
    }
}

async function confirmRemoveMember(): Promise<void> {
    if (!memberToRemove.value) return
    isRemoving.value = true
    try {
        const removed = memberToRemove.value
        await removeProjectMember(projectId, removed.id)
        members.value = members.value.filter((item) => item.id !== removed.id)
        memberToRemove.value = null
        toast.success('Membro removido', { description: `${removed.usuario.nome} foi removido da equipe.` })
    } catch (error: unknown) {
        errorMessage.value = getErrorMessage(error, 'Não foi possível remover o membro.')
        toast.error('Não foi possível remover o membro')
    } finally {
        isRemoving.value = false
    }
}
</script>

<template>
    <section class="page-stack">
        <LoadingSkeleton v-if="isLoading" />
        <template v-else-if="project">
            <PageHeader eyebrow="Projeto" :title="project.nome" description="Gerencie as pessoas que participam desta entrega." />
            <ProjectTabs :project-id="projectId" />

            <BaseCard v-if="canManage" class="invite-card">
                <div class="invite-copy"><span class="invite-icon"><AppIcon name="user-plus" :size="20" /></span><div><h2>Adicionar membro</h2><p>Informe o e-mail de uma pessoa cadastrada para incluí-la no projeto.</p></div></div>
                <form @submit.prevent="handleAddMember"><BaseInput v-model="email" type="email" label="E-mail do membro" placeholder="membro@exemplo.com" autocomplete="email" required /><BaseButton type="submit" :loading="isSaving">Adicionar</BaseButton></form>
            </BaseCard>

            <div v-if="errorMessage" class="error-banner" role="alert">{{ errorMessage }}</div>

            <section class="team-section">
                <div class="section-heading"><div><h2>Equipe do projeto</h2><p>{{ members.length + 1 }} {{ members.length ? 'pessoas' : 'pessoa' }} com acesso</p></div></div>
                <div class="member-grid">
                    <article class="member-card manager-card"><UserAvatar :name="project.gerente?.nome ?? 'Gerente do projeto'" size="lg" /><div class="member-data"><strong>{{ project.gerente?.nome ?? 'Gerente do projeto' }}</strong><span>Responsável pelo projeto</span></div><StatusBadge label="Gerente" tone="primary" /></article>
                    <article v-for="member in members" :key="member.id" class="member-card"><UserAvatar :name="member.usuario.nome" size="lg" /><div class="member-data"><strong>{{ member.usuario.nome }}</strong><span>{{ member.usuario.email }}</span></div><div class="member-actions"><StatusBadge label="Membro" tone="neutral" /><BaseButton v-if="canManage" variant="ghost" size="sm" :aria-label="`Remover ${member.usuario.nome}`" @click="memberToRemove = member"><template #icon><AppIcon name="trash" :size="16" /></template><span class="remove-label">Remover</span></BaseButton></div></article>
                </div>
                <EmptyState v-if="!members.length" compact icon="team" title="Ainda não há outros membros" description="Adicione pessoas para distribuir as atividades do projeto." />
            </section>
        </template>
        <EmptyState v-else icon="alert-triangle" title="Equipe indisponível" :description="errorMessage || 'Não foi possível encontrar este projeto.'" />

        <ConfirmDialog :open="Boolean(memberToRemove)" title="Remover membro da equipe?" :description="memberToRemove ? `${memberToRemove.usuario.nome} perderá o acesso ao projeto e ficará sem atribuição nas atividades atuais.` : ''" confirm-label="Remover membro" danger :busy="isRemoving" @update:open="!$event && (memberToRemove = null)" @confirm="confirmRemoveMember" />
    </section>
</template>

<style scoped>
.invite-card { display: grid; grid-template-columns: minmax(240px, .8fr) minmax(360px, 1.2fr); align-items: end; gap: var(--space-8); }
.invite-copy { display: flex; align-items: flex-start; gap: var(--space-3); }
.invite-icon { display: grid; width: 42px; height: 42px; place-items: center; flex: 0 0 auto; border-radius: var(--radius-md); background: var(--color-primary-soft); color: var(--color-primary); }
.invite-copy h2, .section-heading h2 { font-size: var(--font-size-section-title); }
.invite-copy p, .section-heading p { margin-top: 3px; color: var(--color-text-secondary); font-size: var(--font-size-small); }
.invite-card form { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: var(--space-3); }
.team-section { display: grid; gap: var(--space-4); }
.member-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
.member-card { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: var(--space-3); padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-xs); }
.manager-card { border-color: var(--color-primary-border); background: var(--color-primary-subtle); }
.member-data { display: grid; min-width: 0; }
.member-data strong, .member-data span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.member-data strong { color: var(--color-foreground); font-size: var(--font-size-body); }
.member-data span { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.member-actions { display: flex; align-items: center; gap: var(--space-2); }
.member-actions :deep(.button--ghost) { color: var(--color-danger); }
@media (max-width: 900px) { .invite-card { grid-template-columns: 1fr; gap: var(--space-5); } }
@media (max-width: 760px) { .member-grid { grid-template-columns: 1fr; } }
@media (max-width: 540px) { .invite-card form { grid-template-columns: 1fr; } .member-card { grid-template-columns: auto minmax(0, 1fr); } .member-actions { grid-column: 2; flex-wrap: wrap; } .remove-label { display: none; } }
</style>
