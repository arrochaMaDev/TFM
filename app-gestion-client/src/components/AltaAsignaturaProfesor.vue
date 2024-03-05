<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'
import { type Ref, ref } from 'vue'
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const toast = useToast();

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
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
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
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    ('Ha ocurrido un error')
  }
}

getTeachersData()

// REFERENCIAS DEL FORMULARIO
// let subjectSelected: Ref<{
//   id: number
//   nombre: string
// } | null> = ref(null)

const selectedSubjects: Ref<
  {
    // Array de las asignaturas seleccionadas
    id: number
    nombre: string
  }[]
> = ref([])

const teacherSelected: Ref<{
  id: number
  nombre: string
  apellidos: string
} | null> = ref(null)

const formSubmitted = ref(false); // variable para avisos con InlineText

// const agregarAsignatura = () => {
//   if (subjectSelected.value) {
//     const existingSubject = selectedSubjects.value.find(
//       (subject) => subject.id === subjectSelected.value?.id
//     )
//     if (!existingSubject) {
//       // Si la asignatura no está en el array
//       selectedSubjects.value.push(subjectSelected.value)
//     } else {
//       // Si la asignatura ya está
//       console.log('La asignatura ya está en la lista')
//     }
//   }
// }
// const borrarAsignatura = (subjectId: number) => {
//   // se usa el metodo filter para crear un nuevo array eliminando la asignatura seleccionada
//   selectedSubjects.value = selectedSubjects.value.filter((subject) => subject.id !== subjectId)
// }

// CREAR RELACIÓN ASIGNATURA-PROFESOR
const crearSubjectTeacher = () => {
  formSubmitted.value = true;
  let isValid = true

  if (!teacherSelected.value || selectedSubjects.value.length === 0) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (isValid) {
    selectedSubjects.value.forEach((subject) => {
      if (teacherSelected.value) {
        fetchSubjectTeacher(subject.id, teacherSelected.value.id)
      }
    })
  }
}

const fetchSubjectTeacher = async (subjectId: number, teacherId: number) => {
  try {
    const response = await fetch('http://localhost:3000/asignatura_profesor', {
      method: 'POST',
      body: JSON.stringify({
        asignatura: subjectId,
        profesor: teacherId
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      toast.add({ severity: 'success', summary: 'Creado', detail: 'Asignación creada', life: 3000 });

      const subjectTeacher = {
        profesor: {
          nombre: teacherSelected.value?.nombre,
          apellidos: teacherSelected.value?.apellidos
        },
        asignaturas: selectedSubjects.value?.toString()
      }

      const data = (await response.json()) as typeof subjectTeacher

      console.table(data)

      // reiniciar todos los valores
      teacherSelected.value = null
      // subjectSelected.value = null
      selectedSubjects.value = []
      formSubmitted.value = false;

    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
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

// para resetear los datos del formulario y poner cada ref a vacío
function borrarDatosForm() {
  formSubmitted.value = false;
  selectedSubjects.value = []
  teacherSelected.value = null
}
</script>

<template>
  <div class="card col-12 xl:col-9 lg:col-12 md:col-12 sm:col-12">
    <form @submit.prevent="crearSubjectTeacher()">
      <h2>Nueva Asignación</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12 ">
          <label class="">Seleccionar profesor</label>
          <Dropdown class="" :options="teachersRefFromServer" checkmark :highlightOnSelect="false" showClear placeholder="Selecciona un profesor" v-model="teacherSelected">
            <template #option="slotProps">
              <div>
                {{ slotProps.option.nombre }}
                {{ slotProps.option.apellidos }} |
                {{ slotProps.option.email }}
              </div>
            </template>

            <template #value="slotProps">
              <div v-if="slotProps.value">
                {{ slotProps.value.nombre }}
                {{ slotProps.value.apellidos }} |
                {{ slotProps.value.email }}
              </div>
            </template>
          </Dropdown>
          <InlineMessage v-if="!teacherSelected && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El profesor es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12 ">
          <label class="">Seleccionar Asignaturas</label>
          <MultiSelect :disabled="!teacherSelected" class="" :options="subjectsRefFromServer" optionLabel="nombre" display="chip" filter placeholder="Selecciona asignaturas"
            v-model="selectedSubjects">

          </MultiSelect>
          <InlineMessage v-if="selectedSubjects.length == 0 && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">Las asignaturas son obligatorias</InlineMessage>
        </div>
        <div class="field col-12">
          <Button class="justify-content-center w-auto h-auto" icon="pi pi-send" iconPos="left" type="submit" label="Enviar"></Button>
          <Button class="justify-content-center w-auto h-auto" severity="secondary" icon="pi pi-trash" iconPos="left" label="Borrar" @click="borrarDatosForm()"></Button>
        </div>
        <div>

        </div>
      </div>
    </form>
  </div>
  <Toast :pt="{
      container: {
        class: 'align-items-center'
      },
      closeButton: {
        class: 'border-1'
      }
    }">
  </Toast>
</template>

<style scoped></style>
