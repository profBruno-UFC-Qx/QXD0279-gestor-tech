<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from './AppIcon.vue'
import type { IconName } from '@/types/Ui'

const props = withDefaults(defineProps<{
    label: string
    value: string | number
    detail?: string
    icon?: IconName
    tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
    progress?: number
}>(), {
    detail: '',
    icon: 'target',
    tone: 'neutral',
})

const normalizedProgress = computed(() => Math.min(100, Math.max(0, props.progress ?? 0)))
const progressAngle = computed(() => normalizedProgress.value * 3.6)
</script>

<template>
    <article class="stat-card" :class="`stat-card--${tone}`">
        <div class="stat-top">
            <span>{{ label }}</span>
            <span
                class="icon"
                :class="{ 'icon--progress': progress !== undefined }"
                :style="progress !== undefined ? { '--progress-angle': `${progressAngle}deg` } : undefined"
                :aria-label="progress !== undefined ? `${normalizedProgress}% do total` : undefined"
                :role="progress !== undefined ? 'img' : undefined"
            ><AppIcon :name="icon" :size="17" /></span>
        </div>
        <strong>{{ value }}</strong>
        <small v-if="detail">{{ detail }}</small>
    </article>
</template>

<style scoped>
.stat-card { --tone-color: var(--color-text-secondary); min-width: 0; padding: var(--space-5); border: 1px solid rgba(231, 234, 240, .75); border-radius: var(--radius-xl); background: var(--color-surface); box-shadow: var(--shadow-sm); }
.stat-top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-small); font-weight: var(--font-weight-medium); }
.icon { position: relative; display: grid; width: 36px; height: 36px; place-items: center; flex: 0 0 auto; border-radius: var(--radius-pill); background: var(--color-surface-subtle); color: var(--tone-color); }
.icon--progress { width: 44px; height: 44px; background: conic-gradient(var(--tone-color) var(--progress-angle), var(--color-surface-subtle) 0); }
.icon--progress::before { position: absolute; width: 34px; height: 34px; border-radius: inherit; background: var(--color-surface); content: ''; }
.icon svg { position: relative; z-index: 1; }
strong { display: block; margin-top: var(--space-4); color: var(--color-foreground); font-family: var(--font-heading); font-size: var(--font-size-kpi); font-weight: 700; letter-spacing: -0.045em; line-height: 1; }
small { display: block; margin-top: var(--space-2); color: var(--color-text-muted); font-size: var(--font-size-caption); }
.stat-card--primary { --tone-color: var(--color-primary); }
.stat-card--success { --tone-color: var(--color-success-strong); }
.stat-card--warning { --tone-color: var(--color-warning-strong); }
.stat-card--danger { --tone-color: var(--color-danger); }
.stat-card--primary strong, .stat-card--success strong, .stat-card--warning strong, .stat-card--danger strong { color: var(--tone-color); }
.stat-card--primary .icon:not(.icon--progress) { background: var(--color-primary-soft); }
.stat-card--success .icon:not(.icon--progress) { background: var(--color-success-soft); }
.stat-card--warning .icon:not(.icon--progress) { background: var(--color-warning-soft); }
.stat-card--danger .icon:not(.icon--progress) { background: var(--color-danger-soft); }
</style>
