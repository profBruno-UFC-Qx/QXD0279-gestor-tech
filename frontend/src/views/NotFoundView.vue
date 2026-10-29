<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
</script>

<template>
    <main class="not-found">
        <span class="icon"><AppIcon name="search" :size="24" /></span>
        <span class="code">404</span>
        <h1>Página não encontrada</h1>
        <p>O endereço informado não existe ou foi movido.</p>
        <router-link :to="{ name: 'dashboard' }">Voltar ao dashboard <AppIcon name="arrow-right" :size="16" /></router-link>
    </main>
</template>

<style scoped>
.not-found { display: flex; min-height: 100vh; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-3); padding: var(--space-6); background: var(--color-background); text-align: center; }.icon { display: grid; width: 52px; height: 52px; place-items: center; border-radius: var(--radius-lg); background: var(--color-primary-soft); color: var(--color-primary); }.code { margin-top: var(--space-2); color: var(--color-primary); font-family: var(--font-heading); font-size: var(--font-size-caption); font-weight: var(--font-weight-bold); letter-spacing: .12em; }.not-found h1 { font-size: var(--font-size-page-title); }.not-found p { color: var(--color-text-secondary); }.not-found a { display: inline-flex; min-height: var(--control-height); align-items: center; gap: var(--space-2); padding: 10px 16px; margin-top: var(--space-3); border-radius: var(--radius-md); background: var(--color-primary); color: var(--color-white); font-weight: var(--font-weight-semibold); }
</style>
