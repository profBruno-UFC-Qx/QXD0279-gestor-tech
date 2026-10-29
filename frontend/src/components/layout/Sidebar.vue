<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppIcon from '@/components/ui/AppIcon.vue'
import type { IconName } from '@/types/Ui'
import UserMenu from './UserMenu.vue'

const route = useRoute()

const menuItems: Array<{ label: string; icon: IconName; name: string }> = [
    { label: 'Dashboard', icon: 'dashboard', name: 'dashboard' },
    { label: 'Projetos', icon: 'projects', name: 'projects' },
    { label: 'Minhas atividades', icon: 'activities', name: 'my-activities' },
]

const currentName = computed(() => String(route.name ?? ''))

function isActive(name: string): boolean {
    if (name === 'projects') return currentName.value.startsWith('project')
    return currentName.value === name
}
</script>

<template>
    <aside class="sidebar">
        <router-link :to="{ name: 'dashboard' }" class="brand" aria-label="Gestor Tech — Dashboard">
            <span class="brand-mark"><span /><span /><span /></span>
            <span class="brand-name">Gestor <strong>Tech</strong></span>
        </router-link>

        <div class="workspace-label">Workspace</div>
        <nav class="menu" aria-label="Navegação principal">
            <router-link
                v-for="item in menuItems"
                :key="item.name"
                :to="{ name: item.name }"
                class="menu-item"
                :class="{ 'menu-item--active': isActive(item.name) }"
                :aria-current="isActive(item.name) ? 'page' : undefined"
                :title="item.label"
            >
                <AppIcon :name="item.icon" :size="19" />
                <span>{{ item.label }}</span>
            </router-link>
        </nav>

        <div class="sidebar-footer"><UserMenu /></div>
    </aside>
</template>

<style scoped>
.sidebar { position: sticky; top: 0; z-index: 30; display: flex; width: var(--sidebar-width); height: 100vh; flex-direction: column; padding: var(--space-6) var(--space-4) var(--space-4); border-right: 1px solid var(--color-border); background: var(--color-surface); }
.brand { display: flex; min-height: 40px; align-items: center; gap: var(--space-3); padding-inline: var(--space-2); margin-bottom: var(--space-8); color: var(--color-foreground); font-family: var(--font-heading); font-size: 1.0625rem; font-weight: var(--font-weight-semibold); letter-spacing: -0.03em; }
.brand strong { color: var(--color-primary); }
.brand-mark { display: flex; width: 34px; height: 34px; align-items: flex-end; justify-content: center; gap: 3px; padding: 8px; border-radius: var(--radius-md); background: var(--color-primary); box-shadow: var(--shadow-primary-md); }
.brand-mark span { width: 3px; border-radius: 4px; background: var(--color-white); }
.brand-mark span:nth-child(1) { height: 8px; opacity: 0.75; }
.brand-mark span:nth-child(2) { height: 17px; }
.brand-mark span:nth-child(3) { height: 12px; opacity: 0.85; }
.workspace-label { padding: 0 var(--space-3) var(--space-2); color: var(--color-text-muted); font-size: 0.65rem; font-weight: var(--font-weight-bold); letter-spacing: 0.09em; text-transform: uppercase; }
.menu { display: grid; gap: var(--space-1); }
.menu-item { position: relative; display: flex; min-height: 44px; align-items: center; gap: var(--space-3); padding: 10px 12px; border-radius: var(--radius-md); color: var(--color-text-secondary); font-size: var(--font-size-small); font-weight: var(--font-weight-medium); transition: var(--transition-colors), transform var(--duration-fast) var(--ease-standard); }
.menu-item:hover { background: var(--color-surface-subtle); color: var(--color-foreground); }
.menu-item--active { background: var(--color-primary-soft); color: var(--color-primary); font-weight: var(--font-weight-semibold); }
.menu-item--active:hover { background: var(--color-primary-soft-hover); color: var(--color-primary); }
.sidebar-note { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-3); margin-top: auto; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface-subtle); }
.note-icon { display: grid; width: 30px; height: 30px; place-items: center; flex: 0 0 auto; border-radius: var(--radius-sm); background: var(--color-primary-soft); color: var(--color-primary); }
.sidebar-note div { display: grid; min-width: 0; }
.sidebar-note strong { font-size: 0.6875rem; }
.sidebar-note span:not(.note-icon) { color: var(--color-text-muted); font-size: 0.625rem; }
.sidebar-footer { padding-top: var(--space-3); margin-top: var(--space-3); border-top: 1px solid var(--color-divider); }

@media (max-width: 1024px) {
    .sidebar { width: var(--sidebar-collapsed-width); align-items: center; padding-inline: 12px; }
    .brand { justify-content: center; padding: 0; }
    .brand-name, .workspace-label, .menu-item span, .sidebar-note { display: none; }
    .menu { width: 100%; }
    .menu-item { justify-content: center; padding-inline: 0; }
    .sidebar-footer { width: 100%; }
    .sidebar-footer :deep(.user-trigger) { justify-content: center; }
    .sidebar-footer :deep(.user-data), .sidebar-footer :deep(.user-trigger > svg) { display: none; }
}

@media (max-width: 680px) {
    .sidebar { position: fixed; top: auto; right: 0; bottom: 0; left: 0; z-index: 60; width: 100vw; max-width: 100vw; height: 68px; flex-direction: row; padding: 8px 10px max(8px, env(safe-area-inset-bottom)); border-top: 1px solid var(--color-border); border-right: 0; box-shadow: var(--shadow-mobile-nav); }
    .brand, .sidebar-footer { display: none; }
    .menu { display: grid; width: 100%; grid-template-columns: repeat(3, 1fr); gap: var(--space-1); }
    .menu-item { min-height: 50px; flex-direction: column; gap: 2px; padding: 5px 8px; font-size: 0.625rem; }
    .menu-item span { display: block; }
}
</style>
