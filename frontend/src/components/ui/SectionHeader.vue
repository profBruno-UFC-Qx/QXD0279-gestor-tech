<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
    <header class="section-header">
        <div><h2>{{ title }}</h2><p v-if="description">{{ description }}</p></div>
        <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
    </header>
</template>

<style scoped>
.section-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); }
h2 { font-size: var(--font-size-section-title); }
p { margin-top: 2px; color: var(--color-text-secondary); font-size: var(--font-size-small); }
.actions { display: flex; align-items: center; gap: var(--space-2); }
</style>
