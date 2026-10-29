<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(defineProps<{
    id?: string
    label: string
    placeholder?: string
    modelValue: string
    type?: 'text' | 'email' | 'password' | 'date'
    name?: string
    autocomplete?: string
    required?: boolean
    disabled?: boolean
    error?: string
    hint?: string
}>(), {
    type: 'text',
})

defineEmits<{
    (event: 'update:modelValue', value: string): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() => `${inputId.value}-description`)
</script>

<template>
    <label class="field" :for="inputId">
        <span class="label">
            {{ label }}<span v-if="required" class="required" aria-hidden="true"> *</span>
        </span>
        <span class="input-wrap">
            <span v-if="$slots.leading" class="leading"><slot name="leading" /></span>
            <input
                :id="inputId"
                :value="modelValue"
                :type="type"
                :name="name"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
                :required="required"
                :disabled="disabled"
                :aria-invalid="Boolean(error)"
                :aria-describedby="error || hint ? descriptionId : undefined"
                :class="{ 'has-leading': $slots.leading }"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            />
        </span>
        <span v-if="error || hint" :id="descriptionId" :class="error ? 'error' : 'hint'">
            {{ error || hint }}
        </span>
    </label>
</template>

<style scoped>
.field { display: grid; gap: var(--space-2); min-width: 0; }
.label { color: var(--color-foreground); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }
.required { color: var(--color-danger); }
.input-wrap { position: relative; display: block; }
.leading { position: absolute; top: 50%; left: 12px; z-index: 1; display: grid; color: var(--color-text-muted); transform: translateY(-50%); }

input {
    width: 100%;
    min-height: var(--control-height);
    padding: 10px 12px;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-foreground);
    transition: var(--transition-colors), box-shadow var(--duration-fast) var(--ease-standard);
}

input.has-leading { padding-left: 40px; }
input::placeholder { color: var(--color-text-muted); }
input:hover:not(:disabled) { border-color: var(--color-border-hover); }
input:focus-visible { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-soft); outline: 0; }
input[aria-invalid='true'] { border-color: var(--color-danger); }
input[aria-invalid='true']:focus-visible { box-shadow: 0 0 0 3px var(--color-danger-soft); }
input:disabled { cursor: not-allowed; background: var(--color-surface-subtle); color: var(--color-text-muted); }
.hint, .error { font-size: var(--font-size-caption); line-height: 1.45; }
.hint { color: var(--color-text-muted); }
.error { color: var(--color-danger); }
</style>
