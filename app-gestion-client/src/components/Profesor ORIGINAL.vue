<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  teacherData: {
    id: number
    nombre: string
    apellidos: string
    email: string
    asignaturas: string
  }
}>()

let teacherIdRef: Ref<number | undefined> = ref(undefined) // Puede ser number o undefined y el valor por defecto es undefined

let teacherDataFromServer = ref(props.teacherData) // datos del estudiante de la base de datos que se pasan como props

teacherIdRef.value = Number(router.currentRoute.value.params.id)
const teacherId = Number(router.currentRoute.value.params.id)
console.log(teacherId)
console.log(router.currentRoute.value.params['id'])

fetch(`http://localhost:3000/teacher/${teacherIdRef.value}`, {
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
  teacherDataFromServer.value = data
  console.log(data)
})

// LÓGICA BORRAR PROFESOR
const borrarProfesor = async () => {
  try {
    const response = await fetch(`http://localhost:3000/teacher/${teacherIdRef.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      alert('Profesor borrado con éxito')
      router.push('/listado-profesores')
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

// OBTENER ASIGNATURAS DEL PROFESOR
let subjectsByTeacherIdFromServer: Ref<{
  teacher: {
    id: number
    nombre: string
    apellidos: string
    asignaturas: string
  }
  asignaturas: {
    id: number
    subject: {
      id: number
      nombre: string
    }
  }[]
} | null> = ref(null)

const getSubjectsByTeacherData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/asignaturas_profesores/teacher/${teacherIdRef.value}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      // loadingStore.loadingTrue()
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      const data = await response.json()
      subjectsByTeacherIdFromServer.value = data
      console.log(data)
      console.log(subjectsByTeacherIdFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  }
  // finally {
  //   loadingStore.loadingFalse()
  // }
}
getSubjectsByTeacherData()

// OBTENER ALUMNOS MATRICULADOS CON EL PROFESOR
let matriculasRefFromServer: Ref<{
  teacher: {
    id: number
    nombre: string
    apellidos: string
    asignaturas: string
  }
  matriculas: {
    id: number
    student: {
      id: number
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: string
      email: string
    }
    subject: {
      id: number
      nombre: string
    }
    year: number
  }[]
} | null> = ref(null)

const getMatriculasData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/matriculas/teacher/${teacherIdRef.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      // loadingStore.loadingTrue()
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      const data = await response.json()
      matriculasRefFromServer.value = data
      console.log(data)
      console.log(matriculasRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  }
  // finally {
  //   loadingStore.loadingFalse()
  // }
}
getMatriculasData()
</script>

<template>
  <div v-if="teacherDataFromServer">
    <h2>Detalle del Profesor</h2>
    <p>Nombre: {{ teacherDataFromServer.nombre }}</p>
    <p>Apellidos: {{ teacherDataFromServer.apellidos }}</p>
    <p>Email: {{ teacherDataFromServer.email }}</p>
    <div>
      <table id="tabla" v-if="subjectsByTeacherIdFromServer">
        <th colspan="2">
          <h3>LISTADO DE ASIGNATURAS</h3>
        </th>
        <tr id="subject" v-for="subject in subjectsByTeacherIdFromServer.asignaturas" :key="subject.id">
          <td>{{ subject.subject.nombre }}</td>
        </tr>
      </table>
    </div>

    <div>
      <table id="tabla" v-if="matriculasRefFromServer">
        <th colspan="4">
          <h3>ALUMNADO</h3>
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
        </tr>
        <tr id="alumno" v-for="matricula in matriculasRefFromServer.matriculas" :key="matricula.id">
          <td>{{ matricula.year }} / {{ matricula.year + 1 }}</td>
          <td>{{ matricula.student.nombre }}</td>
          <td>{{ matricula.student.apellidos }}</td>
          <td>{{ matricula.student.dni }}</td>
          <td>{{ matricula.subject.nombre }}</td>
          <!-- <td>
            <button type="button" @click="editarMatricula(matricula), mostrarMatricula()">
              Editar
            </button>
          </td>
          <td><button type="button" @click="mostrarPopup(matricula.id)">Borrar</button></td>
        </tr> -->
        </tr>
      </table>
    </div>
    <button type="button" @click="confirmacionBorrar">Borrar profesor</button>
    <div v-show="confirmacionEliminar">
      <!-- Este div se muestra para confirmar el borrado  -->
      <h4>¿Estás seguro que quieres borrar el profesor?</h4>
      <button type="button" @click="borrarProfesor">Si</button>
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

table tr:hover td:nth-last-child(-n + 3) {
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
