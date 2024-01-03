<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import { type Ref, ref } from 'vue'

const loadingStore = useLoadingStore() // store del Spinner

// OBTENER DATOS DE TODOS LOS ESTUDIANTES
let studentsRefFromServer: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: string
    email: string
  }[]
> = ref([])

const getStudentsData = async () => {
  try {
    const response = await fetch('http://localhost:3000/students', {
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
        dni: string
        direccion: string
        telefono: string
        email: string
      }[]
      studentsRefFromServer.value = data
      console.log(data)
      console.log(studentsRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    loadingStore.loadingFalse()
  }
}

getStudentsData()

// OBTENER DATOS DE TODAS LAS ASIGNATURAS
let subjectsRefFromServer: Ref<
  {
    id: number
    nombre: string
  }[]
> = ref([])

const getSubjectsData = async () => {
  try {
    const response = await fetch('http://localhost:3000/asignaturas', {
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
        nombre: string
      }[]
      subjectsRefFromServer.value = data
      console.log(data)
      console.log(subjectsRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    loadingStore.loadingFalse()
  }
}

getSubjectsData()

// OBTENER DATOS DE TODOS LOS PROFESORES
let teachersRefFromServer: Ref<
  {
    id: number
    nombre: string
    apellidos: string
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
        nombre: string
        apellidos: string
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

getTeachersData()

// REFERENCIAS DE LA MATRICULA

let subjectMatricula: Ref<{
  id: number
  nombre: string
} | null> = ref(null)

let teacherMatricula: Ref<{
  id: number
  nombre: string
  apellidos: string
} | null> = ref(null)

let studentMatricula: Ref<{
  id: number
  usuario_id: string
  nombre: string
  apellidos: string
  dni: string
  direccion: string
  telefono: string
  email: string
} | null> = ref(null)

// let nota: Ref<number | null> = ref(null) // LA NOTA SE RESERVA PARA LA EVALUACION

// ENVIO DATOS POST A LA BD DE LA MATRICULA

const crearMatricula = async () => {
  try {
    const response = await fetch('http://localhost:3000/matricula', {
      method: 'POST',
      body: JSON.stringify({
        alumno: studentMatricula.value?.id,
        asignatura: subjectMatricula.value?.id,
        profesor: teacherMatricula.value?.id
        // nota: nota.value
        // LA NOTA SE RESERVA PARA LAS EVALUACION
      }),
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

      const matricula = {
        alumno: {
          nombre: studentMatricula.value?.nombre,
          apellidos: studentMatricula.value?.apellidos
        },
        asignatura: subjectMatricula.value?.nombre,
        profesor: {
          nombre: teacherMatricula.value?.nombre,
          apellidos: teacherMatricula.value?.apellidos
        }
        // nota: nota.value // LA NOTA SE RESERVA PARA LA EVALUACION
      }

      const data = (await response.json()) as typeof matricula

      console.table(data)

      // reiniciar valores menos el alumno
      subjectMatricula.value = null
      teacherMatricula.value = null
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    loadingStore.loadingFalse()
  }
}
</script>

<template>
  <div>
    <h1>Matricula</h1>
    <label for="alumno">Selecciona el alumno</label>
    <select name="alumno" id="" v-model="studentMatricula">
      <option v-for="student in studentsRefFromServer" :key="student.id" :value="student">
        {{ student.nombre }} {{ student.apellidos }}
      </option>
    </select>

    <label for="asignatura">Selecciona la asignatura</label>
    <select name="asignatura" id="" v-model="subjectMatricula">
      <option v-for="subject in subjectsRefFromServer" :key="subject.id" :value="subject">
        {{ subject.nombre }}
      </option>
    </select>

    <label for="profesor">Selecciona el profesor</label>
    <select name="profesor" id="" v-model="teacherMatricula">
      <option v-for="teacher in teachersRefFromServer" :key="teacher.id" :value="teacher">
        {{ teacher.nombre }} {{ teacher.apellidos }}
      </option>
    </select>

    <!-- <label for="numeros">Selecciona un número del 1 al 10:</label>
    <select id="numeros" name="numeros" v-model="nota">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select> -->

    <!-- VISTA PREVIA -->
    <table class="vistaPrevia">
      <th>Vista previa de la matricula:</th>
      <tr>
        Alumno:
        {{
          studentMatricula?.nombre
        }}
        {{
          studentMatricula?.apellidos
        }}
      </tr>
      <tr>
        Asignatura:
        {{
          subjectMatricula?.nombre
        }}
      </tr>
      <tr>
        Profesor:
        {{
          teacherMatricula?.nombre
        }}
        {{
          teacherMatricula?.apellidos
        }}
      </tr>
      <tr>
        <button type="submit" @click="crearMatricula">Enviar</button>
      </tr>
    </table>
  </div>
</template>
<style scoped></style>
