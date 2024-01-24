<script setup>
import { ref, onMounted } from 'vue'
import AppMenuItem from './AppMenuItem.vue';
import VueCookies from 'vue-cookies';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Registrar',
        items: [
            { label: 'Nuevo Usuario', icon: 'pi pi-fw pi-plus', to: 'alta-usuario' },
            { label: 'Nuevo Alumno', icon: 'pi pi-fw pi-plus', to: '/alta-alumno' },
            { label: 'Nuevo Profesor', icon: 'pi pi-fw pi-plus', to: 'alta-profesor' },
            { label: 'Nueva Asignatura', icon: 'pi pi-fw pi-plus', to: 'alta-asignatura' },
            { label: 'Nueva Asignación', icon: 'pi pi-fw pi-plus', to: 'alta-asignatura-profesor', class: 'rotated-icon' },
            { label: 'Nueva Matrícula', icon: 'pi pi-fw pi-plus', to: 'matricula' },
        ]
    },
    {
        label: 'Listado',
        items: [
            { label: 'Listado Usuarios', icon: 'pi pi-fw pi-list', to: 'listado-usuarios' },
            { label: 'Listado Alumnos', icon: 'pi pi-fw pi-table', to: '/listado-alumnos' },
            { label: 'Listado Profesores', icon: 'pi pi-fw pi-pencil', to: 'listado-profesores' },
            { label: 'Listado Asignaturas', icon: 'pi pi-fw pi-plus', to: 'listado-asignaturas' },
            { label: 'Listadio Asignaciones', icon: 'pi pi-fw pi-plus', to: 'listado-asignaciones', class: 'rotated-icon' },
            { label: 'Listado Matrículas', icon: 'pi pi-fw pi-plus', to: 'listado-matriculas' },
        ]
    },
    {
        label: 'Perfil',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Logout',
                icon: 'pi pi-fw pi-sign-out',
                to: '/auth/login'
            },
            {
                separator: true,
            }
        ]
    },
]);

let userEmail = ref(null)


onMounted(() => {
    userEmail.value = localStorage.getItem('email');
    const userCookie = VueCookies.VueCookies.get('user')
    console.log('Cookie:', userCookie);


    if (userCookie) {
        // Aquí puedes acceder a las propiedades de la cookie
        console.log('Cookie:', userCookie);
    }
});

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator">
            </li>
        </template>
        <li v-ripple class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" shape="circle" />
            <span class="inline-flex flex-column">
                <span class="font-bold">{{ userEmail }}</span>
                <span class="text-sm">Admin</span>
            </span>
        </li>
        <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
.menu-separator {
    border: 0.3px solid rgb(200, 200, 200);
}
</style>
