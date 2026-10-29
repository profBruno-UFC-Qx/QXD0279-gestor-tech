<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
    ArrowRight,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock3,
    Folder,
    FolderKanban,
    LayoutDashboard,
    ListTodo,
    LockKeyhole,
    LogOut,
    Mail,
    Menu,
    MoreHorizontal,
    MoreVertical,
    Pencil,
    Plus,
    Search,
    SlidersHorizontal,
    Sparkles,
    Target,
    Trash2,
    TriangleAlert,
    UserPlus,
    UserRound,
    Users,
    X,
} from '@lucide/vue'

import type { IconName } from '@/types/Ui'

const props = withDefaults(defineProps<{
    name: IconName
    size?: number
    strokeWidth?: number
}>(), {
    size: 20,
    strokeWidth: 1.8,
})

const icons: Record<IconName, Component> = {
    activities: ListTodo,
    'alert-triangle': TriangleAlert,
    'arrow-right': ArrowRight,
    calendar: CalendarDays,
    check: Check,
    'check-circle': CheckCircle2,
    'chevron-down': ChevronDown,
    'chevron-right': ChevronRight,
    clock: Clock3,
    dashboard: LayoutDashboard,
    folder: Folder,
    logout: LogOut,
    lock: LockKeyhole,
    mail: Mail,
    menu: Menu,
    'more-horizontal': MoreHorizontal,
    'more-vertical': MoreVertical,
    pencil: Pencil,
    plus: Plus,
    projects: FolderKanban,
    search: Search,
    sliders: SlidersHorizontal,
    sparkles: Sparkles,
    target: Target,
    team: Users,
    trash: Trash2,
    user: UserRound,
    'user-plus': UserPlus,
    warning: TriangleAlert,
    x: X,
}

const icon = computed(() => icons[props.name])
</script>

<template>
    <component
        :is="icon"
        :size="size"
        :stroke-width="strokeWidth"
        aria-hidden="true"
    />
</template>
