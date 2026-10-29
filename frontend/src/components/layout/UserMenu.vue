<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'reka-ui'

import AppIcon from '@/components/ui/AppIcon.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { useAuthStore } from '@/stores/auth.store'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const authStore = useAuthStore()
const router = useRouter()
const displayName = computed(() => authStore.user?.nome ?? 'Usuário')
const displayEmail = computed(() => authStore.user?.email ?? 'Sessão local')

async function handleLogout(): Promise<void> {
    authStore.logout()
    await router.push({ name: 'login' })
}
</script>

<template>
    <DropdownMenuRoot>
        <DropdownMenuTrigger class="user-trigger" :class="{ 'user-trigger--compact': compact }" aria-label="Abrir opções do usuário">
            <UserAvatar :name="displayName" size="md" />
            <span v-if="!compact" class="user-data">
                <strong>{{ displayName }}</strong>
                <small>{{ displayEmail }}</small>
            </span>
            <AppIcon v-if="!compact" name="chevron-down" :size="15" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <DropdownMenuContent class="user-dropdown" :side-offset="8" align="end">
                <DropdownMenuLabel class="dropdown-label">
                    <strong>{{ displayName }}</strong>
                    <span>{{ displayEmail }}</span>
                    <small>Autenticação simulada localmente</small>
                </DropdownMenuLabel>
                <DropdownMenuSeparator class="dropdown-separator" />
                <DropdownMenuItem class="dropdown-item dropdown-item--danger" @select="handleLogout">
                    <AppIcon name="logout" :size="17" />
                    Encerrar sessão
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>

<style scoped>
.user-trigger { display: flex; width: 100%; min-width: 0; align-items: center; gap: var(--space-3); padding: 7px; border: 0; border-radius: var(--radius-md); background: transparent; cursor: pointer; text-align: left; transition: var(--transition-colors); }
.user-trigger:hover, .user-trigger[data-state='open'] { background: var(--color-surface-subtle); }
.user-trigger--compact { width: auto; padding: 2px; border-radius: 50%; }
.user-data { display: grid; min-width: 0; flex: 1; }
.user-data strong, .user-data small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-data strong { font-size: var(--font-size-small); font-weight: var(--font-weight-semibold); }
.user-data small { color: var(--color-text-muted); font-size: 0.6875rem; }
.user-trigger > svg { flex: 0 0 auto; color: var(--color-text-muted); }

:global(.user-dropdown) { z-index: 100; width: min(300px, calc(100vw - 24px)); padding: 6px; border: 1px solid var(--color-border); border-radius: var(--radius-lg); background: var(--color-surface); box-shadow: var(--shadow-dialog); animation: dropdown-in var(--duration-normal) var(--ease-out); }
:global(.dropdown-label) { display: grid; padding: 10px; }
:global(.dropdown-label strong) { color: var(--color-foreground); font-size: var(--font-size-small); }
:global(.dropdown-label span) { overflow: hidden; color: var(--color-text-secondary); font-size: var(--font-size-caption); text-overflow: ellipsis; }
:global(.dropdown-label small) { margin-top: 5px; color: var(--color-text-muted); font-size: 0.6875rem; }
:global(.dropdown-separator) { height: 1px; margin: 4px 0; background: var(--color-divider); }
:global(.dropdown-item) { display: flex; min-height: 38px; align-items: center; gap: 9px; padding: 8px 10px; border-radius: var(--radius-sm); cursor: pointer; color: var(--color-text-secondary); font-size: var(--font-size-small); outline: none; }
:global(.dropdown-item[data-highlighted]) { background: var(--color-surface-subtle); color: var(--color-foreground); }
:global(.dropdown-item--danger[data-highlighted]) { background: var(--color-danger-soft); color: var(--color-danger); }
@keyframes dropdown-in { from { opacity: 0; transform: translateY(-4px) scale(0.98); } }
</style>
