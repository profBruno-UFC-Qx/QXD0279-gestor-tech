<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from '@/components/ui/AppIcon.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import type { Project } from '@/types/Project'
import type { ProjectMember } from '@/types/ProjectMember'

const props = defineProps<{ project: Project; members: ProjectMember[]; canManage: boolean }>()

const people = computed(() => [
    { id: `manager-${props.project.gerenteId}`, name: props.project.gerente?.nome ?? 'Gerente do projeto', email: '', role: 'Gerente' },
    ...props.members.map((member) => ({ id: `member-${member.id}`, name: member.usuario.nome, email: member.usuario.email, role: 'Membro' })),
])
</script>

<template>
    <aside class="team-card">
        <SectionHeader title="Equipe" :description="`${people.length} ${people.length === 1 ? 'pessoa' : 'pessoas'} no projeto`">
            <template v-if="canManage" #actions><router-link class="icon-link" :to="{ name: 'project-team', params: { projectId: project.id } }" aria-label="Gerenciar equipe"><AppIcon name="user-plus" :size="17" /></router-link></template>
        </SectionHeader>
        <ul v-if="people.length" class="people-list">
            <li v-for="person in people.slice(0, 5)" :key="person.id"><UserAvatar :name="person.name" /><div><strong>{{ person.name }}</strong><span>{{ person.role }}</span></div></li>
        </ul>
        <EmptyState v-else compact icon="team" title="Equipe vazia" description="Adicione membros para distribuir atividades." />
        <router-link class="team-link" :to="{ name: 'project-team', params: { projectId: project.id } }">Ver equipe completa <AppIcon name="arrow-right" :size="15" /></router-link>
    </aside>
</template>

<style scoped>
.team-card { display: grid; align-content: start; gap: var(--space-4); padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-xs); }
.icon-link { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-primary); transition: var(--transition-colors); }
.icon-link:hover { border-color: var(--color-primary-border); background: var(--color-primary-soft); }
.people-list { display: grid; }
.people-list li { display: flex; align-items: center; gap: var(--space-3); padding: 11px 0; border-top: 1px solid var(--color-divider); }
.people-list li div { display: grid; min-width: 0; }
.people-list strong { overflow: hidden; font-size: var(--font-size-small); text-overflow: ellipsis; white-space: nowrap; }
.people-list span { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.team-link { display: inline-flex; align-items: center; gap: var(--space-1); color: var(--color-primary); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }
</style>
