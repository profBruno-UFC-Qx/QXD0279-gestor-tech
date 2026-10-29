<script setup lang="ts">
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
} from 'reka-ui'

import AppIcon from './AppIcon.vue'

const props = defineProps<{
    open: boolean
    title: string
    description?: string
}>()

const emit = defineEmits<{ (event: 'update:open', value: boolean): void }>()
</script>

<template>
    <DialogRoot :open="props.open" @update:open="emit('update:open', $event)">
        <DialogPortal>
            <DialogOverlay class="sheet-overlay" />
            <DialogContent class="sheet-content">
                <header class="sheet-header">
                    <div><DialogTitle class="sheet-title">{{ title }}</DialogTitle><DialogDescription v-if="description" class="sheet-description">{{ description }}</DialogDescription></div>
                    <DialogClose class="close-button" aria-label="Fechar"><AppIcon name="x" :size="19" /></DialogClose>
                </header>
                <div class="sheet-body"><slot /></div>
                <footer v-if="$slots.footer" class="sheet-footer"><slot name="footer" /></footer>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

<style scoped>
.sheet-overlay { position: fixed; z-index: 80; inset: 0; background: var(--color-overlay); animation: overlay-in var(--duration-normal) var(--ease-out); }
.sheet-content { position: fixed; top: 0; right: 0; z-index: 90; display: grid; width: min(560px, 100vw); height: 100dvh; grid-template-rows: auto minmax(0, 1fr) auto; border-left: 1px solid var(--color-border); background: var(--color-surface); box-shadow: var(--shadow-dialog); animation: sheet-in var(--duration-slow) var(--ease-out); }
.sheet-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); padding: var(--space-6); border-bottom: 1px solid var(--color-divider); }
.sheet-title { font-family: var(--font-heading); font-size: 1.2rem; font-weight: var(--font-weight-bold); }
.sheet-description { margin-top: var(--space-1); color: var(--color-text-secondary); font-size: var(--font-size-small); }
.close-button { display: grid; width: 36px; height: 36px; place-items: center; flex: 0 0 auto; border: 0; border-radius: var(--radius-md); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: var(--transition-colors); }
.close-button:hover { background: var(--color-surface-subtle); color: var(--color-foreground); }
.sheet-body { overflow-y: auto; padding: var(--space-6); }
.sheet-footer { display: flex; justify-content: flex-end; gap: var(--space-2); padding: var(--space-4) var(--space-6); border-top: 1px solid var(--color-divider); background: var(--color-surface-subtle); }
@keyframes overlay-in { from { opacity: 0; } }
@keyframes sheet-in { from { transform: translateX(100%); } }
@media (max-width: 560px) { .sheet-content { width: 100vw; } .sheet-header, .sheet-body { padding: var(--space-5) var(--space-4); } .sheet-footer { padding-inline: var(--space-4); } }
</style>
