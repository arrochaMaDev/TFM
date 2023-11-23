<script setup lang="ts">
import { ref, type Ref } from 'vue'

// FETCH PARA ENVIAR DATOS DEL PROFESOR A LA BD:
function crearProfesor() {
  fetch('http://localhost:3000/teacher', {
    method: 'POST',
    body: JSON.stringify({
      nombre: teacherNombreRef.value,
      apellidos: teacherApellidosRef.value,
      email: teacherEmailRef.value
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
        alert('Profesor añadido')
        // Imprimo los datos que he introducido
        const datosProfesor = [
          teacherNombreRef.value,
          teacherApellidosRef.value,
          teacherEmailRef.value
        ]
        console.log(datosProfesor)

        // Vacío el formulario después de enviar los datos:
        teacherNombreRef.value = ''
        teacherApellidosRef.value = ''
        teacherEmailRef.value = ''
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error)
      alert('Ha ocurrido un error')
    })
}

//Referencias del formulario
let teacherNombreRef: Ref<string> = ref('')
let teacherApellidosRef: Ref<string> = ref('')
let teacherEmailRef: Ref<string> = ref('')
let asignaturaSelected: Ref<string> = ref('')
let teacherAsignaturas: Ref<string[]> = ref([])
let teacherAsignaturasToString: Ref<string> = ref('')
let fotoURL: Ref<string> = ref('')

function agregarAsignatura() {
  if (asignaturaSelected.value === '') {
    // si quieren insertar un valor vacío salta una alerta
    alert('Tienes que selecionar alguna asignatura')
  } else {
    teacherAsignaturas.value.push(asignaturaSelected.value)
    teacherAsignaturasToString.value = teacherAsignaturas.value
      .map((elemento) => ' ' + elemento) // recorro el array añadiendo un espacio a cada elemento
      .toString() // lo convierto en string
    asignaturaSelected.value = ''
  }
}

const eliminarAsignatura = (index: any) => {
  teacherAsignaturas.value.splice(index, 1)
}

// para resetear los datos del formulario y poner cada ref a vacío
function resetearDatosForm() {
  teacherNombreRef.value = ''
  teacherApellidosRef.value = ''
  teacherEmailRef.value = ''
  asignaturaSelected.value = ''
  teacherAsignaturas.value = []
  teacherAsignaturasToString.value = ''
  let botonEliminarAsignatura = ref()
}

// OBTENER LISTADO DE PROFESORES
let teachersRefFromServer: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    email: string
  }[]
> = ref([])

// FETCH PARA OBTENER DATOS DE LA BD
function getTeachersData() {
  fetch('http://localhost:3000/teachers', {
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
      email: string
    }[]
    teachersRefFromServer.value = data
    console.log(data)
    console.log(teachersRefFromServer.value)
  })
  // .catch((error) => {
  //   alert('Hay un error' + error)
  //   console.log('hay un error', error)
  // })
  // NO SE IMPLEMENTA EL MANEJO DE ERRORES
}
getTeachersData()

function guardarFoto() {}
</script>

<template>
  <div class="centradoVertical">
    <div class="form">
      <h1 class="green">Alta Profesores</h1>
      <form @submit.prevent="crearProfesor(), getTeachersData()">
        <label class="green">Nombre</label>
        <input type="text" name="" id="nombreInput" v-model="teacherNombreRef" />
        <label class="green">Apellidos</label>
        <input type="text" name="" id="apellidosInput" v-model="teacherApellidosRef" />
        <label class="green">Email</label>
        <input type="email" name="" id="emailInput" v-model="teacherEmailRef" />
        <label class="green">Asignaturas</label>
        <select name="" id="asignaturasInput" v-model="asignaturaSelected">
          <!--! OJO PORQUE LAS ASIGNATURAS DE ESTA LISTA DEBEN SER LAS QUE SE HAYAN INSERTADO EN LA BASE DE DATOS. SE DEBE HACER UNA PETICIÓN GET A LA BD Y LISTAR ESTAS ASIGNATURAS COMO CADA UNA DE LAS OPCIONES-->
          <option selected disabled>Seleccione la asignatura</option>
          <option value="Despertar Musical">Despertar Musical</option>
          <option value="Lenguaje Musical">Lenguaje Musical</option>
          <option value="Oboe">Oboe</option>
          <option value="Flauta">Flauta</option>
          <option value="Clarinete">Clarinete</option>
          <option value="Saxofón">Saxofón</option>
          <option value="Trompa">Trompa</option>
          <option value="Trompeta">Trompeta</option>
          <option value="Trombón">Trombón</option>
          <option value="Bombardino">Bombardino</option>
          <option value="Tuba">Tuba</option>
          <option value="Percusión">Percusión</option>
        </select>
        <button type="button" @click="agregarAsignatura()">Agregar</button>
        <label for="myfile">Selecciona una foto de perfil:</label>
        <input type="file" id="" name="" />
        <!--TODO: averiguar cómo pasar un archivo y que VUE aplicación me recoga la URL y me la muestre en la vista previa-->
        <button type="reset" @click="resetearDatosForm()">Resetear</button>
        <button type="submit">Enviar datos</button>
        <!--TODO: Modificar el backend y la BD para un array de asignaturas y una foto de perfil -->
      </form>
    </div>
    <div class="vistaPrevia">
      <h2>Vista previa del profesor:</h2>
      <p>Nombre: {{ teacherNombreRef }}</p>
      <p>Apellidos: {{ teacherApellidosRef }}</p>
      <p>Email: {{ teacherEmailRef }}</p>
      <p>Asignaturas modo lista horizontal: {{ teacherAsignaturasToString }}</p>
      <!-- OPCIÓN 1: trompeta, flauta, saxo, etc -->
      <div>
        Asignaturas modo lista vertical:
        <p>OPCIÓN 2: lo mismo pero como una lista vertical</p>
        <table id="asignaturasSeleccionadas">
          <tr v-for="(asignatura, index) in teacherAsignaturas" :key="index">
            {{
              asignatura
            }}
            <td><button type="submit" @click="eliminarAsignatura">Eliminar</button></td>
          </tr>
        </table>
      </div>
      <div>
        <img class="" src="../utils/img/miguelarrocha.png" alt="" width="100" height="100" />
      </div>
    </div>
    <!--· TABLA CON EL LISTADO DE PROFESORES -->
    <!-- <section> 
      <table id="tablaServer">
        <tr>
          <th><h3>Nombre</h3></th>
          <th><h3>Apellidos</h3></th>
          <th><h3>Email</h3></th>
          <th><h3>Asignaturas</h3></th>
        </tr>
        <tr v-for="teacher in teachersRefFromServer" :key="teacher.id">
          <td>{{ teacher.nombre }}</td>
          <td>{{ teacher.apellidos }}</td>
          <td>{{ teacher.email }}</td>
          <td id="tdAsignaturas">
            {{ teacherAsignaturas.toString() }}
          </td>
        </tr>
      </table>
    </section> -->
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

  & #tdAsignaturas {
    width: 500px;
  }
}

#asignaturasSeleccionadas {
  /* display: flex;
  flex-wrap: wrap; */
  width: fit-content;
  border: none;
  text-align: center;
  vertical-align: middle;

  & td {
    border: none;
  }

  & button {
    width: 100px;
    height: 25px;
    background-color: hsla(160, 100%, 37%, 1);
    color: white;
    border: 1px solid hsla(160, 100%, 37%, 1);
    border-radius: 5px;
  }
}
</style>
