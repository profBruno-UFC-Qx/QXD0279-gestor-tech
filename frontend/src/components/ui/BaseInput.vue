<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(defineProps<{
    id?: string
    label: string
    placeholder?: string
    modelValue: string
    type?: 'text' | 'email' | 'password'
    name?: string
    autocomplete?: string
    required?: boolean
    disabled?: boolean
    error?: string
}>(), {
    type: 'text',
    placeholder: undefined,
    name: undefined,
    autocomplete: undefined,
    error: undefined,
})

defineEmits<{
    (event: 'update:modelValue', value: string): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const errorId = computed(() => `${inputId.value}-error`)
</script>

<template>
    <label class="field" :for="inputId">
        <span class="label">
            {{ label }}<span v-if="required" aria-hidden="true"> *</span>
        </span>

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
            :aria-describedby="error ? errorId : undefined"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />

        <span v-if="error" :id="errorId" class="error">
            {{ error }}
        </span>
    </label>
</template>

<style scoped>
.field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.label {
    font-weight: 600;
}

input {
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
}

input:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

input[aria-invalid='true'] {
    border-color: var(--color-danger);
}

input:disabled {
    cursor: not-allowed;
    opacity: 0.65;
}

.error {
    color: var(--color-danger);
    font-size: 0.875rem;
}
</style>
