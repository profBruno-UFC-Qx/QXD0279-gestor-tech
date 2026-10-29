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
    border: 1px solid rgba(231, 234, 240, .7);
    border-radius: var(--radius-xl);
    background: var(--color-surface);
    box-shadow: var(--shadow-sm);
}

.card--none { padding: 0; }
.card--sm { padding: var(--space-4); }
.card--md { padding: var(--space-5); }
.card--lg { padding: var(--space-6); }
.card--interactive { transition: border-color var(--duration-normal) var(--ease-standard), box-shadow var(--duration-normal) var(--ease-standard), transform var(--duration-normal) var(--ease-standard); }
.card--interactive:hover { border-color: var(--color-primary-border); box-shadow: var(--shadow-md); transform: translateY(-2px); }
</style>
