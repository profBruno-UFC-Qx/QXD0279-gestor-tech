<script setup lang="ts">
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogRoot,
    AlertDialogTitle,
} from 'reka-ui'

const props = withDefaults(defineProps<{
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    busy?: boolean
    danger?: boolean
}>(), {
    confirmLabel: 'Confirmar',
    busy: false,
    danger: false,
})

const emit = defineEmits<{
    (event: 'update:open', value: boolean): void
    (event: 'confirm'): void
}>()
</script>

<template>
    <AlertDialogRoot :open="props.open" @update:open="emit('update:open', $event)">
        <AlertDialogPortal>
            <AlertDialogOverlay class="dialog-overlay" />
            <AlertDialogContent class="dialog-content">
                <div class="dialog-icon" :class="{ danger }">
                    <slot name="icon" />
                </div>
                <AlertDialogTitle class="dialog-title">{{ title }}</AlertDialogTitle>
                <AlertDialogDescription class="dialog-description">{{ description }}</AlertDialogDescription>
                <div class="dialog-actions">
                    <AlertDialogCancel class="dialog-button dialog-button--secondary" :disabled="busy">Cancelar</AlertDialogCancel>
                    <AlertDialogAction class="dialog-button" :class="danger ? 'dialog-button--danger' : 'dialog-button--primary'" :disabled="busy" @click.prevent="emit('confirm')">
                        {{ busy ? 'Aguarde...' : confirmLabel }}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialogPortal>
    </AlertDialogRoot>
</template>

<style scoped>
.dialog-overlay { position: fixed; z-index: 80; inset: 0; background: var(--color-overlay); animation: overlay-in var(--duration-normal) var(--ease-out); }
.dialog-content { position: fixed; top: 50%; left: 50%; z-index: 90; width: min(calc(100vw - 32px), 440px); padding: var(--space-6); border: 1px solid var(--color-border); border-radius: var(--radius-xl); background: var(--color-surface); box-shadow: var(--shadow-dialog); transform: translate(-50%, -50%); animation: dialog-in var(--duration-slow) var(--ease-out); }
.dialog-icon:empty { display: none; }
.dialog-title { font-family: var(--font-heading); font-size: 1.125rem; font-weight: var(--font-weight-bold); }
.dialog-description { margin-top: var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-body); line-height: 1.6; }
.dialog-actions { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-6); }
.dialog-button { min-height: var(--control-height); padding: 10px 16px; border: 1px solid transparent; border-radius: var(--radius-md); cursor: pointer; font-weight: var(--font-weight-semibold); }
.dialog-button:disabled { cursor: not-allowed; opacity: 0.55; }
.dialog-button--secondary { border-color: var(--color-border-strong); background: var(--color-surface); }
.dialog-button--primary { background: var(--color-primary); color: var(--color-white); }
.dialog-button--danger { background: var(--color-danger); color: var(--color-white); }
@keyframes overlay-in { from { opacity: 0; } }
@keyframes dialog-in { from { opacity: 0; transform: translate(-50%, calc(-50% + 10px)) scale(0.98); } }
</style>
