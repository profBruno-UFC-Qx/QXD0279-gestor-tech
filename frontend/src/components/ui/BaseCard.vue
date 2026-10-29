<script setup lang="ts">
withDefaults(defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg'
    interactive?: boolean
}>(), {
    padding: 'lg',
    interactive: false,
})
</script>

<template>
    <section class="card" :class="[`card--${padding}`, { 'card--interactive': interactive }]">
        <slot />
    </section>
</template>

<style scoped>
.card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    box-shadow: var(--shadow-xs);
}

.card--none { padding: 0; }
.card--sm { padding: var(--space-4); }
.card--md { padding: var(--space-5); }
.card--lg { padding: var(--space-6); }
.card--interactive { transition: border-color var(--duration-normal) var(--ease-standard), box-shadow var(--duration-normal) var(--ease-standard), transform var(--duration-normal) var(--ease-standard); }
.card--interactive:hover { border-color: var(--color-border-strong); box-shadow: var(--shadow-md); transform: translateY(-2px); }
</style>
