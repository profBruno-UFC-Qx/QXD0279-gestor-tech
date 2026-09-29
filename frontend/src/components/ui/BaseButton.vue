<script setup lang="ts">
defineProps<{
    type?: 'button' | 'submit'
    disabled?: boolean
}>()
</script>

<template>
    <button :type="type ?? 'button'" :disabled="disabled" class="button">
        <slot />
    </button>
</template>

<style scoped>
.button {
    padding: 10px 18px;
    border: none;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    color: white;
    cursor: pointer;
    font-weight: 600;
    transition: 0.2s;
}

.button:hover:not(:disabled) {
    background: var(--color-primary-dark);
}

.button:focus-visible {
    outline: 2px solid var(--color-primary-dark);
    outline-offset: 2px;
}

.button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
}
</style>
