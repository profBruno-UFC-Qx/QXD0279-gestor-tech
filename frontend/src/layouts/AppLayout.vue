<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<template>
    <div class="app-layout">
        <Sidebar />
        <section class="content">
            <Navbar />
            <main class="page-content">
                <router-view v-slot="{ Component, route }">
                    <Transition name="fade-slide" mode="out-in">
                        <component :is="Component" :key="route.fullPath.split('?')[0]" />
                    </Transition>
                </router-view>
            </main>
        </section>
    </div>
</template>

<style scoped>
.app-layout { display: grid; min-height: 100vh; grid-template-columns: var(--sidebar-width) minmax(0, 1fr); }
.content { min-width: 0; background: var(--color-background); }
.page-content { width: min(var(--content-max-width), 100%); margin: 0 auto; padding: var(--space-8) clamp(20px, 3vw, 36px) var(--space-12); }
@media (max-width: 1024px) { .app-layout { grid-template-columns: var(--sidebar-collapsed-width) minmax(0, 1fr); } }
@media (max-width: 680px) { .app-layout { display: block; } .page-content { padding: var(--space-6) var(--space-4) 96px; } }
</style>
