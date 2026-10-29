<script setup lang="ts">
defineProps<{
    title: string
    description?: string
    eyebrow?: string
}>()
</script>

<template>
    <header class="page-header">
        <div class="copy">
            <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
            <h1>{{ title }}</h1>
            <p v-if="description">{{ description }}</p>
        </div>
        <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
    </header>
</template>

<style scoped>
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-6); }
.copy { min-width: 0; }
.eyebrow { display: block; margin-bottom: var(--space-1); color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-bold); letter-spacing: 0.08em; text-transform: uppercase; }
h1 { font-size: var(--font-size-page-title); line-height: 1.25; }
p { max-width: 720px; margin-top: var(--space-2); color: var(--color-text-secondary); }
.actions { display: flex; flex: 0 0 auto; flex-wrap: wrap; gap: var(--space-2); }

@media (max-width: 640px) {
    .page-header { flex-direction: column; gap: var(--space-4); }
    .actions { width: 100%; }
    .actions :deep(.button), .actions :deep(a) { flex: 1; }
}
</style>
