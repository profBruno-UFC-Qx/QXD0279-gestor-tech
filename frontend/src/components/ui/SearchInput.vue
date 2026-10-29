<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(defineProps<{
    modelValue: string
    placeholder?: string
    label?: string
    shortcut?: string
}>(), {
    placeholder: 'Buscar',
    label: 'Buscar',
    shortcut: '',
})

defineEmits<{ (event: 'update:modelValue', value: string): void }>()
const id = useId()
const input = ref<HTMLInputElement | null>(null)

function handleShortcut(event: KeyboardEvent): void {
    if (!props.shortcut || event.key.toLowerCase() !== 'k' || (!event.ctrlKey && !event.metaKey)) return
    event.preventDefault()
    input.value?.focus()
}

onMounted(() => window.addEventListener('keydown', handleShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', handleShortcut))
</script>

<template>
    <label class="search" :for="id">
        <span class="sr-only">{{ label }}</span>
        <AppIcon name="search" :size="17" />
        <input
            ref="input"
            :id="id"
            type="search"
            :value="modelValue"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
        <kbd v-if="shortcut">{{ shortcut }}</kbd>
    </label>
</template>

<style scoped>
.search { position: relative; display: flex; width: min(100%, 360px); align-items: center; }
.search > svg { position: absolute; left: 12px; color: var(--color-text-muted); pointer-events: none; }
input { width: 100%; min-height: var(--control-height); padding: 9px 36px 9px 38px; border: 1px solid var(--color-border-strong); border-radius: var(--radius-md); background: var(--color-surface); color: var(--color-foreground); transition: var(--transition-colors), box-shadow var(--duration-fast) var(--ease-standard); }
input::placeholder { color: var(--color-text-muted); }
input:hover { border-color: var(--color-border-hover); }
input:focus-visible { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-soft); outline: none; }
input::-webkit-search-cancel-button { cursor: pointer; }
kbd { position: absolute; right: 10px; display: inline-flex; min-height: 24px; align-items: center; padding: 2px 7px; border: 1px solid var(--color-border); border-radius: var(--radius-xs); background: var(--color-surface-subtle); color: var(--color-text-muted); font-family: var(--font-body); font-size: .625rem; font-weight: var(--font-weight-semibold); pointer-events: none; }
.search:has(kbd) input { padding-right: 76px; }
</style>
