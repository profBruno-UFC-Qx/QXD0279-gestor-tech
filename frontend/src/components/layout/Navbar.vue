<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppIcon from '@/components/ui/AppIcon.vue'
import UserMenu from './UserMenu.vue'

const route = useRoute()
const title = computed(() => String(route.meta.title ?? 'Gestor Tech'))
const breadcrumbs = computed(() => {
    const items = route.meta.breadcrumbs
    return Array.isArray(items) ? items.map(String) : ['Gestor Tech', title.value]
})

const contextualAction = computed(() => {
    if (route.name === 'projects') return { label: 'Novo projeto', name: 'projects', params: {}, query: { novo: '1' } }
    if (route.name === 'project-activities' && route.params.projectId) {
        return { label: 'Nova atividade', name: 'project-activities', params: { projectId: route.params.projectId }, query: { nova: '1' } }
    }
    return null
})
</script>

<template>
    <header class="navbar">
        <div class="mobile-brand"><img src="/Logo%20Gestor%20Tech%20com%20Foguete%20Branco.png" alt="Gestor Tech"></div>
        <nav class="breadcrumbs" aria-label="Breadcrumb">
            <template v-for="(item, index) in breadcrumbs" :key="`${item}-${index}`">
                <AppIcon v-if="index" name="chevron-right" :size="14" />
                <span :class="{ current: index === breadcrumbs.length - 1 }">{{ item }}</span>
            </template>
        </nav>

        <div class="actions">
            <router-link v-if="contextualAction" class="contextual-action" :to="contextualAction">
                <AppIcon name="plus" :size="17" />
                <span>{{ contextualAction.label }}</span>
            </router-link>
            <div class="mobile-user"><UserMenu compact /></div>
        </div>
    </header>
</template>

<style scoped>
.navbar { position: sticky; top: 0; z-index: 20; display: flex; min-height: var(--topbar-height); align-items: center; justify-content: space-between; gap: var(--space-4); padding: 0 clamp(20px, 3vw, 36px); border-bottom: 1px solid var(--color-border); background: var(--color-navbar); backdrop-filter: blur(12px); }
.breadcrumbs { display: flex; min-width: 0; align-items: center; gap: var(--space-2); color: var(--color-text-muted); font-size: var(--font-size-small); }
.breadcrumbs svg { flex: 0 0 auto; }
.breadcrumbs span { overflow: hidden; max-width: 260px; text-overflow: ellipsis; white-space: nowrap; }
.breadcrumbs .current { color: var(--color-foreground); font-weight: var(--font-weight-semibold); }
.actions { display: flex; align-items: center; gap: var(--space-3); }
.contextual-action { display: inline-flex; min-height: 38px; align-items: center; gap: var(--space-2); padding: 8px 13px; border-radius: var(--radius-md); background: var(--color-primary); color: var(--color-white); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); transition: var(--transition-colors), transform var(--duration-fast) var(--ease-standard); }
.contextual-action:hover { background: var(--color-primary-hover); }
.contextual-action:active { transform: translateY(1px); }
.mobile-brand, .mobile-user { display: none; }

@media (max-width: 680px) {
    .navbar { min-height: 60px; padding-inline: var(--space-4); }
    .breadcrumbs { display: none; }
    .mobile-brand { display: flex; align-items: center; padding: 4px 8px; border-radius: var(--radius-sm); background: var(--color-sidebar); }
    .mobile-brand img { display: block; width: 120px; height: auto; }
    .mobile-user { display: block; }
    .contextual-action span { display: none; }
    .contextual-action { width: 38px; padding: 0; justify-content: center; }
}
</style>
