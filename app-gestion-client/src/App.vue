<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref, watch, type Ref, inject } from 'vue'
import { getUserData } from './utils/getUserData'
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

  <div class="container-fluid">
    <div class="row flex-nowrap">
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0">
        <div
          class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
        >
          <a
            href="/"
            class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span class="fs-5 d-none d-sm-inline">Menu</span>
          </a>
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <li class="nav-item">
              <a href="#" class="nav-link align-middle px-0">
                <i class="fs-4 bi-house"></i> <span class="ms-1 d-none d-sm-inline">Home</span>
              </a>
            </li>
            <li>
              <a href="#submenu1" data-bs-toggle="collapse" aria-expanded="true" class="nav-link px-0 align-middle"
              >
                <i class="fs-4 bi-speedometer2"></i>
                <span class="ms-1 d-none d-sm-inline">Registro</span>
              </a> 
              <ul class="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                <li class="w-100">
                  <RouterLink to="/alta-usuario" v-if="adminMode" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Nuevo Usuario</span>
                  </RouterLink>
                </li>
                <li class="w-100">
                  <RouterLink to="/alta-alumno" v-if="adminMode" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Nuevo Alumno</span>
                  </RouterLink>
                </li>
                <li class="w-100">
                  <RouterLink to="/alta-profesor" v-if="adminMode" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Nuevo Profesor</span>
                  </RouterLink>
                </li>
                <li class="w-100">
                  <RouterLink to="/alta-asignatura" v-if="adminMode" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Nueva Asignatura</span>
                  </RouterLink>
                </li>
                <li class="w-100">
                  <RouterLink
                    to="/alta-asignatura-profesor"
                    v-if="adminMode"
                    class="nav-link px-0"
                  >
                    <span class="d-none d-sm-inline">Nueva Asignación</span>
                  </RouterLink>
                </li>
                <li class="w-100">
                  <RouterLink
                    to="/matricula"
                    v-if="adminMode"
                    class="nav-link px-0"
                  >
                    <span class="d-none d-sm-inline">Nueva Matrícula</span>
                  </RouterLink>
                </li>
              </ul>
            </li> 

            <li>
              <a href="#" class="nav-link px-0 align-middle">
                <i class="fs-4 bi-table"></i> 
                <span class="ms-1 d-none d-sm-inline">Orders</span>
                </a
              >
            </li>
            <li>
              <a href="#submenu2" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
                <i class="fs-4 bi-bootstrap"></i>
                <span class="ms-1 d-none d-sm-inline">Bootstrap</span></a
              >
              <ul class="collapse nav flex-column ms-1" id="submenu2" data-bs-parent="#menu">
                <li class="w-100">
                  <a href="#" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Item</span> 1</a
                  >
                </li>
                <li>
                  <a href="#" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Item</span> 2</a
                  >
                </li>
              </ul>
            </li>
            <li>
              <a href="#submenu3" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
                <i class="fs-4 bi-grid"></i> <span class="ms-1 d-none d-sm-inline">Products</span>
              </a>
              <ul class="collapse nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
                <li class="w-100">
                  <a href="#" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Product</span> 1</a
                  >
                </li>
                <li>
                  <a href="#" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Product</span> 2</a
                  >
                </li>
                <li>
                  <a href="#" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Product</span> 3</a
                  >
                </li>
                <li>
                  <a href="#" class="nav-link px-0">
                    <span class="d-none d-sm-inline">Product</span> 4</a
                  >
                </li>
              </ul>
            </li>
            <li>
              <a href="#" class="nav-link px-0 align-middle">
                <i class="fs-4 bi-people"></i>
                <span class="ms-1 d-none d-sm-inline">Customers</span>
              </a>
            </li>
          </ul>
          <hr />
          <div v-if="userEmail" class="dropdown pb-4">
            <a
              href="#"
              class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="https://github.com/mdo.png"
                alt="hugenerd"
                width="30"
                height="30"
                class="rounded-circle"
              />
              <span class="d-none d-sm-inline mx-1">{{ userEmail }}</span>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-dark text-small shadow"
              aria-labelledby="dropdownUser1"
            >
              <li><a class="dropdown-item" href="#">Profile</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a v-if="!userEmail" class="dropdown-item" @click="">LogIn</a>
                <a class="dropdown-item" @click="cerrarSesion">LogOut</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div> 
  <nav>
    <!-- <RouterLink to="/home">Home</RouterLink> -->
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/alta-usuario" v-if="adminMode">Nuevo Usuario</RouterLink>
    <RouterLink to="/alta-alumno" v-if="adminMode">Alta Alumno</RouterLink>
    <RouterLink to="/alta-profesor" v-if="adminMode">Alta Profesor</RouterLink>
    <RouterLink to="/alta-asignatura" v-if="adminMode">Alta Asignatura</RouterLink>
    <RouterLink to="/alta-asignatura-profesor" v-if="adminMode"
      >Alta Asignatura-Profesor</RouterLink
    >
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
[class='col-auto col-md-3 col-xl-2 px-sm-2 px-0'] {
  background-color: grey;
  width: 200px;
}
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
  /* adding: 0 1rem;
  border-left: 1px solid var(--color-border);  */
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
