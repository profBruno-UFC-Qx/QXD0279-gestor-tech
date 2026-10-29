<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    name?: string
    size?: 'sm' | 'md' | 'lg'
}>(), {
    name: 'Usuário',
    size: 'md',
})

const initials = computed(() => props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U')
</script>

<template>
    <span class="avatar" :class="`avatar--${size}`" :title="name" aria-hidden="true">{{ initials }}</span>
</template>

<style scoped>
.avatar { display: inline-grid; place-items: center; flex: 0 0 auto; border: 1px solid var(--color-primary-border); border-radius: 50%; background: var(--color-primary-soft); color: var(--color-primary-active); font-weight: var(--font-weight-bold); letter-spacing: -0.02em; }
.avatar--sm { width: 30px; height: 30px; font-size: 0.625rem; }
.avatar--md { width: 38px; height: 38px; font-size: 0.7rem; }
.avatar--lg { width: 48px; height: 48px; font-size: 0.8rem; }
</style>
