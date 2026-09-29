<template>
    <main class="not-found">
        <p class="code">404</p>
        <h1>Página não encontrada</h1>
        <p>O endereço informado não existe.</p>
        <router-link :to="{ name: 'login' }">Voltar para o início</router-link>
    </main>
</template>

<style scoped>
.not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    text-align: center;
}

.code {
    color: var(--color-primary);
    font-size: 4rem;
    font-weight: 700;
}

a {
    color: var(--color-primary);
    font-weight: 600;
}

a:hover {
    text-decoration: underline;
}
</style>
