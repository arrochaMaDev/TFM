<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Popup from './Popup.vue'
import AltaAlumno from './AltaAlumno.vue'
import { useLoadingStore } from '@/stores/loading'
import { useEditingStore } from '@/stores/editar'
// import { getStudentsData } from '@/utils/peticionesFetch'

const router = useRouter() // router para ir al alumno cuando se clique en él
const loadingStore = useLoadingStore() // store del Spinner

// OBTENER DATOS DE TODOS LOS USUARIOS
let usersRefFromServer: Ref<
  {
    id: number
    username: string
    email: string
    permiso: number
  }[]
> = ref([])

const getUsersData = async () => {
  try {
    const response = await fetch('http://localhost:3000/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = (await response.json()) as {
        id: number
        username: string
        email: string
        permiso: number
      }[]
      usersRefFromServer.value = data
      console.log(data)
      console.log(usersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  }
}

// ORDENAR RESULTADOS POR VALOR QUE SE INDIQUE
// let arrayOrdenado: Ref<
//   {
//     id: number
//     username: string
//     email: string
//     pass: string
//     permiso: number
//   }[]
// > = ref([]) // Nuevo array Ref para ordenar la lsta según se indique

let ordenarPor: Ref<'id' | 'username' | 'email' | 'permiso' | 'email'> = ref('id')

const ordenarArray = () => {
  // arrayOrdenado.value = [...usersRefFromServer.value]
  const valor = ordenarPor.value

  usersRefFromServer.value.sort((a, b) => {
    const valorA = a[valor].toString().toLowerCase()
    const valorB = b[valor].toString().toLowerCase()
    if (valor === 'id') {
      return a[valor] - b[valor]
    } else {
      if (valorA < valorB) {
        return -1
      }
      if (valorA > valorB) {
        return 1
      }
      return 0
    }
  })
}

onMounted(() => {
  ordenarArray()
  getUsersData()
})

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
// LÓGICA BORRAR ALUMNO
let popupVisible: Ref<boolean> = ref(false) // ref para ocultar o mostrar el popup
let idAlumnoSeleccionado: Ref<number | null> = ref(null) // ref del id del alumno seleccionado para borrar

const borrarAlumno = async () => {
  // funcion con async/await y try/catch en vez de fetch con .then y .catch
  try {
    const response = await fetch(`http://localhost:3000/student/${idAlumnoSeleccionado.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      loadingStore.loadingTrue()
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert('Alumno borrado con éxito')
      popupVisible.value = false
      getUsersData()
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
    popupVisible.value = false
  } finally {
    loadingStore.loadingFalse()
  }
}

const cancelarBorrar = () => {
  // si se da click en NO se cancela el borrado
  popupVisible.value = false
  idAlumnoSeleccionado.value = null
}

const mostrarPopup = (id: number) => {
  // si se da click en SI, se muestra el popup y recibe el id del alumno a borrar
  idAlumnoSeleccionado.value = id
  popupVisible.value = true
}

// LÓGICA EDITAR ALUMNO
const editingStore = useEditingStore() // store del componente editar Alumno

let popUpState: Ref<boolean> = ref(editingStore.editarFalse()) // variable del estado del popUp
console.log(popUpState.value)

let alumnoEditar: Ref<
  | {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
  | undefined
> = ref(undefined)

const editarAlumno = (student: any) => {
  // popUpState.value = true
  editingStore.editarTrue()
  alumnoEditar.value = student
  // fetch para obtener los datos del alumno
  fetch(`http://localhost:3000/student/${alumnoEditar.value?.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then(async (response) => {
    const data = (await response.json()) as {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
    alumnoEditar.value = data
    console.table(data)
  })
}

const mostrarAltaAlumno = () => {
  // popUpState.value = true
  popUpState.value = editingStore.editarTrue()
  console.log(popUpState.value)
}

const resetearPopUpState = () => {
  // popUpState.value = false
  popUpState.value = editingStore.editarFalse()
  console.log(popUpState.value)
}

// Ir a la página idividual del alumno
const goToStudent = (id: number) => {
  router.push({
    path: `/alumno/${id}`
  })
}
</script>
<template>
  <div class="container">
    <div id="ordenarPor">
      <label for="ordenarPor">Ordenar por:</label>
      <select v-model="ordenarPor" @change="ordenarArray">
        <option value="username">Username</option>
        <option value="email">Email</option>
        <option value="pass">Pass</option>
        <option value="permiso">Permiso</option>
      </select>
    </div>
    <div>
      <table id="tabla">
        <th colspan="3"><h3>LISTADO DE USUARIOS</h3></th>
        <tr>
          <th>
            <h3>Username</h3>
          </th>
          <th>
            <h3>Email</h3>
          </th>
          <th>
            <h3>Permiso</h3>
          </th>
        </tr>
        <tr id="user" v-for="user in usersRefFromServer" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ obtenerPermisoString(user.permiso) }}</td>
          <!-- llamo a la funcion obtenerPermiso para que me obtenga el number y me genere el texto para mostrarlo -->
          <td>
            <button type="button" @click="goToStudent(user.id)">Ver</button>
          </td>
          <td>
            <button type="button" @click="editarAlumno(user), mostrarAltaAlumno()">Editar</button>
          </td>
          <td><button type="button" @click="mostrarPopup(user.id)">Borrar</button></td>
          <!-- le paso el id del alumno que quiero borrar -->
        </tr>
      </table>
    </div>
    <Popup v-if="popupVisible" @confirmar="borrarAlumno" @cancelar="cancelarBorrar"></Popup>
    <!-- recibo un emit de confirmar que ejecuta la funcion borrarAlumno y otro emit de cancelar que ejecuta cancelarBorrar -->
    <AltaAlumno
      v-if="popUpState"
      :isEditing="popUpState"
      @cerrarPopUp="resetearPopUpState"
      @obtenerAlumnos="getUsersData()"
      @resetearAlumno="editarAlumno(alumnoEditar)"
      :alumnoParaEditar="alumnoEditar"
    >
      <!-- para resetear valores, recibo un emit y vuelvo a ejecutar la funcion editarAlumnos con los parámetros recibidos del componente hijo-->
    </AltaAlumno>
  </div>
</template>
<style scoped>
#ordenarPor {
  margin: 0px;
}
table {
  margin-top: 0px;
  width: max-content;
  border: none;

  & th {
    background-color: rgb(79, 90, 86);
  }
  & td {
    width: fit-content;
    text-align: left;
    vertical-align: top;
    border: none;
    border-spacing: 0;
  }
}

table tr:hover td {
  transition: background-color 0.5s;
  background-color: rgb(106, 98, 53);
}

table tr:hover td:nth-last-child(-n + 3) {
  background-color: initial;
}

button {
  width: 50px;
  height: 25px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: 1px solid hsla(160, 100%, 37%, 1);
  border-radius: 5px;
  margin: 1px;
  cursor: pointer;
}
</style>
