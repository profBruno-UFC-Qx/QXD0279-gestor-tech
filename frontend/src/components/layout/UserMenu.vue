<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()
const displayName = computed(() => authStore.user?.name ?? 'Usuário')

async function handleLogout(): Promise<void> {
    authStore.logout()
    await router.push({ name: 'login' })
}
</script>

<template>
    <button class="user-menu" type="button" title="Sair" @click="handleLogout">
        {{ displayName }} · Sair
    </button>
</template>

<style scoped>
.user-menu {
    border: none;
    background: #f3f4f6;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
}
</style>
