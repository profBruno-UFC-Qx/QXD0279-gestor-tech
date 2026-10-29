<template>
    <div class="filter-bar">
        <div class="search-slot"><slot /></div>
        <div v-if="$slots.filters" class="filters"><slot name="filters" /></div>
        <div v-if="$slots.actions" class="actions"><slot name="actions" /></div>
    </div>
</template>

<style scoped>
.filter-bar { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); border: 1px solid rgba(231, 234, 240, .7); border-radius: var(--radius-xl); background: var(--color-surface); box-shadow: var(--shadow-sm); }
.search-slot { min-width: 220px; flex: 1; }
.search-slot :deep(.search) { width: min(100%, 420px); }
.filters, .actions { display: flex; align-items: center; gap: var(--space-2); }
.filters :deep(select) { min-width: 150px; }
@media (max-width: 760px) {
    .filter-bar { align-items: stretch; flex-direction: column; }
    .search-slot { min-width: 0; }
    .search-slot :deep(.search) { width: 100%; }
    .filters { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .filters :deep(select) { min-width: 0; }
}
</style>
