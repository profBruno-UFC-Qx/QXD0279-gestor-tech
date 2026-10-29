<template>
    <div class="auth-layout">
        <aside class="auth-aside" aria-label="Gestor Tech">
            <router-link :to="{ name: 'login' }" class="brand"><span class="brand-mark"><span /><span /><span /></span>Gestor <strong>Tech</strong></router-link>
            <div class="aside-copy">
                <span class="eyebrow">Workspace de projetos</span>
                <h1>Clareza para planejar.<br>Foco para entregar.</h1>
                <p>Organize projetos, pessoas e atividades em um espaço simples e consistente.</p>
            </div>
            <p class="aside-note">Ambiente acadêmico com autenticação e persistência simuladas no navegador.</p>
        </aside>
        <main class="auth-main">
            <router-view v-slot="{ Component, route }">
                <Transition name="fade-slide" mode="out-in"><component :is="Component" :key="route.name" /></Transition>
            </router-view>
        </main>
    </div>
</template>

<style scoped>
.auth-layout { display: grid; min-height: 100vh; grid-template-columns: minmax(360px, 0.86fr) minmax(480px, 1.14fr); background: var(--color-background); }
.auth-aside { position: relative; display: flex; min-height: 100vh; flex-direction: column; overflow: hidden; padding: clamp(32px, 5vw, 64px); border-right: 1px solid var(--color-border); background: var(--color-surface-subtle); }
.auth-aside::after { position: absolute; right: -120px; bottom: -160px; width: 360px; height: 360px; border: 72px solid var(--color-primary-soft); border-radius: 50%; content: ''; }
.brand { position: relative; z-index: 1; display: flex; align-items: center; gap: var(--space-3); width: fit-content; font-family: var(--font-heading); font-size: 1.0625rem; font-weight: var(--font-weight-semibold); }
.brand strong { color: var(--color-primary); }
.brand-mark { display: flex; width: 34px; height: 34px; align-items: flex-end; justify-content: center; gap: 3px; padding: 8px; border-radius: var(--radius-md); background: var(--color-primary); }
.brand-mark span { width: 3px; border-radius: 4px; background: var(--color-white); }
.brand-mark span:nth-child(1) { height: 8px; opacity: .75; }.brand-mark span:nth-child(2) { height: 17px; }.brand-mark span:nth-child(3) { height: 12px; opacity: .85; }
.aside-copy { position: relative; z-index: 1; max-width: 520px; margin-block: auto; }
.eyebrow { display: block; margin-bottom: var(--space-4); color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-bold); letter-spacing: .1em; text-transform: uppercase; }
.aside-copy h1 { font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1.14; }
.aside-copy p { max-width: 460px; margin-top: var(--space-5); color: var(--color-text-secondary); font-size: 1rem; }
.aside-note { position: relative; z-index: 1; max-width: 450px; color: var(--color-text-muted); font-size: var(--font-size-caption); }
.auth-main { display: grid; min-height: 100vh; place-items: center; padding: var(--space-8); }
@media (max-width: 900px) { .auth-layout { grid-template-columns: 1fr; } .auth-aside { display: none; } }
@media (max-width: 520px) { .auth-main { align-items: start; padding: var(--space-6) var(--space-4); } }
</style>
