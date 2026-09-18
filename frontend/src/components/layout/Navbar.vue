<script setup lang="ts">
import UserMenu from './UserMenu.vue'
</script>

<template>
    <header class="navbar">
        <span>
            Dashboard
        </span>

        <div class="actions">
            <UserMenu />
        </div>
    </header>
</template>

<style scoped>
.navbar {
    height:70px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding:0 24px;
    background:#ffffff;
    border-bottom:1px solid #e5e7eb;
}
</style>