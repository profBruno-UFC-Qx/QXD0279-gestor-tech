<script setup lang="ts">
withDefaults(defineProps<{
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
}>(), {
    type: 'button',
    variant: 'primary',
    size: 'md',
})
</script>

<template>
    <button
        :type="type"
        :disabled="disabled || loading"
        class="button"
        :class="[`button--${variant}`, `button--${size}`]"
        :aria-busy="loading"
    >
        <span v-if="loading" class="spinner" aria-hidden="true" />
        <slot name="icon" />
        <span class="button-label"><slot /></span>
    </button>
</template>

<style scoped>
.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: var(--font-size-body);
    font-weight: var(--font-weight-semibold);
    line-height: 1;
    white-space: nowrap;
    transition: var(--transition-colors), box-shadow var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard);
}

.button--sm { min-height: var(--control-height-sm); padding: 8px 12px; font-size: var(--font-size-small); }
.button--md { min-height: var(--control-height); padding: 10px 16px; }
.button--lg { min-height: var(--control-height-lg); padding: 12px 18px; }

.button--primary {
    background: var(--color-primary);
    box-shadow: var(--shadow-primary-sm);
    color: var(--color-white);
}

.button--primary:hover:not(:disabled) { background: var(--color-primary-hover); box-shadow: var(--shadow-primary-md); }
.button--primary:active:not(:disabled) { background: var(--color-primary-active); }

.button--secondary {
    border-color: var(--color-border-strong);
    background: var(--color-surface);
    color: var(--color-foreground);
}

.button--secondary:hover:not(:disabled) { border-color: var(--color-border-hover); background: var(--color-surface-subtle); }
.button--ghost { background: transparent; color: var(--color-text-secondary); }
.button--ghost:hover:not(:disabled) { background: var(--color-primary-soft); color: var(--color-primary); }
.button--danger { background: var(--color-danger); color: var(--color-white); }
.button--danger:hover:not(:disabled) { background: var(--color-danger-hover); }
.button:active:not(:disabled) { transform: translateY(1px); }
.button:disabled { cursor: not-allowed; opacity: 0.55; }

.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 700ms linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
