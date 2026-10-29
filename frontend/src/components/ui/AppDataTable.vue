<script setup lang="ts">
defineProps<{
    empty?: boolean
    label: string
}>()
</script>

<template>
    <div class="table-card">
        <div v-if="$slots.header" class="table-header"><slot name="header" /></div>
        <div v-if="!empty" class="table-scroll" role="region" :aria-label="label" tabindex="0">
            <table><slot /></table>
        </div>
        <div v-else><slot name="empty" /></div>
    </div>
</template>

<style scoped>
.table-card { min-width: 0; overflow: hidden; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-xs); }
.table-header { padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--color-divider); }
.table-scroll { overflow-x: auto; }
table { width: 100%; min-width: 720px; border-collapse: collapse; }
:deep(th) { padding: 11px 18px; background: var(--color-surface-subtle); color: var(--color-text-muted); font-size: 0.6875rem; font-weight: var(--font-weight-bold); letter-spacing: 0.055em; text-align: left; text-transform: uppercase; }
:deep(td) { padding: 14px 18px; border-top: 1px solid var(--color-divider); color: var(--color-text-secondary); font-size: var(--font-size-small); vertical-align: middle; }
:deep(tbody tr) { transition: background var(--duration-fast) var(--ease-standard); }
:deep(tbody tr:hover) { background: var(--color-primary-subtle); }
</style>
