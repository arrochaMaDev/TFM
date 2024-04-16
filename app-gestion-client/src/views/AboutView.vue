<script setup lang="ts">
import { useAdminStore } from '@/stores/isAdmin';
import { inject, onMounted } from 'vue';
import type { VueCookies } from 'vue-cookies';

// VERIFICAR SI SE ES ADMINISTRADOR
const adminStore = useAdminStore()
const $cookies = inject<VueCookies>('$cookies')

onMounted(() => {
  const userCookie = $cookies?.get('user') // si no existe, userCookie es null
  // console.log(userCookie)
  if (userCookie?.permiso == '9') {
    adminStore.isAdminTrue()
  }
  else if (userCookie?.permiso == null || userCookie?.permiso != '9') {
    adminStore.isAdminFalse()
  }
})

</script>

<template>
  <div class="flex justify-content-center">
    <img src="../utils/img/loading.png" class="w-8" />
  </div>
</template>

<style></style>
