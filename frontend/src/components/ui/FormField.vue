<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
    id?: string
    label: string
    error?: string
    hint?: string
    required?: boolean
}>()

const generatedId = useId()
const fieldId = computed(() => props.id ?? generatedId)
const descriptionId = computed(() => `${fieldId.value}-description`)

defineExpose({ fieldId })
</script>

<template>
    <div class="field">
        <label class="label" :for="fieldId">
            {{ label }}<span v-if="required" class="required" aria-hidden="true"> *</span>
        </label>
        <slot :id="fieldId" :description-id="descriptionId" />
        <p v-if="error || hint" :id="descriptionId" :class="error ? 'error' : 'hint'">
            {{ error || hint }}
        </p>
    </div>
</template>

<style scoped>
.field { display: grid; gap: var(--space-2); min-width: 0; }
.label { color: var(--color-foreground); font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }
.required { color: var(--color-danger); }
.hint, .error { font-size: var(--font-size-caption); line-height: 1.45; }
.hint { color: var(--color-text-muted); }
.error { color: var(--color-danger); }
</style>
