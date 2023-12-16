<script setup lang="ts">
import { ref, type Ref } from 'vue'

// Referencias del formulario
let studentNombreRef: Ref<string | undefined> = ref(undefined)
let studentApellidosRef: Ref<string | undefined> = ref(undefined)
let studentDniRef: Ref<string | undefined> = ref(undefined)
let studentDireccionRef: Ref<string | undefined> = ref(undefined)
let studentTelefonoRef: Ref<number | undefined> = ref(undefined)
let studentEmailRef: Ref<string | undefined> = ref(undefined)

// Resetear los datos del formulario y poner cada ref a vacío
const borrarDatosForm = () => {
  studentNombreRef.value = undefined
  studentApellidosRef.value = undefined
  studentDniRef.value = undefined
  studentDireccionRef.value = undefined
  studentTelefonoRef.value = undefined
  studentEmailRef.value = undefined
  asignaturaSelected.value = ''
  teacherAsignaturas.value = []
  teacherAsignaturasToString.value = ''
  console.log('Borrar Datos')
}

// VALIDAR DATOS DEL FORMULARIO
const patronTel = /^\d{9}$/
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const validarDatos = () => {
  console.log('validar Datos')
  if (
    !studentNombreRef.value ||
    !studentApellidosRef.value ||
    !studentDniRef.value ||
    !studentDireccionRef.value ||
    !studentTelefonoRef.value ||
    !studentEmailRef.value
  ) {
    alert('Por favor, complete todos los campos obligatorios.')
    return false
  }
  if (!studentTelefonoRef.value || !patronTel.test(studentTelefonoRef.value.toString())) {
    alert('El número de teléfono debe tener 9 dígitos numéricos.')
    return false
  }
  if (!studentEmailRef.value || !patronEmail.test(studentEmailRef.value)) {
    alert('Por favor, introduce un email válido.')
    return false
  }
  return true
}

// FETCH PARA ENVIAR DATOS DEL ALUMNO A LA BD:
function crearAlumno() {
  const datosValidos = validarDatos()
  if (datosValidos) {
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
          // Imprimo los datos que he introducido
          const datosAlumno = [
            studentNombreRef.value,
            studentApellidosRef.value,
            studentDniRef.value,
            studentDireccionRef.value,
            studentTelefonoRef.value,
            studentEmailRef.value
          ]
          console.table(datosAlumno)
          borrarDatosForm()
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error)
        alert('Ha ocurrido un error')
      })
  }
}

// COMPONENTE COMO POPUP PARA EDITAR
const emit = defineEmits(['cerrarPopUp', 'obtenerAlumnos', 'resetearAlumno'])
const props = defineProps<{
  alumnoParaEditar:
    | {
        id: number
        usuario_id: string
        nombre: string
        apellidos: string
        dni: string
        telefono: number
        direccion: string
        email: string
      }
    | undefined
  isEditing: boolean
}>()

let alumnoEditado = ref({ ...props.alumnoParaEditar })

let popUpStyle: Ref<boolean> = ref(props.isEditing) // variable para activar el estilo popUp

// FETCH PARA ACTUALIZAR DATOS DEL ALUMNO:
const actualizarAlumno = async () => {
  if (alumnoEditado.value.telefono && !patronTel.test(alumnoEditado.value.telefono.toString())) {
    alert('El número de teléfono debe tener 9 dígitos numéricos.')
    return
  }
  if (alumnoEditado.value.email && !patronEmail.test(alumnoEditado.value.email)) {
    alert('Por favor, introduce un email válido.')
  } else {
    try {
      const response = await fetch(`http://localhost:3000/student/${alumnoEditado.value?.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: alumnoEditado.value?.nombre,
          apellidos: alumnoEditado.value?.apellidos,
          dni: alumnoEditado.value?.dni,
          direccion: alumnoEditado.value?.direccion,
          telefono: alumnoEditado.value?.telefono,
          email: alumnoEditado.value?.email
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (response.ok) {
        alert('Alumno Editado')
        // Imprimo los datos que he introducido
        const AlumnoActualizado = [
          alumnoEditado.value?.nombre,
          alumnoEditado.value?.apellidos,
          alumnoEditado.value?.dni,
          alumnoEditado.value?.direccion,
          alumnoEditado.value?.telefono,
          alumnoEditado.value?.email
        ]
        console.table(AlumnoActualizado)
        popUpStyle.value = false
      } else {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      alert('Ha ocurrido un error')
    } finally {
      emit('cerrarPopUp')
      emit('obtenerAlumnos')
    }
  }
}
// para resetear los valores como están actualmente en la BD
const resetearValoresIniciales = () => {
  console.log('resetear valores iniciales')
  alumnoEditado.value.nombre = props.alumnoParaEditar?.nombre
  alumnoEditado.value.apellidos = props.alumnoParaEditar?.apellidos
  alumnoEditado.value.dni = props.alumnoParaEditar?.dni
  alumnoEditado.value.telefono = props.alumnoParaEditar?.telefono
  alumnoEditado.value.direccion = props.alumnoParaEditar?.direccion
  alumnoEditado.value.email = props.alumnoParaEditar?.email
  emit('resetearAlumno', alumnoEditado) // hago el emit y paso además el alumnoEdidado según el valor de solo lectura de las props recibidas
}

// OBTENER Y AÑADIR ASIGNATURAS DADAS DE ALTA

let asignaturas: Ref<
  {
    id: number
    nombre: string
  }[]
> = ref([])

let asignaturaSelected: Ref<string> = ref('')
let teacherAsignaturas: Ref<string[]> = ref([])
let teacherAsignaturasToString: Ref<string> = ref('')

function getSubjectsData() {
  fetch('http://localhost:3000/asignaturas', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then(async (response) => {
      const data = (await response.json()) as {
        id: number
        nombre: string
      }[]
      asignaturas.value = data
      console.log(data)
    })
    .catch((error) => {
      alert('Hay un error' + error)
      console.log('hay un error', error)
    })
}
getSubjectsData()

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
  <div class="container" :class="{ altaAlumnosPopup: popUpStyle }">
    <div class="form" :class="{ 'altaAlumnosPopup-content': popUpStyle }">
      <h1 v-if="popUpStyle" class="green">Editar alumno</h1>
      <h1 v-else class="green">Alta alumno</h1>
      <form @submit.prevent="crearAlumno()">
        <label class="green">Nombre</label>
        <input
          v-if="!popUpStyle"
          type="text"
          name=""
          id="nombreInput"
          required
          v-model="studentNombreRef"
        />
        <!-- :value="popUpStyle ? alumnoEditado?.nombre : studentNombreRef" -->
        <input
          v-if="popUpStyle"
          type="text"
          name=""
          id="nombreInput"
          required
          v-model="alumnoEditado.nombre"
        />
        <!-- si popUpStyle es true, v-model son las props que le paso desde el componente padre -->
        <label class="green">Apellidos</label>
        <input
          v-if="!popUpStyle"
          type="text"
          name=""
          id="apellidosInput"
          required
          v-model="studentApellidosRef"
        />
        <input
          v-if="popUpStyle"
          type="text"
          name=""
          id="apellidosInput"
          required
          v-model="alumnoEditado.apellidos"
        />
        <label class="green">Dni</label>
        <input
          v-if="!popUpStyle"
          type="text"
          name=""
          id="dniInput"
          required
          v-model="studentDniRef"
        />
        <input
          v-if="popUpStyle"
          type="text"
          name=""
          id="dniInput"
          required
          v-model="alumnoEditado.dni"
        />
        <label class="green">Teléfono</label>
        <input
          v-if="!popUpStyle"
          type="tel"
          pattern="^\d{9}$"
          name=""
          id="telefonoInput"
          required
          v-model="studentTelefonoRef"
        />
        <input
          v-if="popUpStyle"
          type="tel"
          pattern="^\d{9}$"
          name=""
          id="telefonoInput"
          required
          v-model="alumnoEditado.telefono"
        />
        <label class="green">Dirección</label>
        <input
          v-if="!popUpStyle"
          type="text"
          name=""
          id="direcciónInput"
          required
          v-model="studentDireccionRef"
        />
        <input
          v-if="popUpStyle"
          type="text"
          name=""
          id="direcciónInput"
          required
          v-model="alumnoEditado.direccion"
        />
        <label class="green">Email</label>
        <input
          v-if="!popUpStyle"
          type="email"
          name=""
          id="emailInput"
          required
          v-model="studentEmailRef"
        />
        <input
          v-if="popUpStyle"
          required
          type="email"
          name=""
          id="emailInput"
          v-model="alumnoEditado.email"
        />
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
        <button type="reset" @click="borrarDatosForm()">Borrar</button>
        <button type="reset" v-if="popUpStyle" @click="resetearValoresIniciales">Resetear</button>
        <button type="submit" v-if="!popUpStyle" @click="crearAlumno()">Enviar</button>
        <button type="button" v-if="popUpStyle" @click="actualizarAlumno()">Enviar</button>
        <button type="button" v-if="popUpStyle" @click="emit('cerrarPopUp')">Cancelar</button>
      </form>
    </div>
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
    cursor: pointer;
  }
}
.altaAlumnosPopup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.altaAlumnosPopup-content {
  background: #000000;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid white;

  & button {
    cursor: pointer;
  }
}

#asignaturasSeleccionadas {
  /* display: flex;
  flex-wrap: column; */
  width: fit-content;
  border: none;

  & td {
    text-align: center;
    vertical-align: text-bottom;
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
