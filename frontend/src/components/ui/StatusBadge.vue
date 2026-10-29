<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

const props = withDefaults(defineProps<{
    value?: string
    label: string
    tone?: Tone
    dot?: boolean
}>(), {
    value: '',
    tone: undefined,
    dot: true,
})

const resolvedTone = computed<Tone>(() => {
    if (props.tone) return props.tone
    if (['CONCLUIDO', 'CONCLUIDA'].includes(props.value)) return 'success'
    if (props.value === 'EM_ANDAMENTO') return 'primary'
    if (['MEDIA', 'PLANEJADO'].includes(props.value)) return 'warning'
    if (['ALTA', 'ATRASADA'].includes(props.value)) return 'danger'
    return 'neutral'
})
</script>

<template>
    <span class="badge" :class="`badge--${resolvedTone}`">
        <span v-if="dot" class="dot" aria-hidden="true" />
        {{ label }}
    </span>
</template>

<style scoped>
.badge { display: inline-flex; width: fit-content; min-height: 26px; align-items: center; gap: 6px; padding: 4px 9px; border: 1px solid transparent; border-radius: var(--radius-pill); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); line-height: 1; white-space: nowrap; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.badge--neutral { border-color: var(--color-border); background: var(--color-surface-subtle); color: var(--color-text-secondary); }
.badge--primary { border-color: var(--color-primary-border); background: var(--color-primary-soft); color: var(--color-primary-active); }
.badge--success { border-color: var(--color-success-border); background: var(--color-success-soft); color: var(--color-success-strong); }
.badge--warning { border-color: var(--color-warning-border); background: var(--color-warning-soft); color: var(--color-warning-strong); }
.badge--danger { border-color: var(--color-danger-border); background: var(--color-danger-soft); color: var(--color-danger); }
</style>
