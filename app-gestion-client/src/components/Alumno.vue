<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import Popup from './Popup.vue'
import Matricula from './AltaMatricula.vue'
import { useEditingStore } from '@/stores/editar'

const router = useRouter()

const props = defineProps<{
  studentData: {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: string
    email: string
  }
}>()

let studentIdRef: Ref<number | undefined> = ref(undefined) // Puede ser number o undefined y el valor por defecto es undefined

let studentDataFromServer = ref(props.studentData) // datos del estudiante de la base de datos que se pasan como props

studentIdRef.value = Number(router.currentRoute.value.params.id)
const studentId = Number(router.currentRoute.value.params.id)
console.log(studentId)
console.log(router.currentRoute.value.params['id'])

// OBTENER DATOS DEL ESTUDIANTE
const getStudentData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/student/${studentIdRef.value}`, {
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
        usuario_id: string
        nombre: string
        apellidos: string
        dni: string
        direccion: string
        telefono: string
        email: string
      }
      studentDataFromServer.value = data
      console.log(data)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  }
}
getStudentData()

// LÓGICA BORRAR ALUMNO
const borrarAlumno = async () => {
  // funcion con async/await y try/catch en vez de fetch con .then y .catch
  try {
    const response = await fetch(`http://localhost:3000/student/${studentIdRef.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      alert('Alumno borrado con éxito')
      router.push('/listado_alumnos')
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

// OBTENER MATRICULAS DEL ALUMNO
let matriculaFromServer: Ref<{
  student: {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: string
    email: string
  }
  matriculas: {
    id: number
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      nombre: string
      apellidos: string
      asignaturas: string
    }
    year: number
  }[]
} | null> = ref(null)

const getMatriculasData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/matriculas/student/${studentIdRef.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 404) {
      // Si da 404 es que no hay matricula en la BD
      console.log('No se encontró matricula en el servidor')
      return // sale de la función sin entrar en el bloque catch
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      matriculaFromServer.value = data
      console.log(data)
      console.dir(matriculaFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  }
}
getMatriculasData()

// LÓGICA BORRAR MATRICULA
let popupVisible: Ref<boolean> = ref(false) // ref para ocultar o mostrar el popup
let idMatriculaSeleccionada: Ref<number | null> = ref(null) // ref del id de la matricula seleccionado para borrar

const borrarMatricula = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/matricula/${idMatriculaSeleccionada.value}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.status === 204) {
      alert('Matricula borrada con éxito')
      popupVisible.value = false
      getMatriculasData()
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
    popupVisible.value = false
  }
}
const cancelarBorrar = () => {
  // si se da click en NO se cancela el borrado
  popupVisible.value = false
  idMatriculaSeleccionada.value = null
}

const mostrarPopup = (id: number) => {
  // si se da click en SI, se muestra el popup y recibe el id del alumno a borrar
  idMatriculaSeleccionada.value = id
  popupVisible.value = true
}

// LÓGICA EDITAR MATRICULA
const editingStore = useEditingStore() // store del componente editar Alumno

let popUpState: Ref<boolean> = ref(editingStore.editarFalse()) // variable del estado del popUp
console.log(popUpState.value)

let matriculaEditar: Ref<
  | {
    id: number
    student: {
      id: number
      nombre: string
      apellidos: string
      dni: string
    }
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      nombre: string
      apellidos: string
    }
  }
  | undefined
> = ref(undefined)

const editarMatricula = (matricula: any) => {
  // popUpState.value = true
  editingStore.editarTrue()
  matriculaEditar.value = matricula
  // fetch para obtener los datos del alumno
  fetch(`http://localhost:3000/matricula/${matriculaEditar.value?.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then(async (response) => {
    const data = (await response.json()) as {
      id: number
      student: {
        id: number
        nombre: string
        apellidos: string
        dni: string
      }
      subject: {
        id: number
        nombre: string
      }
      teacher: {
        id: number
        nombre: string
        apellidos: string
      }
    }
    matriculaEditar.value = data
    console.table(data)
  })
}

const mostrarMatricula = () => {
  // popUpState.value = true
  popUpState.value = editingStore.editarTrue()
  console.log(popUpState.value)
}

const resetearPopUpState = () => {
  // popUpState.value = false
  popUpState.value = editingStore.editarFalse()
  console.log(popUpState.value)
}
</script>

<template>
  <div v-if="studentDataFromServer">
    <h2>Detalle del Alumno</h2>
    <ul>
      <p>Usuario_id: {{ studentDataFromServer.usuario_id }}</p>
      <p>Nombre: {{ studentDataFromServer.nombre }}</p>
      <p>Apellidos: {{ studentDataFromServer.apellidos }}</p>
      <p>DNI: {{ studentDataFromServer.dni }}</p>
      <p>Direccion: {{ studentDataFromServer.direccion }}</p>
      <p>telefono: {{ studentDataFromServer.telefono }}</p>
      <p>Email: {{ studentDataFromServer.email }}</p>
    </ul>
    <div>
      <table id="tabla" v-if="matriculaFromServer">
        <th colspan="3">
          <h3>MATRICULAS</h3>
        </th>
        <tr>
          <th>Curso Escolar</th>
          <th>
            <h3>Asignatura</h3>
          </th>
          <th>
            <h3>Profesor</h3>
          </th>
        </tr>
        <tr id="alumno" v-for="matricula in matriculaFromServer?.matriculas" :key="matricula.id">
          <td>{{ matricula.year }} / {{ matricula.year + 1 }}</td>
          <td>{{ matricula.subject.nombre }}</td>
          <td>{{ matricula.teacher.nombre + ' ' + matricula.teacher.apellidos }}</td>
          <td>
            <button type="button" @click="editarMatricula(matricula), mostrarMatricula()">
              Editar
            </button>
          </td>
          <td><button type="button" @click="mostrarPopup(matricula.id)">Borrar</button></td>
        </tr>
      </table>
    </div>
    <Popup v-if="popupVisible" @confirmar="borrarMatricula" @cancelar="cancelarBorrar"></Popup>
    <Matricula v-if="popUpState" :isEditing="popUpState" @cerrarPopUp="resetearPopUpState" @obtenerMatriculas="getMatriculasData()" @resetearMatricula="editarMatricula(matriculaEditar)"
      :matriculaParaEditar="matriculaEditar">
    </Matricula>
    <button type="button" @click="confirmacionBorrar">Borrar alumno</button>
    <div v-show="confirmacionEliminar">
      <!-- Este div se muestra para confirmar el borrado  -->
      <h4>¿Estás seguro que quieres borrar el alumno?</h4>
      <button type="button" id="borrarAlumno" @click="borrarAlumno">Si</button>
      <button type="button" @click="confirmacionBorrar">No</button>
    </div>
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
  width: auto;
  height: 25px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: 1px solid hsla(160, 100%, 37%, 1);
  border-radius: 5px;
  margin: 1px;
  cursor: pointer;
}
</style>
