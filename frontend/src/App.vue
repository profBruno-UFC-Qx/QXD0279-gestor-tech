<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
    <Toaster position="top-right" :duration="3600" close-button />
    <router-view />
</template>
