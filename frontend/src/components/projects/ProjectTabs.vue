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
.tabs { display: flex; gap: var(--space-6); overflow-x: auto; border-bottom: 1px solid var(--color-border); scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tabs a { position: relative; display: inline-flex; min-height: 44px; align-items: center; gap: var(--space-2); padding: 8px 1px 12px; color: var(--color-text-secondary); font-size: var(--font-size-small); font-weight: var(--font-weight-medium); white-space: nowrap; transition: var(--transition-colors); }
.tabs a::after { position: absolute; right: 0; bottom: -1px; left: 0; height: 2px; border-radius: var(--radius-pill) var(--radius-pill) 0 0; background: transparent; content: ''; }
.tabs a:hover { color: var(--color-foreground); }
.tabs a.router-link-exact-active { color: var(--color-primary); font-weight: var(--font-weight-semibold); }
.tabs a.router-link-exact-active::after { background: var(--color-primary); }
</style>
