<script setup lang="ts">
withDefaults(defineProps<{
    rows?: number
    variant?: 'page' | 'cards' | 'table'
}>(), {
    rows: 4,
    variant: 'page',
})
</script>

<template>
    <div class="skeleton" :class="`skeleton--${variant}`" aria-label="Carregando conteúdo" aria-busy="true">
        <template v-if="variant === 'cards'">
            <div v-for="index in rows" :key="index" class="skeleton-card">
                <span class="line line--short" />
                <span class="metric" />
                <span class="line" />
            </div>
        </template>
        <template v-else>
            <span class="line line--title" />
            <span class="line line--short" />
            <div class="skeleton-panel">
                <span v-for="index in rows" :key="index" class="line" />
            </div>
        </template>
    </div>
</template>

<style scoped>
.skeleton { display: grid; gap: var(--space-4); }
.skeleton--cards { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.skeleton-card, .skeleton-panel { display: grid; gap: var(--space-4); padding: var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); }
.line, .metric { display: block; border-radius: var(--radius-sm); background: linear-gradient(90deg, var(--color-skeleton) 25%, var(--color-skeleton-highlight) 45%, var(--color-skeleton) 65%); background-size: 220% 100%; animation: shimmer 1.4s ease infinite; }
.line { width: 100%; height: 12px; }
.line--short { width: 42%; }
.line--title { width: 34%; height: 28px; }
.metric { width: 30%; height: 40px; }
.skeleton-panel { margin-top: var(--space-2); padding-block: var(--space-6); }
@keyframes shimmer { to { background-position: -220% 0; } }
@media (max-width: 900px) { .skeleton--cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .skeleton--cards { grid-template-columns: 1fr; } }
</style>
