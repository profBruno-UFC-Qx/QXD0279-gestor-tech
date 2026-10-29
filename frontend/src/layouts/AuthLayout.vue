<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import type { IconName } from '@/types/Ui'

const features: Array<{ title: string; description: string; icon: IconName }> = [
    { title: 'Projetos centralizados', description: 'Planeje escopo, datas e status em um único lugar.', icon: 'projects' },
    { title: 'Equipe alinhada', description: 'Organize membros e responsabilidades de cada entrega.', icon: 'team' },
    { title: 'Atividades sob controle', description: 'Defina prioridades, responsáveis e prazos com clareza.', icon: 'activities' },
    { title: 'Progresso visível', description: 'Acompanhe indicadores, pendências e atrasos do projeto.', icon: 'dashboard' },
]
</script>

<template>
    <div class="auth-layout">
        <aside class="auth-aside" aria-label="Gestor Tech">
            <router-link :to="{ name: 'login' }" class="brand"><img src="/Logo%20Gestor%20Tech%20com%20Foguete%20Branco.png" alt="Gestor Tech"></router-link>
            <div class="aside-copy">
                <span class="eyebrow">Workspace de projetos</span>
                <h1>Clareza para planejar.<br>Foco para entregar.</h1>
                <p>Organize projetos, pessoas e atividades em um espaço simples e consistente.</p>
            </div>
            <svg class="geometric-illustration" viewBox="0 0 360 300" fill="none" aria-hidden="true">
                <rect class="illustration-board" x="38" y="44" width="276" height="204" rx="28" />
                <path class="illustration-line" d="M72 91h208M72 126h88M72 161h132M72 196h76" />
                <rect class="illustration-card" x="190" y="108" width="94" height="70" rx="14" />
                <circle class="illustration-dot" cx="213" cy="132" r="7" />
                <path class="illustration-check" d="m207 155 7 7 14-17" />
                <circle class="illustration-orbit" cx="284" cy="66" r="28" />
                <circle class="illustration-orbit" cx="62" cy="232" r="18" />
            </svg>
            <div class="feature-grid" aria-label="Funcionalidades do Gestor Tech">
                <article v-for="feature in features" :key="feature.title" class="feature-card">
                    <span class="feature-icon"><AppIcon :name="feature.icon" :size="20" /></span>
                    <div><h2>{{ feature.title }}</h2><p>{{ feature.description }}</p></div>
                </article>
            </div>
        </aside>
        <main class="auth-main">
            <router-view v-slot="{ Component, route }">
                <Transition name="fade-slide" mode="out-in"><component :is="Component" :key="route.name" /></Transition>
            </router-view>
        </main>
    </div>
</template>

<style scoped>
.auth-layout { display: grid; min-height: 100vh; grid-template-columns: minmax(420px, .92fr) minmax(480px, 1.08fr); background: var(--color-background); }
.auth-aside { position: relative; display: flex; min-height: 100vh; flex-direction: column; overflow: hidden; padding: clamp(32px, 5vw, 64px); background: linear-gradient(145deg, var(--color-sidebar), #223d83 62%, var(--color-primary)); color: var(--color-white); }
.auth-aside::before, .auth-aside::after { position: absolute; border: 1px solid rgba(255, 255, 255, .1); border-radius: 50%; content: ''; }
.auth-aside::before { top: -180px; right: -120px; width: 420px; height: 420px; }
.auth-aside::after { right: -70px; bottom: -220px; width: 520px; height: 520px; border-width: 80px; }
.brand { position: relative; z-index: 1; display: block; width: fit-content; }
.brand img { display: block; width: 200px; max-width: 100%; height: auto; }
.aside-copy { position: relative; z-index: 1; max-width: 560px; margin-top: clamp(56px, 10vh, 100px); }
.eyebrow { display: block; margin-bottom: var(--space-4); color: rgba(255, 255, 255, .72); font-size: var(--font-size-caption); font-weight: var(--font-weight-bold); letter-spacing: .1em; text-transform: uppercase; }
.aside-copy h1 { color: var(--color-white); font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1.14; }
.aside-copy p { max-width: 480px; margin-top: var(--space-5); color: rgba(255, 255, 255, .76); font-size: 1rem; }
.geometric-illustration { position: absolute; z-index: 0; top: clamp(112px, 17vh, 180px); right: clamp(-90px, -4vw, -30px); width: clamp(260px, 31vw, 420px); opacity: .22; transform: rotate(-4deg); }
.illustration-board { fill: rgba(255, 255, 255, .05); stroke: rgba(255, 255, 255, .7); stroke-width: 2; }
.illustration-line { stroke: rgba(255, 255, 255, .55); stroke-linecap: round; stroke-width: 8; }
.illustration-card { fill: rgba(255, 255, 255, .14); stroke: rgba(255, 255, 255, .8); stroke-width: 2; }
.illustration-dot { fill: var(--color-chart-aqua); }
.illustration-check { stroke: var(--color-white); stroke-linecap: round; stroke-linejoin: round; stroke-width: 5; }
.illustration-orbit { stroke: rgba(255, 255, 255, .55); stroke-dasharray: 5 7; stroke-width: 2; }
.feature-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); margin-top: clamp(40px, 8vh, 72px); }
.feature-card { display: flex; min-width: 0; align-items: flex-start; gap: var(--space-3); padding: var(--space-4); border: 1px solid rgba(255, 255, 255, .14); border-radius: var(--radius-lg); background: rgba(255, 255, 255, .08); backdrop-filter: blur(8px); }
.feature-icon { display: grid; width: 38px; height: 38px; place-items: center; flex: 0 0 auto; border-radius: var(--radius-md); background: rgba(255, 255, 255, .14); color: var(--color-white); }
.feature-card h2 { color: var(--color-white); font-size: var(--font-size-card-title); }
.feature-card p { margin-top: 3px; color: rgba(255, 255, 255, .7); font-size: var(--font-size-caption); line-height: 1.45; }
.auth-main { display: grid; min-height: 100vh; place-items: center; padding: var(--space-8); }
@media (max-width: 900px) { .auth-layout { grid-template-columns: 1fr; } .auth-aside { display: none; } }
@media (max-width: 520px) { .auth-main { align-items: start; padding: var(--space-6) var(--space-4); } }
</style>
