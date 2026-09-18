<script setup lang="ts">
import Sidebar from '../components/layout/Sidebar.vue'
import Navbar from '../components/layout/Navbar.vue'
</script>

<template>
    <div class="dashboard-layout">
        <Sidebar />

        <section class="content">
            <Navbar />

            <main class="page-content">
                <router-view />
            </main>
        </section>
    </div>
</template>

<style scoped>
.dashboard-layout {
    display:flex;
    min-height:100vh;
}
.content {
    flex:1;
}
.page-content {
    padding:24px;
}
</style>