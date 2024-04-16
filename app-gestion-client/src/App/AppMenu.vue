<script setup lang="ts">
import * as Vue from 'vue';
import AppSubmenu from '@/App/AppSubmenu.vue';
import type { MenuItem } from 'primevue/menuitem';
import { G } from "@/G";
import type { VueCookies } from 'vue-cookies';
import { inject, onMounted, ref, type Ref } from 'vue';
import router from '@/router';


const $cookies = Vue.inject<VueCookies>('$cookies');

// Log-out
const deleteCookie = async () => {
    await $cookies?.remove('user')
    router.push('/login')

}

const $emit = defineEmits(['menuitem-click']);

const onMenuItemClick = (event: MouseEvent) => {
    $emit('menuitem-click', event);
}

let menuArray: MenuItem[] = [
    {
        label: 'Home',
        items: [{
            label: 'Dashboard', icon: 'pi pi-home', to: '/'
        }]
    },
    {
        label: 'Nuevo',
        items: [
            { label: 'Nuevo Usuario', icon: 'pi pi-plus', to: '/alta-usuario' },
            { label: 'Nuevo Profesor', icon: 'pi pi-plus', to: '/alta-profesor' },
            { label: 'Nueva Asignatura', icon: 'pi pi-plus', to: '/alta-asignatura' },
            { label: 'Nuevo Alumno', icon: 'pi pi-plus', to: '/alta-alumno' },
        ]
    },
    {
        label: 'Asignar',
        items: [
            { label: 'Nueva asignación', icon: 'pi pi-arrow-right-arrow-left', to: '/alta-asignatura-profesor' },
            { label: 'Nueva Matrícula', icon: 'pi pi-book', to: '/alta-matricula' },
        ]
    },
    {
        label: 'Listados',
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
    {
        label: 'Buscador',
        items: [
            { label: 'Buscar Alumno', icon: 'pi pi-search', to: '/buscador-alumno' },
        ],
    },
    // {
    //     separator: true
    // },
    {
        label: 'Settings',
        items: [
            // { label: 'Settings', icon: 'pi pi-cog' },
            // { label: 'Usuario', icon: 'pi pi-users', to: `/usuario/${user.id}` },
            {
                label: 'Cerrar Sesión', icon: 'pi pi-fw pi-id-card', command() {
                    deleteCookie()
                },
                to: '/login'
            },
        ]
    },

];

const menu = Vue.ref(menuArray);


</script>

<template>
    <div class="layout-menu-container">
        <AppSubmenu :items="menu" class="layout-menu" :root="true" @menuitem-click="onMenuItemClick" />
    </div>
</template>
