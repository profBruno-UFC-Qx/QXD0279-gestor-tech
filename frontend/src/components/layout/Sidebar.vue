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
    { label: 'Atividades', icon: 'activities', name: 'my-activities' },
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
            <img class="brand-logo" src="/Logo%20Gestor%20Tech%20com%20Foguete%20Branco.png" alt="Gestor Tech">
            <span class="brand-mark"><span /><span /><span /></span>
        </router-link>

        <div class="workspace-label">Menu principal</div>
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
.sidebar { position: sticky; top: 0; z-index: 30; display: flex; width: var(--sidebar-width); height: 100vh; flex-direction: column; padding: var(--space-6) var(--space-4) var(--space-4); border-right: 1px solid rgba(255, 255, 255, .05); background: var(--color-sidebar); }
.brand { display: flex; min-height: 40px; align-items: center; padding-inline: var(--space-2); margin-bottom: var(--space-8); }
.brand-logo { display: block; width: 200px; max-width: 100%; height: auto; }
.brand-mark { display: none; width: 34px; height: 34px; align-items: flex-end; justify-content: center; gap: 3px; padding: 8px; border-radius: var(--radius-md); background: var(--color-primary); box-shadow: var(--shadow-primary-md); }
.brand-mark span { width: 3px; border-radius: 4px; background: var(--color-white); }
.brand-mark span:nth-child(1) { height: 8px; opacity: 0.75; }
.brand-mark span:nth-child(2) { height: 17px; }
.brand-mark span:nth-child(3) { height: 12px; opacity: 0.85; }
.workspace-label { padding: 0 var(--space-3) var(--space-2); color: rgba(210, 220, 242, .44); font-size: 0.65rem; font-weight: var(--font-weight-bold); letter-spacing: 0.09em; text-transform: uppercase; }
.menu { display: grid; gap: var(--space-1); }
.menu-item { position: relative; display: flex; min-height: 44px; align-items: center; gap: var(--space-3); padding: 10px 12px; border-radius: var(--radius-md); color: rgba(222, 229, 244, .7); font-size: var(--font-size-small); font-weight: var(--font-weight-medium); transition: var(--transition-colors), transform var(--duration-fast) var(--ease-standard); }
.menu-item::before { position: absolute; top: 10px; bottom: 10px; left: -4px; width: 3px; border-radius: var(--radius-pill); background: transparent; content: ''; transition: background var(--duration-fast) var(--ease-standard); }
.menu-item:hover { background: rgba(111, 143, 232, .08); color: var(--color-white); }
.menu-item--active { background: rgba(111, 143, 232, .15); color: #eef2ff; font-weight: var(--font-weight-semibold); }
.menu-item--active::before { background: #89a6ff; }
.menu-item--active:hover { background: rgba(111, 143, 232, .19); color: var(--color-white); }
.sidebar-footer { padding-top: var(--space-3); margin-top: auto; border-top: 1px solid rgba(255, 255, 255, .09); }
.sidebar-footer :deep(.user-trigger) { color: var(--color-white); }
.sidebar-footer :deep(.user-trigger:hover), .sidebar-footer :deep(.user-trigger[data-state='open']) { background: rgba(255, 255, 255, .1); }
.sidebar-footer :deep(.user-data small), .sidebar-footer :deep(.user-trigger > svg) { color: rgba(255, 255, 255, .62); }

@media (max-width: 1024px) {
    .sidebar { width: var(--sidebar-collapsed-width); align-items: center; padding-inline: 12px; }
    .brand { justify-content: center; padding: 0; }
    .brand-logo { display: none; }
    .brand-mark { display: flex; }
    .workspace-label, .menu-item span { display: none; }
    .menu { width: 100%; }
    .menu-item { justify-content: center; padding-inline: 0; }
    .sidebar-footer { width: 100%; }
    .sidebar-footer :deep(.user-trigger) { justify-content: center; }
    .sidebar-footer :deep(.user-data), .sidebar-footer :deep(.user-trigger > svg) { display: none; }
}

@media (max-width: 680px) {
    .sidebar { position: fixed; top: auto; right: 0; bottom: 0; left: 0; z-index: 60; width: 100vw; max-width: 100vw; height: 68px; flex-direction: row; padding: 8px 10px max(8px, env(safe-area-inset-bottom)); border-top: 1px solid rgba(255, 255, 255, .08); border-right: 0; box-shadow: var(--shadow-mobile-nav); }
    .menu-item::before { top: auto; right: 24px; bottom: 0; left: 24px; width: auto; height: 3px; }
    .brand, .sidebar-footer { display: none; }
    .menu { display: grid; width: 100%; grid-template-columns: repeat(3, 1fr); gap: var(--space-1); }
    .menu-item { min-height: 50px; flex-direction: column; gap: 2px; padding: 5px 8px; font-size: 0.625rem; }
    .menu-item span { display: block; }
}
</style>
