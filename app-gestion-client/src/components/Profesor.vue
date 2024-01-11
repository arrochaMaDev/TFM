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
      router.push('/listado_profesores')
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
  <div v-if="teacherDataFromServer">
    <h2>Detalle del Profesor</h2>
    <p>Nombre: {{ teacherDataFromServer.nombre }}</p>
    <p>Apellidos: {{ teacherDataFromServer.apellidos }}</p>
    <p>Email: {{ teacherDataFromServer.email }}</p>
    <p>Asignaturas: {{ teacherDataFromServer.asignaturas }}</p>
    <button type="button" @click="confirmacionBorrar">Borrar profesor</button>
    <div v-show="confirmacionEliminar">
      <!-- Este div se muestra para confirmar el borrado  -->
      <h4>¿Estás seguro que quieres borrar el profesor?</h4>
      <button type="button" @click="borrarProfesor">Si</button>
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
