<script setup lang="ts">
import { ref, type Ref } from 'vue'

// Referencias del formulario
const studentRef = {
  nombre: ref<string | undefined>(undefined),
  apellidos: ref<string | undefined>(undefined),
  dni: ref<string | undefined>(undefined),
  direccion: ref<string | undefined>(undefined),
  telefono: ref<number | undefined>(undefined),
  email: ref<string | undefined>(undefined)
}

// Resetear los datos del formulario y poner cada ref a vacío
const borrarDatosForm = () => {
  studentRef.nombre.value = undefined
  studentRef.apellidos.value = undefined
  studentRef.dni.value = undefined
  studentRef.direccion.value = undefined
  studentRef.telefono.value = undefined
  studentRef.email.value = undefined
}

// VALIDAR DATOS DEL FORMULARIO
const patronTel = /^\d{9}$/
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// FETCH PARA ENVIAR DATOS DEL ALUMNO A LA BD:
const crearAlumno = async () => {
  if (!studentRef.telefono.value || !patronTel.test(studentRef.telefono.value.toString())) {
    alert('El número de teléfono debe tener 9 dígitos numéricos.')
    return
  }
  if (!studentRef.email.value || !patronEmail.test(studentRef.email.value)) {
    alert('Por favor, introduce un email válido.')
    return
  } else {
    try {
      const response = await fetch('http://localhost:3000/student', {
        method: 'POST',
        body: JSON.stringify({
          nombre: studentRef.nombre.value,
          apellidos: studentRef.apellidos.value,
          dni: studentRef.dni.value,
          direccion: studentRef.direccion.value,
          telefono: Number(studentRef.telefono.value),
          email: studentRef.email.value
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        alert('Alumno Creado')
        // Imprimo los datos que he introducido
        const datosAlumno = [
          studentRef.nombre.value,
          studentRef.apellidos.value,
          studentRef.dni.value,
          studentRef.direccion.value,
          studentRef.telefono.value,
          studentRef.email.value
        ]
        console.table(datosAlumno)
        borrarDatosForm()
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      alert('Ha ocurrido un error')
    }
  }
}

// COMPONENTE COMO POPUP PARA EDITAR
const emit = defineEmits(['cerrarPopUp', 'obtenerAlumnos', 'resetearAlumno'])
const props = defineProps<{
  alumnoParaEditar:
    | {
        id: number
        // usuario_id: string
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
          telefono: Number(alumnoEditado.value?.telefono),
          email: alumnoEditado.value?.email
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        alert('Alumno Editado')
        // Imprimo los datos que he introducido
        const alumnoActualizado = [
          alumnoEditado.value?.nombre,
          alumnoEditado.value?.apellidos,
          alumnoEditado.value?.dni,
          alumnoEditado.value?.direccion,
          alumnoEditado.value?.telefono,
          alumnoEditado.value?.email
        ]
        console.table(alumnoActualizado)
        popUpStyle.value = false
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
  emit('resetearAlumno', alumnoEditado) // hago el emit y paso además el alumnoEditado según el valor de solo lectura de las props recibidas
}

// FUNCION PARA ENVIAR DATOS DEL FORMULARIO
const enviarDatosFormulario = () => {
  if (popUpStyle.value) {
    actualizarAlumno() // Función para actualizar alumno en modo edición
  } else {
    crearAlumno() // Función para crear un nuevo alumno
  }
}
</script>

<template>
  <div class="container" :class="{ altaAlumnosPopup: popUpStyle }">
    <div class="form" :class="{ 'altaAlumnosPopup-content': popUpStyle }">
      <h1 v-if="popUpStyle" class="green">Editar alumno</h1>
      <h1 v-else class="green">Alta alumno</h1>
      <form @submit.prevent="enviarDatosFormulario()">
        <div v-if="!popUpStyle">
          <!--MODO CREAR -->
          <label class="green">Nombre</label>
          <input type="text" id="nombreInput" required v-model="studentRef.nombre.value" />
          <label class="green">Apellidos</label>
          <input type="text" id="apellidosInput" required v-model="studentRef.apellidos.value" />
          <label class="green">Dni</label>
          <input type="text" id="dniInput" required v-model="studentRef.dni.value" />
          <label class="green">Teléfono</label>
          <input
            type="tel"
            pattern="^\d{9}$"
            id="telefonoInput"
            required
            v-model="studentRef.telefono.value"
          />
          <label class="green">Dirección</label>
          <input type="text" id="direcciónInput" required v-model="studentRef.direccion.value" />
          <label class="green">Email</label>
          <input type="email" id="emailInput" required v-model="studentRef.email.value" />
        </div>
        <div v-if="popUpStyle">
          <!--MODO ACTUALIZAR -->
          <label class="green">Nombre</label>
          <input type="text" id="nombreInput" required v-model="alumnoEditado.nombre" />
          <label class="green">Apellidos</label>
          <input type="text" id="apellidosInput" required v-model="alumnoEditado.apellidos" />
          <label class="green">Dni</label>
          <input type="text" id="dniInput" required v-model="alumnoEditado.dni" />
          <label class="green">Teléfono</label>
          <input
            type="tel"
            pattern="^\d{9}$"
            id="telefonoInput"
            required
            v-model="alumnoEditado.telefono"
          />
          <label class="green">Dirección</label>
          <input type="text" id="direcciónInput" required v-model="alumnoEditado.direccion" />
          <label class="green">Email</label>
          <input required type="email" id="emailInput" v-model="alumnoEditado.email" />
        </div>
        <button type="reset" @click="borrarDatosForm()">Borrar datos</button>
        <button type="reset" v-if="popUpStyle" @click="resetearValoresIniciales">Resetear</button>
        <button type="submit">{{ popUpStyle ? 'Actualizar' : 'Enviar' }}</button>
        <button type="button" v-if="popUpStyle" @click="emit('cerrarPopUp')">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* .form {
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
.container.altaAlumnosPopup {
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
  display: flex;
  flex-direction: column; 

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
} */
</style>
