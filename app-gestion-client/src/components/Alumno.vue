<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

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

fetch(`http://localhost:3000/student/${studentIdRef.value}`, {
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
    telefono: string
    email: string
  }
  studentDataFromServer.value = data
  console.log(data)
})

// Obtener la fecha actual
const fechaActual = new Date()
// Obtener el año de la fecha actual
const añoActual = fechaActual.getFullYear()
/**
 * !! OJO QUE SI SE HACE ASÍ, CUANDO ESTEMOS EN ENERO APARECERÁ EL AÑO 2024/2025 */

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
  }[]
} | null> = ref(null)

const getStudentData = async () => {
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
getStudentData()
</script>

<template>
  <div v-if="studentDataFromServer">
    <h2>Detalle del Alumno</h2>
    <p>Usuario_id: {{ studentDataFromServer.usuario_id }}</p>
    <p>Nombre: {{ studentDataFromServer.nombre }}</p>
    <p>Apellidos: {{ studentDataFromServer.apellidos }}</p>
    <p>DNI: {{ studentDataFromServer.dni }}</p>
    <p>Direccion: {{ studentDataFromServer.direccion }}</p>
    <p>telefono: {{ studentDataFromServer.telefono }}</p>
    <p>Email: {{ studentDataFromServer.email }}</p>
    <div>
      <table id="tabla" v-if="matriculaFromServer">
        <th colspan="5"><h3>MATRICULAS</h3></th>
        <tr>
          <th>
            <h3>Asignatura</h3>
          </th>
          <th>
            <h3>Profesor</h3>
          </th>
        </tr>
        <tr id="alumno" v-for="matricula in matriculaFromServer?.matriculas" :key="matricula.id">
          <td>{{ matricula.subject.nombre }}</td>
          <td>{{ matricula.teacher.nombre + ' ' + matricula.teacher.apellidos }}</td>
        </tr>
      </table>
    </div>
    <div>
      <table id="tabla">
        <th colspan="2">
          <h3>Cuotas {{ añoActual }} / {{ añoActual + 1 }}</h3>
        </th>
        <tr>
          <th>
            <h3>Mes</h3>
          </th>
          <th>
            <h3>Estado</h3>
          </th>
        </tr>
        <tr>
          <td>Octubre</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Noviembre</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Diciembre</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Enero</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Febrero</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Marzo</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Abril</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Mayo</td>
          <td>Pendiente</td>
        </tr>
        <tr>
          <td>Junio</td>
          <td>Pendiente</td>
        </tr>
      </table>
    </div>
    <button type="button" @click="confirmacionBorrar">Borrar alumno</button>
    <div v-show="confirmacionEliminar">
      <!-- Este div se muestra para confirmar el borrado  -->
      <h4>¿Estás seguro que quieres borrar el alumno?</h4>
      <button type="button" @click="borrarAlumno">Si</button>
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
  width: 100px;
  height: 25px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: 1px solid hsla(160, 100%, 37%, 1);
  border-radius: 5px;
  margin: 5px;
}
</style>
