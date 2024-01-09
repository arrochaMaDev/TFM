<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { useRouter } from 'vue-router'

function getStudentsData() {
  fetch('http://localhost:3000/students', {
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
    }[]

    studentsRef.value = data
    console.log(studentsRef.value)
  })
}

getStudentsData()

const router = useRouter() // router para hacer uso de él

let studentsRef: Ref<
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
console.log(studentsRef.value)

let studentIdRef: Ref<string> = ref('')
let studentDniRef: Ref<string> = ref('')
let studentNombreRef: Ref<string> = ref('')
let studentApellidosRef: Ref<string> = ref('')
let alumnosEncontrados: Ref<
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
> = ref([]) // Nuevo array Ref para alumnos encontrados en el buscador

// Buscar alumno por ID
const buscarAlumnoPorId: () => void = () => {
  alumnosEncontrados.value = studentsRef.value.filter(
    (alumno) => alumno.id.toString() === studentIdRef.value
  )
  if (alumnosEncontrados.value.length == 0) {
    alert('No existe ningún alumno con esos datos')
  }
}

// console.dir(studentsRef, { depth: null })

// Buscar alumno por DNI
const buscarAlumnoPorDNI: () => void = () => {
  alumnosEncontrados.value = studentsRef.value.filter((alumno) =>
    alumno.dni.toLowerCase().includes(studentDniRef.value.toLowerCase())
  )
  studentNombreRef.value = '' // cuando se busque por DNI, el resto se vacía
  studentApellidosRef.value = ''
}
// Buscar alumno por NOMBRE
const buscarAlumnoPorNombre: () => void = () => {
  alumnosEncontrados.value = studentsRef.value.filter((alumno) =>
    alumno.nombre.toLowerCase().includes(studentNombreRef.value.toLowerCase())
  )
  studentApellidosRef.value = '' // cuando se busque por Nombre, el resto se vacía
  studentDniRef.value = ''
}
// (alumno) => alumno.nombre === studentNombreRef.value
// if (alumnosEncontrados.value.length == 0) {
//   alert('No existe ningún alumno con esos datos')
// }

// Buscar alumno por APELLIDOS
const buscarAlumnoPorApellidos: () => void = () => {
  alumnosEncontrados.value = studentsRef.value.filter((alumno) =>
    alumno.apellidos.toLowerCase().includes(studentApellidosRef.value.toLowerCase())
  )
  studentNombreRef.value = ''
  studentDniRef.value = ''
}

// Ir a la página idividual del alumno
const goToStudent = (id: number) => {
  router.push({
    path: `/alumno/${id}`
  })
}
const resetearDatos = () => {
  studentIdRef.value = ''
  studentDniRef.value = ''
  studentNombreRef.value = ''
  studentApellidosRef.value = ''
}
</script>

<template>
  <div class="centradoVertical">
    <h2>BUSCAR ALUMNOS</h2>
    <div id="buscarPorID">
      <label>Buscar por ID:</label>
      <input type="text" id="BuscarPorId" v-model="studentIdRef" />
      <button @click="buscarAlumnoPorId">Buscar</button>
    </div>
    <div id="buscarPorDNI">
      <!-- Se busca por DNI porque es un parámetro único de cada alumno -->
      <!--todo ¿Y si hubiera algún alumno sin DNI? menores de 10 años por ejemplo-->
      <label>Buscar por DNI:</label>
      <input type="text" id="BuscarPorDNI" v-model="studentDniRef" @input="buscarAlumnoPorDNI" />
    </div>
    <div id="buscarPorNombre">
      <label>Buscar por Nombre:</label>
      <input
        type="text"
        id="BuscarPorNombre"
        v-model="studentNombreRef"
        @input="buscarAlumnoPorNombre"
      />
    </div>
    <div id="buscarPorApellidos">
      <label>Buscar por Apellidos:</label>
      <input
        type="text"
        id="BuscarPorApellidos"
        v-model="studentApellidosRef"
        @input="buscarAlumnoPorApellidos"
      />
    </div>
    <button @click="resetearDatos">Resetear</button>

    <!--todo Añadir otro parámetro de búsqueda??-->
    <br />
    <div
      v-if="
        studentNombreRef.length > 0 ||
        studentIdRef.length > 0 ||
        studentDniRef.length > 0 ||
        studentApellidosRef.length > 0
      "
    >
      <h2>RESULTADO DE LA BÚSQUEDA</h2>
      <table id="resultadoBusqueda">
        <tr>
          <th>
            <h3>ID</h3>
          </th>
          <th>
            <h3>Nombre</h3>
          </th>
          <th>
            <h3>Apellidos</h3>
          </th>
          <th>
            <h3>DNI</h3>
          </th>
        </tr>
        <tr
          id="alumno"
          v-for="alumno in alumnosEncontrados"
          :key="alumno.id"
          @click="goToStudent(alumno.id)"
        >
          <td>{{ alumno.id }}</td>
          <td>{{ alumno.nombre }}</td>
          <td>{{ alumno.apellidos }}</td>
          <td>{{ alumno.dni }}</td>
        </tr>
      </table>
    </div>
    <div v-else>
      <h2>RESULTADO DE LA BÚSQUEDA</h2>
      <p>Sin resultados</p>
    </div>
  </div>
</template>

<style scoped>
table {
  margin-top: 0px;
  width: 500px;
  border: none;

  & th {
    background-color: rgb(79, 90, 86);
  }

  & td {
    width: fit-content;
    text-align: center;
    vertical-align: middle;
    border: none;
    border-spacing: 0;
  }
}
#alumno {
  transition: background-color 0.2s;
}

#alumno:hover {
  background-color: rgb(106, 98, 53);
  cursor: pointer;
}
</style>
