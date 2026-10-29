<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { getErrorMessage } from '@/services/errors'
import { useAuthStore } from '@/stores/auth.store'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const formError = ref('')
const fieldErrors = reactive({ email: '', password: '' })
const authStore = useAuthStore()
const router = useRouter()

function validateForm(): boolean {
    fieldErrors.email = /^\S+@\S+\.\S+$/.test(email.value.trim()) ? '' : 'Informe um e-mail válido.'
    fieldErrors.password = password.value ? '' : 'Informe sua senha.'
    return !fieldErrors.email && !fieldErrors.password
}

async function handleLogin(): Promise<void> {
    formError.value = ''
    if (!validateForm()) return
    isLoading.value = true
    try {
        await authStore.login({ email: email.value.trim(), senha: password.value })
        toast.success('Sessão iniciada', { description: 'Bem-vindo ao Gestor Tech.' })
        await router.push({ name: 'dashboard' })
    } catch (error: unknown) {
        formError.value = getErrorMessage(error, 'Não foi possível iniciar a sessão.')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="auth-panel">
        <div class="mobile-brand"><span class="brand-mark"><span /><span /><span /></span>Gestor <strong>Tech</strong></div>
        <header><span class="eyebrow">Bem-vindo de volta</span><h1>Entre na sua conta</h1><p>Acesse seus projetos, atividades e indicadores.</p></header>
        <div class="local-notice"><AppIcon name="alert-triangle" :size="17" /><span>Este é um ambiente acadêmico. A autenticação é simulada e não representa segurança de produção.</span></div>
        <form class="auth-form" novalidate @submit.prevent="handleLogin">
            <BaseInput id="email" v-model="email" type="email" name="email" label="E-mail" placeholder="voce@exemplo.com" autocomplete="username" :error="fieldErrors.email" :disabled="isLoading" required><template #leading><AppIcon name="mail" :size="17" /></template></BaseInput>
            <BaseInput id="password" v-model="password" type="password" name="password" label="Senha" placeholder="Digite sua senha" autocomplete="current-password" :error="fieldErrors.password" :disabled="isLoading" required><template #leading><AppIcon name="lock" :size="17" /></template></BaseInput>
            <div v-if="formError" class="error-banner" role="alert">{{ formError }}</div>
            <BaseButton class="submit-button" type="submit" size="lg" :loading="isLoading">Entrar</BaseButton>
        </form>
        <p class="auth-switch">Ainda não tem uma conta? <router-link :to="{ name: 'register' }">Criar conta</router-link></p>
    </div>
</template>

<style scoped>
.auth-panel { width: min(100%, 440px); }
.mobile-brand { display: none; align-items: center; gap: var(--space-2); margin-bottom: var(--space-10); font-family: var(--font-heading); font-size: 1rem; font-weight: var(--font-weight-semibold); }.mobile-brand strong { color: var(--color-primary); }
.brand-mark { display: flex; width: 30px; height: 30px; align-items: flex-end; justify-content: center; gap: 3px; padding: 7px; border-radius: var(--radius-md); background: var(--color-primary); }.brand-mark span { width: 3px; border-radius: 4px; background: var(--color-white); }.brand-mark span:nth-child(1) { height: 7px; }.brand-mark span:nth-child(2) { height: 14px; }.brand-mark span:nth-child(3) { height: 10px; }
header { margin-bottom: var(--space-6); }.eyebrow { display: block; margin-bottom: var(--space-2); color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-bold); letter-spacing: .08em; text-transform: uppercase; }h1 { font-size: clamp(1.65rem, 4vw, 2rem); }header p { margin-top: var(--space-2); color: var(--color-text-secondary); }
.local-notice { display: flex; align-items: flex-start; gap: var(--space-2); padding: var(--space-3); margin-bottom: var(--space-6); border: 1px solid var(--color-warning-border); border-radius: var(--radius-md); background: var(--color-warning-soft); color: var(--color-warning-strong); font-size: var(--font-size-caption); }.local-notice svg { flex: 0 0 auto; margin-top: 1px; }
.auth-form { display: grid; gap: var(--space-5); }.submit-button { width: 100%; margin-top: var(--space-1); }.auth-switch { margin-top: var(--space-6); color: var(--color-text-secondary); text-align: center; }.auth-switch a { color: var(--color-primary); font-weight: var(--font-weight-semibold); }
@media (max-width: 900px) { .mobile-brand { display: flex; } }
</style>
