<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import { type Ref, ref } from 'vue'

const loadingStore = useLoadingStore() // store del Spinner

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

// REFERENCIAS DE LA ASIGNACIÓN
let subjectSelected: Ref<{
  id: number
  nombre: string
} | null> = ref(null)

let selectedSubjects: Ref<
  {
    // Array de las asignaturas seleccionadas
    id: number
    nombre: string
  }[]
> = ref([])

let teacherSelected: Ref<{
  id: number
  nombre: string
  apellidos: string
} | null> = ref(null)

const agregarAsignatura = () => {
  if (subjectSelected.value) {
    const existingSubject = selectedSubjects.value.find(
      (subject) => subject.id === subjectSelected.value?.id
    )
    if (!existingSubject) {
      // Si la asignatura no está en el array
      selectedSubjects.value.push(subjectSelected.value)
    } else {
      // Si la asignatura ya está
      console.log('La asignatura ya está en la lista')
    }
  }
}
const borrarAsignatura = (subjectId: number) => {
  // se usa el metodo filter para crear un nuevo array eliminando la asignatura seleccionada
  selectedSubjects.value = selectedSubjects.value.filter((subject) => subject.id !== subjectId)
}

// CREAR RELACIÓN ASIGNATURA-PROFESOR
const crearSubjectTeacher = () => {
  selectedSubjects.value.forEach((subject) => {
    if (teacherSelected.value) {
      fetchSubjectTeacher(subject.id, teacherSelected.value.id)
    }
  })
}

const fetchSubjectTeacher = async (subjectId: number, teacherId: number) => {
  try {
    const response = await fetch('http://localhost:3000/asignatura_profesor', {
      method: 'POST',
      body: JSON.stringify({
        asignatura: teacherId,
        profesor: subjectId
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      alert('Realizado correctamente')

      const subjectTeacher = {
        profesor: {
          nombre: teacherSelected.value?.nombre,
          apellidos: teacherSelected.value?.apellidos
        },
        asignatura: subjectSelected.value?.nombre
      }

      const data = (await response.json()) as typeof subjectTeacher

      console.table(data)

      // reiniciar todos los valores
      teacherSelected.value = null
      subjectSelected.value = null
      selectedSubjects.value = []
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  }
}

// COMPONENTE COMO POPUP PARA EDITAR
const emit = defineEmits(['cerrarPopUp', 'obtenerSubjectsTeachers', 'resetearSubjectTeacher'])
const props = defineProps<{
  subjectTeacherParaEditar:
    | {
        id: number
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

let subjectTeacherEditada = ref({ ...props.subjectTeacherParaEditar })
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
const actualizarSubjectTeacher = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/asignatura_profesor/${subjectTeacherEditada.value?.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          newSubject: subjectTeacherEditada.value?.subject,
          newTeacher: subjectTeacherEditada.value?.teacher
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (!response.ok) {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      alert('Realizado con éxito')
      // Imprimo los datos que he introducido
      const subjectTeacherAcualizada = {
        subject: {
          id: subjectTeacherEditada.value.subject?.id,
          nombre: subjectTeacherEditada.value.subject?.nombre
        },
        teacher: {
          id: subjectTeacherEditada.value.teacher?.id,
          nombre: subjectTeacherEditada.value.teacher?.nombre,
          apellidos: subjectTeacherEditada.value.teacher?.apellidos
        }
      }
      console.table(subjectTeacherAcualizada)
      popUpStyle.value = false
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    emit('cerrarPopUp')
    emit('obtenerSubjectsTeachers')
  }
}

// para resetear los valores como están actualmente en la BD
// const resetearValoresIniciales = () => {
//   console.log('resetear valores iniciales')
//   const subject = props.matriculaParaEditar?.subject
//   const teacher = props.matriculaParaEditar?.teacher

//   if (subject && teacher) {
//     matriculaEditada.value.subject = { id: subject.id, nombre: subject.nombre }
//     matriculaEditada.value.teacher = {
//       id: teacher.id,
//       nombre: teacher.nombre,
//       apellidos: teacher.apellidos
//     }
//   }

// matriculaEditada.value.subject = props.matriculaParaEditar?.subject
// matriculaEditada.value.teacher = props.matriculaParaEditar?.teacher
//   emit( 'resetearSubjectTeacher',  subjectTeacherEditada) // hago el emit y paso además matriculaEditada según el valor de solo lectura de las props recibidas

//   return matriculaEditada.value
// }

const handleSubjectTeacher = () => {
  if (popUpStyle.value) {
    actualizarSubjectTeacher()
  } else {
    crearSubjectTeacher()
  }
}
</script>

<template>
  <div class="container" :class="{ matriculaPopup: popUpStyle }">
    <div class="form" :class="{ 'matriculaPopup-content': popUpStyle }">
      <h1>Relación de asignaturas</h1>
      <form @submit.prevent="handleSubjectTeacher()">
        <div v-if="!popUpStyle">
          <!--MODO CREAR -->
          <table>
            <tr>
              <th>
                <label for="profesor">Selecciona el profesor</label>
              </th>
              <th>
                <label for="asignatura">Selecciona la asignatura</label>
              </th>
            </tr>
            <tr>
              <td>
                <select name="profesor" id="" v-model="teacherSelected">
                  <option
                    v-for="teacher in teachersRefFromServer"
                    :key="teacher.id"
                    :value="teacher"
                  >
                    {{ teacher.nombre }} {{ teacher.apellidos }}
                  </option>
                </select>
              </td>
              <td>
                <select name="asignatura" id="" v-model="subjectSelected">
                  <option
                    v-for="subject in subjectsRefFromServer"
                    :key="subject.id"
                    :value="subject"
                  >
                    {{ subject.nombre }}
                  </option>
                </select>
              </td>
              <td>
                <button type="button" @click="agregarAsignatura()">Agregar</button>
              </td>
            </tr>
            <tr v-for="subject in selectedSubjects" :key="subject.id">
              <td>{{ subject.nombre }}</td>
              <td><button type="button" @click="borrarAsignatura(subject.id)">Borrar</button></td>
            </tr>
          </table>
        </div>

        <div v-if="popUpStyle">
          <!--MODO ACTUALIZAR -->
          <label for="profesor">Selecciona el profesor</label>
          <select name="profesor" id="" v-model="subjectTeacherEditada.teacher">
            <option v-for="teacher in teachersRefFromServer" :key="teacher.id" :value="teacher">
              {{ teacher.nombre }} {{ teacher.apellidos }}
            </option>
          </select>
          <label for="asignatura">Selecciona la asignatura</label>
          <select name="asignatura" id="" v-model="subjectTeacherEditada.subject">
            <option v-for="subject in subjectsRefFromServer" :key="subject.id" :value="subject">
              {{ subject.nombre }}
            </option>
          </select>
        </div>
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
    text-align: center;
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
}
</style>
