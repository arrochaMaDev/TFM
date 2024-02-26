<script setup lang="ts">
import { ref, type Ref } from 'vue'

//Referencias del formulario
const teacherRef = {
  nombre: ref<string | undefined>(undefined),
  apellidos: ref<string | undefined>(undefined),
  email: ref<string | undefined>(undefined),
  asignaturas: ref<string[]>([])
}
const asignaturaSelected: Ref<string> = ref('')

// para resetear los datos del formulario y poner cada ref a vacío
function resetearDatosForm() {
  teacherRef.nombre.value = undefined
  teacherRef.apellidos.value = undefined
  teacherRef.email.value = undefined
  teacherRef.asignaturas.value = []
}

// FETCH PARA ENVIAR DATOS DEL PROFESOR A LA BD:
const crearProfesor = async () => {
  try {
    const response = await fetch('http://localhost:3000/teacher', {
      method: 'POST',
      body: JSON.stringify({
        nombre: teacherRef.nombre.value,
        apellidos: teacherRef.apellidos.value,
        email: teacherRef.email.value,
        asignaturas: teacherRef.asignaturas.value.toString()
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      alert('Profesor creado')
      // Imprimo los datos que he introducido
      const datosProfesor = [
        teacherRef.nombre.value,
        teacherRef.apellidos.value,
        teacherRef.email.value,
        teacherRef.asignaturas.value
      ]
      console.log(datosProfesor)
      // Vacío el formulario después de enviar los datos:
      teacherRef.nombre.value = undefined
      teacherRef.apellidos.value = undefined
      teacherRef.email.value = undefined
      teacherRef.asignaturas.value = []
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  }
}

// OBTENER ASIGNATURAS DE LA BD
let asignaturas: Ref<
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
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = (await response.json()) as {
        id: number
        nombre: string
      }[]
      asignaturas.value = data
      console.log(data)
    }
  } catch (error) {
    alert('Hay un error' + error)
    console.log('hay un error', error)
  }
}
getSubjectsData()

function agregarAsignatura() {
  if (asignaturaSelected.value === '') {
    // si quieren insertar un valor vacío salta una alerta
    alert('Tienes que selecionar alguna asignatura')
  } else {
    teacherRef.asignaturas.value.push(asignaturaSelected.value)
    const teacherAsignaturasToString = teacherRef.asignaturas.value
      .map((elemento) => ' ' + elemento) // recorro el array añadiendo un espacio a cada elemento
      .toString() // lo convierto en string
      .trimStart() // elimino el espacio al principio
    asignaturaSelected.value = ''
    console.log(teacherAsignaturasToString)
  }
}

const eliminarAsignatura = (index: any) => {
  teacherRef.asignaturas.value.splice(index, 1)
}

// COMPONENTE COMO POPUP PARA EDITAR
const emit = defineEmits(['cerrarPopUp', 'obtenerProfesores', 'resetearProfesor'])
const props = defineProps<{
  profesorParaEditar:
  | {
    id: number
    nombre: string
    apellidos: string
    email: string
    asignaturas: string
  }
  | undefined
  isEditing: boolean
}>()

let profesorEditado = ref({ ...props.profesorParaEditar })

let popUpStyle: Ref<boolean> = ref(props.isEditing) // variable para activar el estilo popUp

// FETCH PARA ACTUALIZAR DATOS DEL PROFESOR:
const actualizarProfesor = async () => {
  try {
    const response = await fetch(`http://localhost:3000/teacher/${profesorEditado.value?.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nombre: profesorEditado.value?.nombre,
        apellidos: profesorEditado.value?.apellidos,
        email: profesorEditado.value?.email,
        asignaturas: profesorEditado.value?.asignaturas?.toString()
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      alert('Profesor Editado')
      // Imprimo los datos que he introducido
      const profesorActualizado = [
        profesorEditado.value?.nombre,
        profesorEditado.value?.apellidos,
        profesorEditado.value?.email,
        profesorEditado.value?.asignaturas
      ]
      console.table(profesorActualizado)
      popUpStyle.value = false
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    emit('cerrarPopUp')
    emit('obtenerProfesores')
  }
}

// para resetear los valores como están actualmente en la BD
const resetearValoresIniciales = () => {
  console.log('resetear valores iniciales')
  profesorEditado.value.nombre = props.profesorParaEditar?.nombre
  profesorEditado.value.apellidos = props.profesorParaEditar?.apellidos
  profesorEditado.value.email = props.profesorParaEditar?.email
  profesorEditado.value.asignaturas = props.profesorParaEditar?.asignaturas
  emit('resetearProfesor', profesorEditado) // hago el emit y paso además el ProfesorEditado según el valor de solo lectura de las props recibidas
}
// FUNCION PARA ENVIAR DATOS DEL FORMULARIO
const enviarDatosFormulario = () => {
  if (popUpStyle.value) {
    actualizarProfesor() // Función para actualizar Profesor en modo edición
  } else {
    crearProfesor() // Función para crear un nuevo Profesor
  }
}
</script>

<template>
  <div class="container" :class="{ altaProfesorPopup: popUpStyle }">
    <div class="form" :class="{ 'altaProfesorPopup-content': popUpStyle }">
      <h1 v-if="popUpStyle" class="green">Editar profesor</h1>
      <h1 v-else class="green">Alta profesor</h1>
      <form @submit.prevent="enviarDatosFormulario()">
        <div v-if="!popUpStyle">
          <!--MODO CREAR -->
          <label class="green">Nombre</label>
          <input required type="text" id="nombreInput" v-model="teacherRef.nombre.value" />
          <label class="green">Apellidos</label>
          <input required type="text" id="apellidosInput" v-model="teacherRef.apellidos.value" />
          <label class="green">Email</label>
          <input required type="email" id="emailInput" v-model="teacherRef.email.value" />
          <label class="green">Asignaturas</label>
          <select id="asignaturasInput" v-model="asignaturaSelected">
            <option selected disabled>Seleccione la asignatura</option>
            <option v-for="asignatura in asignaturas" :key="asignatura.id">
              {{ asignatura.nombre }}
            </option>
          </select>
          <button type="button" @click="agregarAsignatura()">Agregar</button>
        </div>
        <div v-if="popUpStyle">
          <!--MODO ACTUALIZAR -->
          <label class="green">Nombre</label>
          <input type="text" id="nombreInput" required v-model="profesorEditado.nombre" />
          <label class="green">Apellidos</label>
          <input type="text" id="apellidosInput" required v-model="profesorEditado.apellidos" />
          <label class="green">Email</label>
          <input required type="email" id="emailInput" v-model="profesorEditado.email" />
        </div>
        <button type="reset" @click="resetearDatosForm()">Borrar datos</button>
        <button type="reset" v-if="popUpStyle" @click="resetearValoresIniciales">Resetear</button>
        <button type="submit">{{ popUpStyle ? 'Actualizar' : 'Enviar' }}</button>
        <button type="button" v-if="popUpStyle" @click="emit('cerrarPopUp')">Cancelar</button>
      </form>
    </div>
    <div v-if="!popUpStyle" class="vistaPrevia">
      <table id="asignaturasSeleccionadas">
        <th colspan="2">Asignaturas seleccionadas:</th>
        <tr v-for="(asignatura, index) in teacherRef.asignaturas.value" :key="index">
          {{
            asignatura
          }}
          <td><button type="submit" @click="eliminarAsignatura">Eliminar</button></td>
        </tr>
      </table>
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
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
  }

  div label {
    display: block;
  }

  div input {
    height: 25px;
    border-radius: 5px;
  }

  button {
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

.container.altaProfesorPopup {
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

.altaProfesorPopup-content {
  background: #000000;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  /* Añadido para disponer los elementos verticalmente */

  & label {
    display: block;
    margin-bottom: 5px;
  }

  & input {
    height: 25px;
    width: 100%;
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  & button {
    margin-top: 10px;
    width: 100px;
    height: 30px;
    background-color: hsla(160, 100%, 37%, 1);
    color: white;
    border: 1px solid hsla(160, 100%, 37%, 1);
    border-radius: 5px;
    cursor: pointer;
    margin: auto;
    margin-top: 10px;
  }
}

.vistaPrevia {
  display: flex;
  flex-direction: column;
  width: 1000px;
}

table {
  /* width: 1000px; */
  border: 1px solid #ffffff;

  /* & th {
    background-color: rgb(79, 90, 86);
  } */

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
    cursor: pointer;
  }
}
</style>
