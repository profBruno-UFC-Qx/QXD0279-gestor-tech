<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import type { IconName } from '@/types/Ui'

withDefaults(defineProps<{
    title: string
    description: string
    icon?: IconName
    compact?: boolean
}>(), {
    icon: 'folder',
    compact: false,
})
</script>

<template>
    <div class="empty-state" :class="{ 'empty-state--compact': compact }">
        <span class="icon-wrap"><AppIcon :name="icon" :size="22" /></span>
        <div>
            <h2>{{ title }}</h2>
            <p>{{ description }}</p>
        </div>
        <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
    </div>
</template>

<style scoped>
.empty-state { display: grid; min-height: 260px; place-items: center; align-content: center; gap: var(--space-4); padding: var(--space-8); border: 1px dashed var(--color-border-strong); border-radius: var(--radius-lg); background: var(--color-primary-subtle); text-align: center; }
.empty-state--compact { min-height: 180px; padding: var(--space-6); }
.icon-wrap { display: grid; width: 48px; height: 48px; place-items: center; border: 1px solid var(--color-primary-border); border-radius: var(--radius-lg); background: var(--color-surface); color: var(--color-primary); box-shadow: var(--shadow-sm); }
h2 { font-size: var(--font-size-section-title); }
p { max-width: 480px; margin-top: var(--space-1); color: var(--color-text-secondary); }
.actions { display: flex; justify-content: center; gap: var(--space-2); }
</style>
