<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'
import type { ActivityPriority } from '@/types/Activity'
import { priorityLabels } from '@/utils/labels'

defineProps<{ priority: ActivityPriority }>()

const tones = {
    BAIXA: 'success',
    MEDIA: 'warning',
    ALTA: 'danger',
} as const
</script>

<template>
    <StatusBadge :label="priorityLabels[priority]" :tone="tones[priority]" />
</template>
