<script setup lang="ts">
import { ref } from 'vue'

import BaseInput from '../../components/ui/BaseInput.vue'
import BaseButton from '../../components/ui/BaseButton.vue'
import BaseCard from '../../components/ui/BaseCard.vue'

const email = ref('')
const password = ref('')

function handleLogin(){

    console.log({
        email:email.value,
        password:password.value
    })

}
</script>

<template>
    <BaseCard>

        <h1>
            Entrar no Gestor Tech
        </h1>

        <BaseInput
            v-model="email"
            label="Email"
            placeholder="Digite seu email"
        />

        <BaseInput
            v-model="password"
            label="Senha"
            placeholder="Digite sua senha"
        />

        <BaseButton
            @click="handleLogin"
        >
            Entrar
        </BaseButton>

    </BaseCard>
</template>