<script setup lang="ts">
const menuItems = [
    {
        name: 'Dashboard',
        path: '/dashboard'
    },
    {
        name: 'Projetos',
        path: '/projects'
    },
    {
        name: 'Atividades',
        path: '/tasks'
    },
    {
        name: 'Riscos',
        path: '/risks'
    }
]
</script>

<template>
    <aside class="sidebar">
        <div class="brand">
            Gestor Tech
        </div>

        <nav class="menu">
            <router-link
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="menu-item"
            >
                {{ item.name }}
            </router-link>
        </nav>
    </aside>
</template>

<style scoped>
.sidebar {
    width:260px;
    min-height:100vh;
    padding:24px;
    background:#ffffff;
    border-right:1px solid #e5e7eb;
}
.brand {
    font-size:20px;
    font-weight:700;
    margin-bottom:32px;
}
.menu {
    display:flex;
    flex-direction:column;
    gap:8px;
}
.menu-item {
    padding:12px;
    border-radius:8px;
    color:#374151;
    text-decoration:none;
}
.menu-item.router-link-active {
    background:#2563eb;
    color:white;
}
</style>