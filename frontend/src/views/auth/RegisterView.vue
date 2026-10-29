<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { getErrorMessage } from '@/services/errors'
import { useAuthStore } from '@/stores/auth.store'

const form = reactive({ nome: '', email: '', senha: '', confirmarSenha: '' })
const errors = reactive({ nome: '', email: '', senha: '', confirmarSenha: '' })
const formError = ref('')
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

function validate(): boolean {
    errors.nome = form.nome.trim() ? '' : 'Informe seu nome.'
    errors.email = /^\S+@\S+\.\S+$/.test(form.email.trim()) ? '' : 'Informe um e-mail válido.'
    errors.senha = form.senha.length >= 6 ? '' : 'Use pelo menos 6 caracteres.'
    errors.confirmarSenha = form.confirmarSenha === form.senha ? '' : 'As senhas não coincidem.'
    return !Object.values(errors).some(Boolean)
}

async function handleRegister(): Promise<void> {
    formError.value = ''
    if (!validate()) return
    isLoading.value = true
    try {
        await authStore.register({ nome: form.nome.trim(), email: form.email.trim(), senha: form.senha })
        toast.success('Conta criada', { description: 'Seu workspace local está pronto.' })
        await router.push({ name: 'dashboard' })
    } catch (error: unknown) {
        formError.value = getErrorMessage(error, 'Não foi possível criar a conta.')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="auth-panel">
        <div class="mobile-brand"><span class="brand-mark"><span /><span /><span /></span>Gestor <strong>Tech</strong></div>
        <header><span class="eyebrow">Comece agora</span><h1>Crie sua conta</h1><p>Organize projetos e entregas em um único workspace.</p></header>
        <div class="local-notice"><AppIcon name="alert-triangle" :size="17" /><span>Conta e dados serão simulados e armazenados apenas neste navegador.</span></div>
        <form class="auth-form" novalidate @submit.prevent="handleRegister">
            <BaseInput v-model="form.nome" label="Nome completo" placeholder="Seu nome" autocomplete="name" :error="errors.nome" :disabled="isLoading" required><template #leading><AppIcon name="user" :size="17" /></template></BaseInput>
            <BaseInput v-model="form.email" type="email" label="E-mail" placeholder="voce@exemplo.com" autocomplete="email" :error="errors.email" :disabled="isLoading" required><template #leading><AppIcon name="mail" :size="17" /></template></BaseInput>
            <div class="password-row"><BaseInput v-model="form.senha" type="password" label="Senha" placeholder="Mínimo de 6 caracteres" autocomplete="new-password" :error="errors.senha" :disabled="isLoading" required /><BaseInput v-model="form.confirmarSenha" type="password" label="Confirmar senha" placeholder="Repita a senha" autocomplete="new-password" :error="errors.confirmarSenha" :disabled="isLoading" required /></div>
            <div v-if="formError" class="error-banner" role="alert">{{ formError }}</div>
            <BaseButton class="submit-button" type="submit" size="lg" :loading="isLoading">Criar conta</BaseButton>
        </form>
        <p class="auth-switch">Já tem uma conta? <router-link :to="{ name: 'login' }">Entrar</router-link></p>
    </div>
</template>

<style scoped>
.auth-panel { width: min(100%, 520px); }.mobile-brand { display: none; align-items: center; gap: var(--space-2); margin-bottom: var(--space-8); font-family: var(--font-heading); font-weight: var(--font-weight-semibold); }.mobile-brand strong { color: var(--color-primary); }.brand-mark { display: flex; width: 30px; height: 30px; align-items: flex-end; justify-content: center; gap: 3px; padding: 7px; border-radius: var(--radius-md); background: var(--color-primary); }.brand-mark span { width: 3px; border-radius: 4px; background: var(--color-white); }.brand-mark span:nth-child(1) { height: 7px; }.brand-mark span:nth-child(2) { height: 14px; }.brand-mark span:nth-child(3) { height: 10px; }
header { margin-bottom: var(--space-5); }.eyebrow { display: block; margin-bottom: var(--space-2); color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-bold); letter-spacing: .08em; text-transform: uppercase; }h1 { font-size: clamp(1.65rem, 4vw, 2rem); }header p { margin-top: var(--space-2); color: var(--color-text-secondary); }
.local-notice { display: flex; align-items: flex-start; gap: var(--space-2); padding: var(--space-3); margin-bottom: var(--space-5); border: 1px solid var(--color-warning-border); border-radius: var(--radius-md); background: var(--color-warning-soft); color: var(--color-warning-strong); font-size: var(--font-size-caption); }.local-notice svg { flex: 0 0 auto; margin-top: 1px; }
.auth-form { display: grid; gap: var(--space-4); }.password-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }.submit-button { width: 100%; margin-top: var(--space-1); }.auth-switch { margin-top: var(--space-5); color: var(--color-text-secondary); text-align: center; }.auth-switch a { color: var(--color-primary); font-weight: var(--font-weight-semibold); }
@media (max-width: 900px) { .mobile-brand { display: flex; } }@media (max-width: 520px) { .password-row { grid-template-columns: 1fr; } }
</style>
