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

const getMatriculasData = async () => {
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

getMatriculasData()

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
      alert('Matricula creada')

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

      // reiniciar todos los valores menos el del alumno
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

// COMPONENTE COMO POPUP PARA EDITAR
const emit = defineEmits(['cerrarPopUp', 'obtenerMatriculas', 'resetearMatricula'])
const props = defineProps<{
  matriculaParaEditar:
    | {
        id: number
        student: {
          id: number
          nombre: string
          apellidos: string
          dni: string
        }
        subject: {
          id: number
          nombre: string
        }
        teacher: {
          id: number
          nombre: string
          apellidos: string
        }
      }
    | undefined
  isEditing: boolean
}>()

let matriculaEditada = ref({ ...props.matriculaParaEditar })
// let matriculaEditada = ref({
//   id: props.matriculaParaEditar?.id || 0,
//   student: {
//     id: props.matriculaParaEditar?.student.id || 0,
//     nombre: props.matriculaParaEditar?.student.nombre || '',
//     apellidos: props.matriculaParaEditar?.student.apellidos || '',
//     dni: props.matriculaParaEditar?.student.dni || ''
//   },
//   subject: {
//     id: props.matriculaParaEditar?.subject.id || 0,
//     nombre: props.matriculaParaEditar?.subject.nombre || ''
//   },
//   teacher: {
//     id: props.matriculaParaEditar?.teacher.id || 0,
//     nombre: props.matriculaParaEditar?.teacher.nombre || '',
//     apellidos: props.matriculaParaEditar?.teacher.apellidos || ''
//   }
// })

let popUpStyle: Ref<boolean> = ref(props.isEditing) // variable para activar el estilo popUp

// FETCH PARA ACTUALIZAR MATRICULA:
const actualizarMatricula = async () => {
  try {
    const response = await fetch(`http://localhost:3000/matricula/${matriculaEditada.value?.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        newSubject: matriculaEditada.value?.subject,
        newTeacher: matriculaEditada.value?.teacher
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      alert('Matricula Editada')
      // Imprimo los datos que he introducido
      const matriculaAcualizada = [
        matriculaEditada.value?.student?.nombre,
        matriculaEditada.value?.student?.apellidos,
        matriculaEditada.value?.student?.dni,
        matriculaEditada.value?.subject?.nombre,
        matriculaEditada.value?.teacher?.nombre,
        matriculaEditada.value?.teacher?.apellidos
      ]
      console.table(matriculaAcualizada)
      popUpStyle.value = false
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    emit('cerrarPopUp')
    emit('obtenerMatriculas')
  }
}

// para resetear los valores como están actualmente en la BD
const resetearValoresIniciales = () => {
  console.log('resetear valores iniciales')
  const subject = props.matriculaParaEditar?.subject
  const teacher = props.matriculaParaEditar?.teacher

  if (subject && teacher) {
    matriculaEditada.value.subject = { id: subject.id, nombre: subject.nombre }
    matriculaEditada.value.teacher = {
      id: teacher.id,
      nombre: teacher.nombre,
      apellidos: teacher.apellidos
    }
  }

  // matriculaEditada.value.subject = props.matriculaParaEditar?.subject
  // matriculaEditada.value.teacher = props.matriculaParaEditar?.teacher
  emit('resetearMatricula', matriculaEditada) // hago el emit y paso además matriculaEditada según el valor de solo lectura de las props recibidas

  return matriculaEditada.value
}

const handleMatricula = () => {
  if (popUpStyle.value) {
    actualizarMatricula()
  } else {
    crearMatricula()
  }
}
</script>

<template>
  <div class="container" :class="{ matriculaPopup: popUpStyle }">
    <div class="form" :class="{ 'matriculaPopup-content': popUpStyle }">
      <h1>Matricula</h1>
      <form @submit.prevent="handleMatricula()">
        <div v-if="!popUpStyle">
          <!--MODO CREAR -->
          <table>
            <tr>
              <th>
                <label for="alumno">Selecciona el alumno</label>
              </th>
              <th>
                <label for="asignatura">Selecciona la asignatura</label>
              </th>
              <th>
                <label for="profesor">Selecciona el profesor</label>
              </th>
            </tr>
            <tr>
              <td>
                <select name="alumno" id="" v-model="studentMatricula">
                  <option
                    v-for="student in studentsRefFromServer"
                    :key="student.id"
                    :value="student"
                  >
                    {{ student.nombre }} {{ student.apellidos }} {{ student.dni }}
                  </option>
                </select>
              </td>
              <td>
                <select name="asignatura" id="" v-model="subjectMatricula">
                  <option
                    v-for="subject in subjectsRefFromServer"
                    :key="subject.id"
                    :value="subject"
                  >
                    {{ subject.nombre }}
                  </option>
                </select>
              </td>
              <select name="profesor" id="" v-model="teacherMatricula">
                <option v-for="teacher in teachersRefFromServer" :key="teacher.id" :value="teacher">
                  {{ teacher.nombre }} {{ teacher.apellidos }}
                </option>
              </select>
            </tr>
          </table>
        </div>

        <div v-if="popUpStyle">
          <!--MODO ACTUALIZAR -->
          <label for="asignatura">Selecciona la asignatura</label>
          <select name="asignatura" id="" v-model="matriculaEditada.subject">
            <option v-for="subject in subjectsRefFromServer" :key="subject.id" :value="subject">
              {{ subject.nombre }}
            </option>
          </select>
          <label for="profesor">Selecciona el profesor</label>
          <select name="profesor" id="" v-model="matriculaEditada.teacher">
            <option v-for="teacher in teachersRefFromServer" :key="teacher.id" :value="teacher">
              {{ teacher.nombre }} {{ teacher.apellidos }}
            </option>
          </select>
        </div>
        <button type="reset" v-if="popUpStyle" @click="resetearValoresIniciales()">Resetear</button>
        <button type="submit">{{ popUpStyle ? 'Actualizar' : 'Enviar' }}</button>
        <button type="button" v-if="popUpStyle" @click="emit('cerrarPopUp')">Cancelar</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
table {
  margin-top: 0px;
  width: max-content;
  border: none;

  & td {
    width: fit-content;
    text-align: left;
    vertical-align: top;
    border: none;
    border-spacing: 0;
    text-align: center; /* Centrar contenido de celdas */
  }
}
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
.container.matriculaPopup {
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

.matriculaPopup-content {
  background: #000000;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid white;
  display: flex;
  flex-direction: column; /* Añadido para disponer los elementos verticalmente */

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
</style>
