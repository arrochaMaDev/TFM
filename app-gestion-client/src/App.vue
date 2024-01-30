<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref, watch, type Ref, inject } from 'vue'
import router from './router'
import Spinner from './components/Spinner.vue'
import { useLoadingStore } from './stores/loading'
import { useAdminStore } from './stores/isAdmin'
import type { VueCookies } from 'vue-cookies'



// FUNCION LOADING SPINNER
const loadingStore = useLoadingStore() // store de Pinia para el Spinner
let isLoading: Ref<boolean> = ref(loadingStore.isLoading) // uso la variable de estado en la store de LoadingStore de Pinia

onMounted(() => {
  // Establece la referencia reactiva para seguir el estado de carga
  watch(
    () => loadingStore.isLoading,
    (value) => {
      isLoading.value = value
    }
  )
})

// LEER LA COOKIE Y VER EMAIL Y PERMISOS
// let userData: any = undefined
let userEmail: Ref<string | null> = ref(null)
const $cookies = inject<VueCookies>('$cookies')
const isAdminStore = useAdminStore()
let adminMode: Ref<boolean> = ref(isAdminStore.isAdmin)

onMounted(() => {
  userEmail.value = localStorage.getItem('email') // accedo al valor email del localStorage
  const userCookie = $cookies?.get('user')
  if (userCookie.permiso === 9) {
    adminMode.value = isAdminStore.isAdminTrue()
  } else {
    adminMode.value = isAdminStore.isAdminFalse()
  }
})

// userData = getUserData
//////////

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
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" /> -->


  <nav>
    <!-- <RouterLink to="/home">Home</RouterLink> -->
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/alta-usuario" v-if="adminMode">Nuevo Usuario</RouterLink>
    <RouterLink to="/alta-alumno" v-if="adminMode">Alta Alumno</RouterLink>
    <RouterLink to="/alta-profesor" v-if="adminMode">Alta Profesor</RouterLink>
    <RouterLink to="/alta-asignatura" v-if="adminMode">Alta Asignatura</RouterLink>
    <RouterLink to="/alta-asignatura-profesor" v-if="adminMode">Alta Asignatura-Profesor</RouterLink>
    <RouterLink to="/matricula" v-if="adminMode">Matricula</RouterLink>
    <RouterLink to="/buscador-alumno" v-if="adminMode">Buscar Alumnos</RouterLink>
    <RouterLink to="/listado-usuarios" v-if="adminMode">Listado Usuarios</RouterLink>
    <RouterLink to="/listado-alumnos" v-if="adminMode">Listado Alumnos</RouterLink>
    <RouterLink to="/listado-profesores" v-if="adminMode">Listado Profesores</RouterLink>
    <RouterLink to="/listado-asignaciones" v-if="adminMode">Listado Asignaciones</RouterLink>
    <RouterLink to="/listado-matriculas" v-if="adminMode">Listado Matriculas</RouterLink>
    <div v-if="userEmail">
      <!-- Si existe userEmail en localStorage, muestro un mensaje de bienvenida y un botón de logout-->
      <hr />
      <a>Bienvenido {{ userEmail }}</a>
      <a @click="cerrarSesion">LogOut</a>
    </div>
  </nav>


  <!-- </div>
  </header> -->
  <RouterView />
  <Spinner v-if="isLoading"></Spinner>
</template>

<style scoped>
.nav-link span {
  color: black;
}

i {
  color: black;
}


header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}

hr {
  border: 1px solid #ccc;
  margin: 10px 0;
  width: 50%;
}
</style>
