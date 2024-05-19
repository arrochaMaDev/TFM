<script setup lang="ts">
import { useAdminStore } from '@/stores/isAdmin';
import { inject, onMounted, onUnmounted, ref, type Ref } from 'vue';
import type { VueCookies } from 'vue-cookies';
import { useLoggedStore } from '@/stores/isLogged';
import { useDashboardStore } from '@/stores/isDashboard';
import Image from 'primevue/image';


import router from '@/router';

// VERIFICAR SI SE ES ADMINISTRADOR
const $cookies = inject<VueCookies>('$cookies')

const loggedStore = useLoggedStore()
const dashboardStore = useDashboardStore()

const isLogged: Ref<boolean> = ref(false)
const user: Ref<{
  email: string | undefined,
  username: string | undefined,
  isValid: string | undefined,
  permiso: string | undefined,
  id: string | undefined
}> = ref({
  email: undefined,
  username: undefined,
  isValid: undefined,
  permiso: undefined,
  id: undefined,
})

const adminStore = useAdminStore()


onMounted(() => {
  isLogged.value = loggedStore.isLogged
  dashboardStore.isDashboardTrue()
  user.value = $cookies?.get('user')
  if (user.value) {
    console.log('Cookie value:', user.value);
    isLogged.value = loggedStore.isLoggedTrue()
    isLogged.value = true
  } else {
    router.push('/login')
    console.log('Cookie "user" no encontrada');
  }

  const userCookie = $cookies?.get('user') // si no existe, userCookie es null
  // console.log(userCookie)
  if (userCookie?.permiso == '9') {
    adminStore.isAdminTrue()
  }
  if (userCookie?.permiso == null || userCookie?.permiso != '9') {
    adminStore.isAdminFalse()
  }
  if (userCookie?.permiso == '0' || userCookie?.permiso == '1') { // es alumno o profesor
    router.push(`usuario/${user.value.id}`)
  }

})

onUnmounted(() => {
  dashboardStore.isDashboardFalse()
})

</script>

<template>
  <div id="container" class="flex justify-content-center">
    <img src="../utils/img/logo.png" class="w-8" />
    <div class="flex align-items-center justify-content-center overflow-hidden">
      <!-- overflow-hidden ????-->
    </div>

    <div id="card profile usuario">

    </div>

    <div id="card profile alumno">

    </div>

  </div>

</template>

<style scoped></style>
