<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Popup from './Popup.vue'
import AltaProfesor from './AltaProfesor.vue'
import { useLoadingStore } from '@/stores/loading'
import { useEditingStore } from '@/stores/editar'

const router = useRouter() // router para ir al alumno cuando se clique en él
const loadingStore = useLoadingStore() // store del Spinner

// OBTENER DATOS DE TODOS LOS PROFESORES
let teachersRefFromServer: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    email: string
  }[]
> = ref([])

const getTeachersData = async () => {
  try {
    const response = await fetch('http://localhost:3000/teachers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      loadingStore.loadingTrue()
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const data = (await response.json()) as {
        id: number
        usuario_id: string
        nombre: string
        apellidos: string
        email: string
      }[]
      teachersRefFromServer.value = data
      console.log(data)
      console.log(teachersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    loadingStore.loadingFalse()
  }
}

// ORDENAR RESULTADOS POR VALOR QUE SE INDIQUE
// let arrayOrdenado: Ref<
//   {
//     id: number
//     usuario_id: string
//     nombre: string
//     apellidos: string
//     email: string
//   }[]
// > = ref([]) // Nuevo array Ref para ordenar la lsta según se indique

let ordenarPor: Ref<'id' | 'nombre' | 'apellidos' | 'email'> = ref('id')

const ordenarArray = () => {
  // arrayOrdenado.value = [...teachersRefFromServer.value]
  const valor = ordenarPor.value

  teachersRefFromServer.value.sort((a, b) => {
    if (valor === 'id') {
      return a[valor] - b[valor]
    } else {
      const valorA = a[valor].toLowerCase()
      const valorB = b[valor].toLowerCase()
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
  getTeachersData()
})

// LÓGICA BORRAR PROFESOR
let popupVisible: Ref<boolean> = ref(false) // ref para ocultar o mostrar el popup
let idProfesorSeleccionado: Ref<number | null> = ref(null) // ref del id del alumno a borrar

const borrarProfesor = async () => {
  // funcion con async/await y try/catch en vez de fetch con .then y .catch
  try {
    const response = await fetch(`http://localhost:3000/teacher/${idProfesorSeleccionado.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      loadingStore.loadingTrue()
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert('Profesor borrado con éxito')
      popupVisible.value = false
      getTeachersData()
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
  // si se da click en no se cancela el borrado
  popupVisible.value = false
  idProfesorSeleccionado.value = null
}

const mostrarPopup = (id: number) => {
  // si se da click en si, se muestra el popup y recibe el id del alumnoi a borrar
  idProfesorSeleccionado.value = id
  popupVisible.value = true
}

// LÓGICA EDITAR PROFESOR
const editingStore = useEditingStore() // store del componente editar Profesor

let popUpState: Ref<boolean> = ref(editingStore.editarFalse()) // variable del estado del popUp
console.log(popUpState.value)

let profesorEditar: Ref<
  | {
      id: number
      nombre: string
      apellidos: string
      email: string
      asignaturas: string
    }
  | undefined
> = ref(undefined)

const editarProfesor = (teacher: any) => {
  // popUpState.value = true
  editingStore.editarTrue()
  profesorEditar.value = teacher
  // fetch para obtener los datos del alumno
  fetch(`http://localhost:3000/teacher/${profesorEditar.value?.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then(async (response) => {
    const data = (await response.json()) as {
      id: number
      nombre: string
      apellidos: string
      email: string
      asignaturas: string
    }
    profesorEditar.value = data
    console.table(data)
  })
}
const mostrarAltaProfesor = () => {
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
const goToTeacher = (id: number) => {
  router.push({
    path: `/profesor/${id}`
  })
}
</script>
<template>
  <div class="container">
    <div id="ordenarPor">
      <label for="ordenarPor">Ordenar por:</label>
      <select v-model="ordenarPor" @change="ordenarArray">
        <option value="nombre">Nombre</option>
        <option value="apellidos">Apellidos</option>
        <option value="email">Email</option>
      </select>
    </div>
    <div>
      <table id="tabla">
        <th colspan="3"><h3>LISTADO DE PROFESORES</h3></th>
        <tr>
          <th>
            <h3>Nombre</h3>
          </th>
          <th>
            <h3>Apellidos</h3>
          </th>
          <th>
            <h3>Email</h3>
          </th>
        </tr>
        <tr id="alumno" v-for="teacher in teachersRefFromServer" :key="teacher.id">
          <td>{{ teacher.nombre }}</td>
          <td>{{ teacher.apellidos }}</td>
          <td>{{ teacher.email }}</td>
          <td>
            <button type="button" @click="goToTeacher(teacher.id)">Ver</button>
          </td>
          <td>
            <button type="button" @click="editarProfesor(teacher), mostrarAltaProfesor()">
              Editar
            </button>
          </td>
          <td><button type="button" @click="mostrarPopup(teacher.id)">Borrar</button></td>
          <!-- le paso el id que quiero borrar -->
        </tr>
      </table>
    </div>
    <Popup v-if="popupVisible" @confirmar="borrarProfesor" @cancelar="cancelarBorrar"></Popup>
    <!-- recibo un emit de confirmar que ejecuta la funcion borrarAlumno y otro emit de cancelar que ejecuta cancelarBorrar -->
    <AltaProfesor
      v-if="popUpState"
      :isEditing="popUpState"
      @cerrarPopUp="resetearPopUpState"
      @obtenerProfesores="getTeachersData()"
      @resetearProfesor="editarProfesor(profesorEditar)"
      :profesorParaEditar="profesorEditar"
    ></AltaProfesor>
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

table tr:hover td:nth-last-child(-n + 2) {
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
