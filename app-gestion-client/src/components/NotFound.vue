<script setup lang="ts">
import router from '@/router';
import Button from 'primevue/button'
import { useDashboardStore } from '@/stores/isDashboard';
import { onMounted, onUnmounted } from 'vue';

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.isDashboardTrue()
})

onUnmounted(() => {
  dashboardStore.isDashboardFalse()
})

const inicio = () => {
  router.push('/')
}

</script>
<template>
  <div class="card mt-4 text-center">
    <img src="../utils/error-404.png" alt="error-image" />
    <h1 class="text-800 text-6xl">UPS! Error 404 Página No encontrada!</h1>
    <Button class="w-auto m-5 text-xl" severity="primary" @click="inicio()">Volver a inicio</Button>
  </div>
</template>

<style scoped></style>
