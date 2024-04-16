<script setup lang="ts">
import Menu from 'primevue/menu';
import { ref } from 'vue';


const menuItems = ref([
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

      { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-id-card', to: '/login' },
    ]
  },
])

</script>

<template>
  <Menu :model="menuItems" class="">
    <template #item="{ item, props }">
      <RouterLink :to="item.to" :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]" :style="item.style" role="">
        <a v-ripple class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </RouterLink>
    </template>
  </Menu>
</template>

<style scoped></style>
