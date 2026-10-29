<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import type { IconName } from '@/types/Ui'

withDefaults(defineProps<{
    label: string
    value: string | number
    detail?: string
    icon?: IconName
    tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
}>(), {
    detail: '',
    icon: 'target',
    tone: 'neutral',
})
</script>

<template>
    <article class="stat-card" :class="`stat-card--${tone}`">
        <div class="stat-top"><span>{{ label }}</span><span class="icon"><AppIcon :name="icon" :size="18" /></span></div>
        <strong>{{ value }}</strong>
        <small v-if="detail">{{ detail }}</small>
    </article>
</template>

<style scoped>
.stat-card { min-width: 0; padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-xs); }
.stat-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-small); font-weight: var(--font-weight-medium); }
.icon { display: grid; width: 34px; height: 34px; place-items: center; border-radius: var(--radius-md); background: var(--color-surface-subtle); color: var(--color-text-secondary); }
strong { display: block; margin-top: var(--space-4); color: var(--color-foreground); font-family: var(--font-heading); font-size: var(--font-size-kpi); letter-spacing: -0.045em; line-height: 1; }
small { display: block; margin-top: var(--space-2); color: var(--color-text-muted); font-size: var(--font-size-caption); }
.stat-card--primary .icon, .stat-card--primary strong { color: var(--color-primary); }
.stat-card--primary .icon { background: var(--color-primary-soft); }
.stat-card--success .icon, .stat-card--success strong { color: var(--color-success-strong); }
.stat-card--success .icon { background: var(--color-success-soft); }
.stat-card--warning .icon, .stat-card--warning strong { color: var(--color-warning-strong); }
.stat-card--warning .icon { background: var(--color-warning-soft); }
.stat-card--danger .icon, .stat-card--danger strong { color: var(--color-danger); }
.stat-card--danger .icon { background: var(--color-danger-soft); }
</style>
