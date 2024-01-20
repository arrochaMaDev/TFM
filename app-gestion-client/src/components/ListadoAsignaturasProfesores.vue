<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Popup from './Popup.vue'
import AltaAsignaturaProfesor from './AltaAsignaturaProfesor.vue'
import { useLoadingStore } from '@/stores/loading'
import { useEditingStore } from '@/stores/editar'

const router = useRouter() // router para ir al alumno cuando se clique en él
const loadingStore = useLoadingStore() // store del Spinner

// OBTENER DATOS DE TODAS LAS ASIGNACIONES
let subjectsTeachersRefFromServer: Ref<
  {
    id: number
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      nombre: string
      apellidos: string
      email: string
    }
  }[]
> = ref([])

const getSubjectsTeachersData = async () => {
  try {
    const response = await fetch('http://localhost:3000/asignaturas_profesores', {
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
      const data = await response.json()
      subjectsTeachersRefFromServer.value = data
      console.log(data)
      console.log(subjectsTeachersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    loadingStore.loadingFalse()
  }
}

// ORDENAR RESULTADOS POR VALOR QUE SE INDIQUE
let ordenarPor: Ref<'teacher.nombre' | 'teacher.apellidos' | 'subject.nombre'> =
  ref('teacher.nombre')

const ordenarMatriculas = () => {
  function eliminarTildes(elemento: string): string {
    return elemento.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  const datosOrdenados = subjectsTeachersRefFromServer.value.slice().sort((a, b) => {
    let valorA = ''
    let valorB = ''

    if (ordenarPor.value === 'teacher.nombre') {
      valorA = eliminarTildes(a.teacher.nombre.toLowerCase())
      valorB = eliminarTildes(b.teacher.nombre.toLowerCase())
    } else if (ordenarPor.value === 'teacher.apellidos') {
      valorA = eliminarTildes(a.teacher.apellidos.toLowerCase())
      valorB = eliminarTildes(b.teacher.apellidos.toLowerCase())
      console.log('ordenado')
    } else if (ordenarPor.value === 'subject.nombre') {
      valorA = eliminarTildes(a.subject.nombre.toLowerCase())
      valorB = eliminarTildes(b.subject.nombre.toLowerCase())
    }

    if (valorA < valorB) {
      return -1
    }
    if (valorA > valorB) {
      return 1
    }
    return 0
  })
  subjectsTeachersRefFromServer.value = datosOrdenados
}
onMounted(() => {
  ordenarMatriculas()
  getSubjectsTeachersData()
})

// LÓGICA BORRAR ASIGNACIÓN
let popupVisible: Ref<boolean> = ref(false) // ref para ocultar o mostrar el popup
let idSubjectTeacherSelected: Ref<number | null> = ref(null) // ref del id seleccionado para borrar

const borrarSubjectTeacher = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/asignatura_profesor/${idSubjectTeacherSelected.value}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.ok) {
      // loadingStore.loadingTrue()
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      alert('Realizado con éxito')
      popupVisible.value = false
      getSubjectsTeachersData()
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
    popupVisible.value = false
  }
  // finally {
  //   loadingStore.loadingFalse()
  // }
}

const cancelarBorrar = () => {
  // si se da click en NO se cancela el borrado
  popupVisible.value = false
  idSubjectTeacherSelected.value = null
}

const mostrarPopup = (id: number) => {
  // si se da click en SI, se muestra el popup y recibe el id a borrar
  idSubjectTeacherSelected.value = id
  popupVisible.value = true
}

// LÓGICA EDITAR MATRICULA
const editingStore = useEditingStore() // store del componente editar Alumno

let popUpState: Ref<boolean> = ref(editingStore.editarFalse()) // variable del estado del popUp
console.log(popUpState.value)

let subjectTeacherEditar: Ref<
  | {
      id: number
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

const editarSubjectTeacher = (subjectTeacher: any) => {
  // popUpState.value = true
  editingStore.editarTrue()
  subjectTeacherEditar.value = subjectTeacher
  // fetch para obtener los datos del alumno
  fetch(`http://localhost:3000/asignatura_profesor/${subjectTeacherEditar.value?.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then(async (response) => {
    const data = (await response.json()) as {
      id: number
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
    subjectTeacherEditar.value = data
    console.table(data)
  })
  getSubjectsTeachersData()
}

const mostrarSubjectTeacher = () => {
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
      <select v-model="ordenarPor" @change="ordenarMatriculas()">
        <option value="teacher.nombre">Nombre Profesor</option>
        <option value="teacher.apellidos">Apellidos Profesor</option>
        <option value="subject.nombre">Asignatura</option>
      </select>
    </div>
    <div>
      <table id="tabla">
        <th colspan="3"><h3>LISTADO DE ASIGNACIONES</h3></th>
        <tr>
          <th>
            <h3>Nombre</h3>
          </th>
          <th>
            <h3>Apellidos</h3>
          </th>
          <th>
            <h3>Asignatura</h3>
          </th>
        </tr>
        <tr
          id="alumno"
          v-for="subjectTeacher in subjectsTeachersRefFromServer"
          :key="subjectTeacher.id"
        >
          <td>{{ subjectTeacher.teacher.nombre }}</td>
          <td>{{ subjectTeacher.teacher.apellidos }}</td>
          <td>{{ subjectTeacher.subject.nombre }}</td>
          <td>
            <button type="button" @click="goToTeacher(subjectTeacher.teacher.id)">Ver</button>
          </td>
          <td>
            <button
              type="button"
              @click="editarSubjectTeacher(subjectTeacher), mostrarSubjectTeacher()"
            >
              Editar
            </button>
          </td>
          <td>
            <button type="button" @click="mostrarPopup(subjectTeacher.id)">Borrar</button>
          </td>
          <!-- le paso el id que quiero borrar -->
        </tr>
      </table>
    </div>

    <Popup v-if="popupVisible" @confirmar="borrarSubjectTeacher" @cancelar="cancelarBorrar"></Popup>
    <!-- recibo un emit de confirmar que ejecuta la funcion borrarAlumno y otro emit de cancelar que ejecuta cancelarBorrar -->
    <AltaAsignaturaProfesor
      v-if="popUpState"
      :isEditing="popUpState"
      @cerrarPopUp="resetearPopUpState"
      @obtenerSubjectsTeachers="getSubjectsTeachersData()"
      @resetearSubjectTeacher="editarSubjectTeacher(subjectTeacherEditar)"
      :subjectTeacherParaEditar="subjectTeacherEditar"
    >
      <!-- para resetear valores, recibo un emit y vuelvo a ejecutar la funcion editarAlumnos con los parámetros recibidos del componente hijo -->
    </AltaAsignaturaProfesor>
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
