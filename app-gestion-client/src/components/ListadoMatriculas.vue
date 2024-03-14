<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Popup from './Popup.vue'
import Matricula from './AltaMatricula.vue'
import { useLoadingStore } from '@/stores/loading'
import { useEditingStore } from '@/stores/editar'

const router = useRouter() // router para ir al alumno cuando se clique en él
const loadingStore = useLoadingStore() // store del Spinner

// OBTENER DATOS DE TODOS LOS ESTUDIANTES
let matriculasRefFromServer: Ref<
  {
    id: number
    student: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      email: string
      asignaturas: string | null
    }
    year: number
  }[]
> = ref([])

const getMatriculasData = async () => {
  try {
    const response = await fetch('http://localhost:3000/matriculas', {
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
      matriculasRefFromServer.value = data
      console.log(data)
      console.log(matriculasRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    loadingStore.loadingFalse()
  }
}

// ORDENAR RESULTADOS POR VALOR QUE SE INDIQUE
let ordenarPor: Ref<
  | 'year'
  | 'student.nombre'
  | 'student.apellidos'
  | 'student.dni'
  | 'subject.nombre'
  | 'teacher.nombre'
> = ref('year')

const ordenarMatriculas = () => {
  function eliminarTildes(elemento: string): string {
    return elemento.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  const matriculasOrdenadas = matriculasRefFromServer.value.slice().sort((a, b) => {
    let valorA = ''
    let valorB = ''

    if (ordenarPor.value === 'year') {
      valorA = a.year.toString()
      valorB = b.year.toString()
    }
    if (ordenarPor.value === 'student.nombre') {
      valorA = eliminarTildes(a.student.nombre.toLowerCase())
      valorB = eliminarTildes(b.student.nombre.toLowerCase())
    } else if (ordenarPor.value === 'student.apellidos') {
      valorA = eliminarTildes(a.student.apellidos.toLowerCase())
      valorB = eliminarTildes(b.student.apellidos.toLowerCase())
      console.log('ordenado')
    } else if (ordenarPor.value === 'student.dni') {
      valorA = eliminarTildes(a.student.dni.toLowerCase())
      valorB = eliminarTildes(b.student.dni.toLowerCase())
    } else if (ordenarPor.value === 'subject.nombre') {
      valorA = eliminarTildes(a.subject.nombre.toLowerCase())
      valorB = eliminarTildes(b.subject.nombre.toLowerCase())
    } else if (ordenarPor.value === 'teacher.nombre') {
      valorA = eliminarTildes(a.teacher.nombre.toLowerCase())
      valorB = eliminarTildes(b.teacher.nombre.toLowerCase())
    }

    if (valorA < valorB) {
      return -1
    }
    if (valorA > valorB) {
      return 1
    }
    return 0
  })
  matriculasRefFromServer.value = matriculasOrdenadas
}
onMounted(() => {
  ordenarMatriculas()
  getMatriculasData()
})

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
    if (response.ok) {
      loadingStore.loadingTrue()
      await new Promise((resolve) => setTimeout(resolve, 2000))
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
  } finally {
    loadingStore.loadingFalse()
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

let matriculaEditar: Ref<{
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
} | null> = ref(null)

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
      <select v-model="ordenarPor" @change="ordenarMatriculas()">
        <option value="year">Curso Escolar</option>
        <option value="student.nombre">Nombre Alumno</option>
        <option value="student.apellidos">Apellidos Alumno</option>
        <option value="student.dni">DNI</option>
        <option value="subject.nombre">Asignatura</option>
        <option value="teacher.nombre">Nombre Profesor</option>
      </select>
    </div>
    <div>
      <table id="tabla">
        <th colspan="5">
          <h3>LISTADO DE MATRICULAS</h3>
        </th>
        <tr>
          <th>Curso Escolar</th>
          <th>
            <h3>Nombre</h3>
          </th>
          <th>
            <h3>Apellidos</h3>
          </th>
          <th>
            <h3>DNI</h3>
          </th>
          <th>
            <h3>Asignatura</h3>
          </th>
          <th>
            <h3>Profesor</h3>
          </th>
        </tr>
        <tr id="alumno" v-for="matricula in matriculasRefFromServer" :key="matricula.id">
          <td>{{ matricula.year }} / {{ matricula.year + 1 }}</td>
          <td>{{ matricula.student.nombre }}</td>
          <td>{{ matricula.student.apellidos }}</td>
          <td>{{ matricula.student.dni }}</td>
          <td>{{ matricula.subject.nombre }}</td>
          <td>{{ matricula.teacher.nombre + ' ' + matricula.teacher.apellidos }}</td>
          <td>
            <button type="button" @click="goToStudent(matricula.student.id)">Ver</button>
          </td>
          <td>
            <button type="button" @click="editarMatricula(matricula), mostrarMatricula()">
              Editar
            </button>
          </td>
          <td><button type="button" @click="mostrarPopup(matricula.id)">Borrar</button></td>
          <!-- le paso el id del alumno que quiero borrar -->
        </tr>
      </table>
    </div>

    <Popup v-if="popupVisible" @confirmar="borrarMatricula" @cancelar="cancelarBorrar"></Popup>
    <!-- recibo un emit de confirmar que ejecuta la funcion borrarAlumno y otro emit de cancelar que ejecuta cancelarBorrar -->
    <Matricula v-if="popUpState" :isEditing="popUpState" @cerrarPopUp="resetearPopUpState" @obtenerMatriculas="getMatriculasData()" @resetearMatricula="editarMatricula(matriculaEditar)"
      :matriculaParaEditar="matriculaEditar">
      <!-- para resetear valores, recibo un emit y vuelvo a ejecutar la funcion editarAlumnos con los parámetros recibidos del componente hijo -->
    </Matricula>
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
