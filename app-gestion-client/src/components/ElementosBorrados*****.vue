<script setup lang="ts">
// FETCH OBTENER STUDENTS DE ALTAALUMNO
function getStudentsData() {
  fetch('http://localhost:3000/students', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then(async (response) => {
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
          telefono: number
          email: string
        }[]
        studentsRefFromServer.value = data
        console.log(data)
        console.log(studentsRefFromServer.value)
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error)
      alert('Ha ocurrido un error')
    })
}
getStudentsData()

// OBTENER LISTADO DE ESTUDIANTES
let studentsRefFromServer: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
    email: string
  }[]
> = ref([])

let invertedStudentsRefFromServer = ref(
  computed(() => {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    return studentsRefFromServer.value.slice().reverse()
  })
)
console.log(invertedStudentsRefFromServer.value)

// FUNCION AGREGAR ASIGNATURA COMPONENTE ALTA ALUMNO COMO ARRAY
function agregarAsignatura() {
  if (asignaturaSelected.value === '') {
    // si quieren insertar un valor vacío salta una alerta
    alert('Tienes que selecionar alguna asignatura')
  } else {
    teacherAsignaturas.value.push(asignaturaSelected.value)
    teacherAsignaturasToString.value = teacherAsignaturas.value
      .map((elemento) => ' ' + elemento) // recorro el array añadiendo un espacio a cada elemento
      .toString() // lo convierto en string
      .trimStart() // elimino el espacio al principio
    asignaturaSelected.value = ''
    console.log(teacherAsignaturasToString.value)
  }
}

const eliminarAsignatura = (index: any) => {
  teacherAsignaturas.value.splice(index, 1)
  if (teacherAsignaturas.value.length === 0) {
    teacherAsignaturasToString.value = ''
  }
}
</script>
<template>
  <!--· VISTA PREVIA DEL COMPONENTE ALTA ALUMNO -->
  <div class="vistaPrevia">
    <h2>Vista previa del alumno:</h2>
    <p>Nombre: {{ studentNombreRef }}</p>
    <p>Apellidos: {{ studentApellidosRef }}</p>
    <p>DNI: {{ studentDniRef }}</p>
    <p>Direccion: {{ studentDireccionRef }}</p>
    <p>Teléfono: {{ studentTelefonoRef }}</p>
    <p>Email: {{ studentEmailRef }}</p>
    <div>
      <img class="" src="../utils/img/miguelarrocha.png" alt="" width="100" height="100" />
    </div>
  </div>
  <!--· TABLA LISTADO ALUMNOS DEL COMPONENTE ALTA ALUMNO -->
  <section>
    <table id="tabla">
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
        <th>
          <h3>Dirección</h3>
        </th>
        <th>
          <h3>Teléfono</h3>
        </th>
        <th>
          <h3>Email</h3>
        </th>
      </tr>
      <tr v-for="student in invertedStudentsRefFromServer" :key="student.id">
        <td>{{ student.id }}</td>
        <td>{{ student.nombre }}</td>
        <td>{{ student.apellidos }}</td>
        <td>{{ student.dni }}</td>
        <td>{{ student.direccion }}</td>
        <td>{{ student.telefono }}</td>
        <td>{{ student.email }}</td>
      </tr>
    </table>
  </section>

  <!--· SELECCIONAR ASIGNATURAS DEL COMPONENTE ALTA ALUMNO. SE AÑADEN COMO UN ARRAY -->
  <label class="green">Asignaturas</label>
  <select name="" id="asignaturasInput" v-model="asignaturaSelected">
    <option selected disabled>Seleccione la asignatura</option>
    <option v-for="asignatura in asignaturas" :key="asignatura.id">
      {{ asignatura.nombre }}
    </option>
  </select>
  <button type="button" @click="agregarAsignatura()">Agregar</button>
  <div>
    <table id="asignaturasSeleccionadas">
      <th colspan="2" v-if="teacherAsignaturasToString">Asignaturas seleccionadas:</th>
      <tr v-for="(asignatura, index) in teacherAsignaturas" :key="index">
        {{
          asignatura
        }}
        <td><button type="submit" @click="eliminarAsignatura">Eliminar</button></td>
      </tr>
    </table>
  </div>
</template>
<style>
.vistaPrevia {
  display: flex;
  flex-direction: column;
  width: 1000px;
}

table {
  width: 1000px;
  border: 1px solid #ffffff;

  & th {
    background-color: rgb(79, 90, 86);
  }

  & td {
    width: fit-content;
    text-align: left;
    vertical-align: top;
    border: 1px solid #ffffff;
    border-spacing: 0;
  }
}
</style>
