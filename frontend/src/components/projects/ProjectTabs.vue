<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps<{ projectId: number }>()

const tabs = [
    { label: 'Visão geral', name: 'project-overview', icon: 'dashboard' as const },
    { label: 'Equipe', name: 'project-team', icon: 'team' as const },
    { label: 'Atividades', name: 'project-activities', icon: 'activities' as const },
]
</script>

<template>
    <nav class="tabs" aria-label="Seções do projeto">
        <router-link v-for="tab in tabs" :key="tab.name" :to="{ name: tab.name, params: { projectId } }">
            <AppIcon :name="tab.icon" :size="16" />{{ tab.label }}
        </router-link>
    </nav>
</template>

<style scoped>
.tabs { display: flex; gap: var(--space-1); overflow-x: auto; padding: 4px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface-subtle); scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tabs a { display: inline-flex; min-height: 38px; align-items: center; gap: var(--space-2); padding: 8px 13px; border-radius: var(--radius-md); color: var(--color-text-secondary); font-size: var(--font-size-small); font-weight: var(--font-weight-medium); white-space: nowrap; transition: var(--transition-colors), box-shadow var(--duration-fast) var(--ease-standard); }
.tabs a:hover { color: var(--color-foreground); }
.tabs a.router-link-exact-active { background: var(--color-surface); box-shadow: var(--shadow-sm); color: var(--color-primary); font-weight: var(--font-weight-semibold); }
</style>
