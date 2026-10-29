<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    value: number
    label?: string
    showValue?: boolean
    size?: 'sm' | 'md'
}>(), {
    label: 'Progresso',
    showValue: true,
    size: 'md',
})

const normalizedValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
    <div class="progress-component">
        <div v-if="showValue" class="progress-copy">
            <span>{{ label }}</span><strong>{{ normalizedValue }}%</strong>
        </div>
        <div class="track" :class="`track--${size}`" role="progressbar" :aria-label="label" :aria-valuenow="normalizedValue" aria-valuemin="0" aria-valuemax="100">
            <span :style="{ width: `${normalizedValue}%` }" />
        </div>
    </div>
</template>

<style scoped>
.progress-component { display: grid; gap: var(--space-2); }
.progress-copy { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); color: var(--color-text-secondary); font-size: var(--font-size-small); }
.progress-copy strong { color: var(--color-primary); font-family: var(--font-heading); font-size: var(--font-size-body); }
.track { overflow: hidden; border-radius: var(--radius-pill); background: var(--color-primary-soft); }
.track--sm { height: 6px; }
.track--md { height: 9px; }
.track > span { display: block; height: 100%; border-radius: inherit; background: var(--color-primary); transition: width 600ms var(--ease-out); }
</style>
