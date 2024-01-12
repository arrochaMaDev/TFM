<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  userData: {
    id: number
    username: string
    email: string
    pass: string
    permiso: number
  }
}>()

// OBTENER PERMISO A STRING
const obtenerPermisoString = (permiso: number) => {
  switch (permiso) {
    case 0:
      return 'Alumno'
    case 1:
      return 'Profesor'
    case 9:
      return 'Administrador'
    default:
      return 'Desconocido'
  }
}

let userIdRef: Ref<number | undefined> = ref(undefined) // Puede ser number o undefined y el valor por defecto es undefined

let userDataFromServer = ref(props.userData) // datos del estudiante de la base de datos que se pasan como props

userIdRef.value = Number(router.currentRoute.value.params.id)
const userId = Number(router.currentRoute.value.params.id)
console.log(userId)
console.log(router.currentRoute.value.params['id'])

fetch(`http://localhost:3000/usuario/${userIdRef.value}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
}).then(async (response) => {
  const data = (await response.json()) as {
    id: number
    username: string
    email: string
    pass: string
    permiso: number
  }
  userDataFromServer.value = data
  console.log(data)
})

// LÓGICA BORRAR USUARIO
const borrarUsuario = async () => {
  try {
    const response = await fetch(`http://localhost:3000/usuario/${userIdRef.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      alert('Usuario borrado con éxito')
      router.push('/listado-usuarios')
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  }
}

let confirmacionEliminar: Ref<boolean> = ref(false)
const confirmacionBorrar = () => {
  // funcion para confirmar el borrado mostrando un div para seleccionar si o no
  confirmacionEliminar.value = !confirmacionEliminar.value
}
// OBTENER ALUMNOS MATRICULADOS CON EL PROFESOR
</script>

<template>
  <div v-if="userDataFromServer">
    <h2>Detalle del Usuario</h2>
    <p>Username: {{ userDataFromServer.username }}</p>
    <p>Email: {{ userDataFromServer.email }}</p>
    <p>Pass: {{ userDataFromServer.pass }}</p>
    <p>Permiso: {{ obtenerPermisoString(userDataFromServer.permiso) }}</p>
    <button type="button" @click="confirmacionBorrar">Borrar usuario</button>
    <div v-show="confirmacionEliminar">
      <!-- Este div se muestra para confirmar el borrado  -->
      <h4>¿Estás seguro que quieres borrar el usuario?</h4>
      <button type="button" @click="borrarUsuario">Si</button>
      <button type="button" @click="confirmacionBorrar">No</button>
    </div>
  </div>
</template>

<style>
table {
  margin-top: 50px;
  width: 300px;
  border: 1px solid #ffffff;

  & th {
    background-color: rgb(79, 90, 86);
  }

  & td {
    width: fit-content;
    text-align: center;
    vertical-align: top;
    border: 1px solid #ffffff;
    border-spacing: 0;
  }
}

button {
  margin-top: 10px;
  width: 120px;
  height: 25px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: 1px solid hsla(160, 100%, 37%, 1);
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
}
</style>
