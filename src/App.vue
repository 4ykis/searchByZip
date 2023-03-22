<script setup lang="ts">
    import Header from './components/header/Header.vue'
</script>

<template>
    <div class="bg-zinc-700 min-h-screen">
        <div class="header">
            <Header />
        </div>
        <div class="page ">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped>
    @import "@/style.css";
</style>
