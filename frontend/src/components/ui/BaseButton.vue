<script setup lang="ts">
defineProps<{
    type?: 'button' | 'submit'
}>()
</script>

<template>
    <button
        :type="type ?? 'button'"
        class="button"
    >
        <slot />
    </button>
</template>

<style scoped>
.button {
    padding:10px 18px;
    border:none;
    border-radius:var(--radius-md);
    background:var(--color-primary);
    color:white;
    cursor:pointer;
    font-weight:600;
    transition:.2s;
}

.button:hover {
    background:var(--color-primary-dark);
}
</style>