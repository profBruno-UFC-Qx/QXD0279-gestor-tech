<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { getApiErrorMessage } from '@/services/api'
import { useAuthStore } from '@/stores/auth.store'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const formError = ref('')
const fieldErrors = reactive({
    email: '',
    password: '',
})

const authStore = useAuthStore()
const router = useRouter()

function validateForm(): boolean {
    fieldErrors.email = ''
    fieldErrors.password = ''

    const normalizedEmail = email.value.trim()

    if (!normalizedEmail) {
        fieldErrors.email = 'Informe seu e-mail.'
    } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        fieldErrors.email = 'Informe um e-mail válido.'
    }

    if (!password.value) {
        fieldErrors.password = 'Informe sua senha.'
    }

    return !fieldErrors.email && !fieldErrors.password
}

async function handleLogin(): Promise<void> {
    formError.value = ''

    if (!validateForm()) {
        return
    }

    isLoading.value = true

    try {
        await authStore.login({
            email: email.value.trim(),
            password: password.value,
        })
        await router.push({ name: 'dashboard' })
    } catch (error: unknown) {
        formError.value = getApiErrorMessage(error, 'E-mail ou senha inválidos.')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <BaseCard class="login-card">
        <form class="login-form" novalidate @submit.prevent="handleLogin">
            <header>
                <h1>Entrar no Gestor Tech</h1>
                <p>Acesse o ambiente de gestão de projetos.</p>
            </header>

            <BaseInput
                id="email"
                v-model="email"
                type="email"
                name="email"
                label="E-mail"
                placeholder="voce@exemplo.com"
                autocomplete="username"
                :error="fieldErrors.email"
                :disabled="isLoading"
                required
            />

            <BaseInput
                id="password"
                v-model="password"
                type="password"
                name="password"
                label="Senha"
                placeholder="Digite sua senha"
                autocomplete="current-password"
                :error="fieldErrors.password"
                :disabled="isLoading"
                required
            />

            <p v-if="formError" class="form-error" role="alert">
                {{ formError }}
            </p>

            <BaseButton type="submit" :disabled="isLoading" :aria-busy="isLoading">
                {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </BaseButton>
        </form>
    </BaseCard>
</template>

<style scoped>
.login-card {
    width: min(100% - 32px, 440px);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

header p {
    color: var(--color-text-secondary);
}

.form-error {
    color: var(--color-danger);
    font-size: 0.875rem;
}
</style>
