<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'

// FETCH PARA ENVIAR DATOS DEL ALUMNO A LA BD:
function crearAlumno() {
  fetch('http://localhost:3000/student', {
    method: 'POST',
    body: JSON.stringify({
      nombre: studentNombreRef.value,
      apellidos: studentApellidosRef.value,
      dni: studentDniRef.value,
      direccion: studentDireccionRef.value,
      telefono: studentTelefonoRef.value,
      email: studentEmailRef.value
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        alert('Alumno Creado')
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error)
      alert('Ha ocurrido un error')
    })

  // Imprimo los datos que he introducido
  const datosAlumno = [
    studentNombreRef.value,
    studentApellidosRef.value,
    studentDniRef.value,
    studentDireccionRef.value,
    studentTelefonoRef.value,
    studentEmailRef.value
  ]
  console.log(datosAlumno)
}

//Referencias del formulario
let studentNombreRef: Ref<string> = ref('')
let studentApellidosRef: Ref<string> = ref('')
let studentDniRef: Ref<string> = ref('')
let studentDireccionRef: Ref<string> = ref('')
let studentTelefonoRef: Ref<number | undefined> = ref() // lo pongo undefined para que no me aparezca ningún dato en el formulario
let studentEmailRef: Ref<string> = ref('')

// para resetear los datos del formulario y poner cada ref a vacío
function resetearDatosForm() {
  studentNombreRef.value = ''
  studentApellidosRef.value = ''
  studentDniRef.value = ''
  studentDireccionRef.value = ''
  studentTelefonoRef.value = undefined // lo pongo undefined para que no me aparezca ningún dato en el formulario
  studentEmailRef.value = ''
}

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
</script>

<template>
  <div class="centradoVertical">
    <div class="form">
      <h1 class="green">Alta alumnos</h1>
      <form @submit.prevent="crearAlumno(), getStudentsData()">
        <label class="green">Nombre</label>
        <input type="text" name="" id="nombreInput" required v-model="studentNombreRef" />
        <label class="green">Apellidos</label>
        <input type="text" name="" id="apellidosInput" required v-model="studentApellidosRef" />
        <label class="green">Dni</label>
        <input type="text" name="" id="dniInput" required v-model="studentDniRef" />
        <label class="green">Dirección</label>
        <input type="text" name="" id="direcciónInput" required v-model="studentDireccionRef" />
        <label class="green">Teléfono</label>
        <input
          type="tel"
          pattern="[0-9]{9}"
          name=""
          id="telefonoInput"
          required
          v-model.number="studentTelefonoRef"
        />
        <label class="green">Email</label>
        <input type="email" name="" id="emailInput" v-model="studentEmailRef" />
        <button type="reset" @click="resetearDatosForm()">Resetear</button>
        <button type="submit">Enviar</button>
      </form>
    </div>
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
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  width: 300px;

  & Form {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  & input {
    height: 25px;
    border-radius: 5px;
  }

  & button {
    margin-top: 10px;
    width: 100px;
    height: 25px;
    background-color: hsla(160, 100%, 37%, 1);
    color: white;
    border: 1px solid hsla(160, 100%, 37%, 1);
    border-radius: 5px;
  }
}

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
