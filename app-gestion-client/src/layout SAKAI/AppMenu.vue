<script setup lang="ts">
import { inject, onMounted, ref, type Ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import { useLoadingStore } from '@/stores/loading'
import { useAdminStore } from '@/stores/isAdmin';
import type { VueCookies } from 'vue-cookies';
import router from '@/router'


interface MenuItem {
  label?: string;
  separator?: boolean;
  items?: MenuItem[];
  icon?: string;
  to?: string;
  url?: string;
  target?: string;
  class?: string;
  badge?: string;
  preventExact?: boolean;
}

const model = ref<MenuItem[]>([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
  },
  {
    label: 'Registrar',
    items: [
      { label: 'Nuevo Usuario', icon: 'pi pi-fw pi-plus', to: '/alta-usuario' },
      { label: 'Nuevo Alumno', icon: 'pi pi-fw pi-plus', to: '/alta-alumno' },
      { label: 'Nuevo Profesor', icon: 'pi pi-fw pi-plus', to: '/alta-profesor' },
      { label: 'Nueva Asignatura', icon: 'pi pi-fw pi-plus', to: '/alta-asignatura' },
      { label: 'Nueva Asignación', icon: 'pi pi-fw pi-plus', to: '/alta-asignatura-profesor', class: 'rotated-icon' },
      { label: 'Nueva Matrícula', icon: 'pi pi-fw pi-plus', to: '/matricula' },
    ]
  },
  {
    label: 'Listado',
    items: [
      { label: 'Listado Usuarios', icon: 'pi pi-fw pi-list', to: '/listado-usuarios' },
      { label: 'Listado Alumnos', icon: 'pi pi-fw pi-table', to: '/listado-alumnos' },
      { label: 'Listado Profesores', icon: 'pi pi-fw pi-pencil', to: '/listado-profesores' },
      { label: 'Listado Asignaturas', icon: 'pi pi-fw pi-plus', to: '/listado-asignaturas' },
      { label: 'Listadio Asignaciones', icon: 'pi pi-fw pi-plus', to: '/listado-asignaciones', class: 'rotated-icon' },
      { label: 'Listado Matrículas', icon: 'pi pi-fw pi-plus', to: '/listado-matriculas' },
    ]
  },
  {
    separator: true,
  },
  {
    label: 'Perfil',
    icon: 'pi pi-fw pi-briefcase',
    to: '/pages',
    items: [
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        to: '/login'
      },
    ]

  },

]);

// FUNCION LOADING SPINNER
const loadingStore = useLoadingStore() // store de Pinia para el Spinner
let isLoading: Ref<boolean> = ref(loadingStore.isLoading) // uso la variable de estado en la store de LoadingStore de Pinia

// LEER LA COOKIE Y VER EMAIL Y PERMISOS
let userEmail: Ref<string | null> = ref(null)
const $cookies = inject<VueCookies>('$cookies')
const isAdminStore = useAdminStore()
let adminMode: Ref<boolean> = ref(isAdminStore.isAdmin)

//BORRAR LA COOKIE
const cerrarSesion = async () => {
  try {
    loadingStore.loadingTrue()
    await new Promise((resolve) => setTimeout(resolve, 4000))
    deleteCookie('user')
    localStorage.removeItem('email')
    router.push({
      path: '/login' // redireccionamos a /login
    })
    setTimeout(() => {
      location.reload()
    }, 100)
  } catch (error) {
    console.log('Error en la solicitud:', error)
  } finally {
    loadingStore.loadingFalse()
  }
}
const deleteCookie = (user: string) => {
  document.cookie = `${user}=; max-age=0` //expires=Thu, 01 Jan 1970 00:00:00 UTC`
}

onMounted(() => {
  userEmail.value = localStorage.getItem('email') // accedo al valor email del localStorage
  const userCookie = $cookies?.get('user')
  if (userCookie.permiso === 9) {
    adminMode.value = isAdminStore.isAdminTrue()
  } else {
    adminMode.value = isAdminStore.isAdminFalse()
  }
})
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
.menu-separator {
  border: 0.3px solid rgb(200, 200, 200);
}
</style>
