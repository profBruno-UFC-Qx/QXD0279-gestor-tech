<script setup lang="ts">
defineProps<{
    label:string
    placeholder?:string
    modelValue:string
}>()

defineEmits<{
    (
        event:'update:modelValue',
        value:string
    ):void
}>()
</script>

<template>
    <label class="field">

        <span>
            {{ label }}
        </span>

        <input
            :value="modelValue"
            :placeholder="placeholder"
            @input="$emit(
                'update:modelValue',
                ($event.target as HTMLInputElement).value
            )"
        />

    </label>
</template>

<style scoped>
.field {
    display:flex;
    flex-direction:column;
    gap:8px;
}

input {
    padding:10px 12px;
    border:1px solid var(--color-border);
    border-radius:var(--radius-md);
}
</style>