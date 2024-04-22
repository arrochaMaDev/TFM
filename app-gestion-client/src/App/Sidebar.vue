<script setup lang="ts">
import Menu from 'primevue/menu';
import { inject, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import type { VueCookies } from 'vue-cookies';
import { useLoggedStore } from '@/stores/isLogged';
import { useAdminStore } from '@/stores/isAdmin';

const loggedStore = useLoggedStore()

const router = useRouter()
const $cookies = inject<VueCookies>('$cookies');

// VERIFICAR SI SE ES ADMINISTRADOR
const adminStore = useAdminStore()

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



// Log-out
const deleteCookie = () => {
  $cookies?.remove('user')
  loggedStore.isLoggedFalse()
  router.push('/login')

}

const menuItems1 = ref([
  {
    label: 'HOME',
    items: [{
      label: 'Dashboard', icon: 'pi pi-home', to: '/'
    }]
  },
  {
    label: 'NUEVO',
    items: [
      { label: 'Nuevo Usuario', icon: 'pi pi-plus', to: '/alta-usuario' },
      { label: 'Nuevo Profesor', icon: 'pi pi-plus', to: '/alta-profesor' },
      { label: 'Nueva Asignatura', icon: 'pi pi-plus', to: '/alta-asignatura' },
      { label: 'Nuevo Alumno', icon: 'pi pi-plus', to: '/alta-alumno' },
    ]
  },
  {
    label: 'ASIGNAR',
    items: [
      { label: 'Nueva asignación', icon: 'pi pi-arrow-right-arrow-left', to: '/alta-asignatura-profesor' },
      { label: 'Nueva Matrícula', icon: 'pi pi-book', to: '/alta-matricula' },
    ]
  },
  {
    label: 'LISTADOS',
    items: [
      {
        label: 'Listado Usuarios', icon: 'pi pi-list', to: '/listado-usuarios'
      },
      { label: 'Listado Alumnos', icon: 'pi pi-list', to: '/listado-alumnos' },
      { label: 'Listado Profesores', icon: 'pi pi-list', to: '/listado-profesores' },
      { label: 'Listado Asignaturas', icon: 'pi pi-list', to: '/listado-asignaturas' },
      { label: 'Listado Asignaciones', icon: 'pi pi-list', to: '/listado-asignaciones' },
      { label: 'Listado Matriculas', icon: 'pi pi-list', to: '/listado-matriculas' }
    ]
  },
  // {
  //   label: 'BUSCADOR',
  //   items: [
  //     { label: 'Buscar Alumno', icon: 'pi pi-search', to: '/buscador-alumno' },
  //   ],
  // },
  {
    label: 'SETTINGS',
    items: [

      {
        label: 'Cerrar Sesión', icon: 'pi pi-fw pi-id-card', to: '/login', command: () => {
          deleteCookie()
        }
      },
    ]
  },
])

const menuItems2 = ref([
  {
    label: 'HOME',
    items: [{
      label: 'Dashboard', icon: 'pi pi-home', to: '/'
    }]
  },
  {
    label: 'SETTINGS',
    items: [

      {
        label: 'Cerrar Sesión', icon: 'pi pi-fw pi-id-card', to: '/login', command: () => {
          deleteCookie()
        }
      },
    ]
  },
])

</script>

<template>
  <Menu :model="adminStore.isAdmin ? menuItems1 : menuItems2" class="">
    <template #item="{ item, props }">
      <RouterLink :to="item.to" :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]" :style="item.style" role="">
        <!-- <a v-ripple class="flex align-items-center" v-bind="props.action">  desactivado ripple   -->
        <a class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </RouterLink>
    </template>
  </Menu>
</template>

<style scoped></style>
