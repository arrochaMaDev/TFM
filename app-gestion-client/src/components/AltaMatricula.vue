<script setup lang="ts">
import { type Ref, ref, onMounted, watch } from 'vue'
import { useLoadingStore } from '@/stores/loading'
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

const getStudentsData = async () => {
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
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  } finally {
    loadingStore.loadingFalse()
  }
}

getStudentsData()

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
  } finally {
    loadingStore.loadingFalse()
  }
}

getSubjectsData()

// OBTENER DATOS DE LOS PROFESORES ASIGNADOS A ESA MATRICULA
const teachersBySubjectIdRefFromServer: Ref<{
  asignatura: {
    id: number
    nombre: string
  }
  teachers: {
    id: number
    teacher: {
      id: number
      nombre: string
      apellidos: string
      email: string
    }
  }[]
} | null> = ref(null)

// array para solo almacenar los profesores
const onlyTeachersArray: Ref<{
  id: number
  nombre: string
  apellidos: string
  email: string
}[]> = ref([])

const getTeachersData = async () => {
  try {
    if (!subjectSelected.value) {
      // Manejar el caso en el que no haya una asignatura seleccionada
      console.warn('No hay una asignatura seleccionada.')
      return
    }

    const response = await fetch(
      `http://localhost:3000/asignaturas_profesores/subject/${subjectSelected.value?.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = (await response.json()) as {
        asignatura: {
          id: number
          nombre: string
        }
        teachers: {
          id: number
          teacher: {
            id: number
            nombre: string
            apellidos: string
            email: string
          }
        }[]
      }
      teachersBySubjectIdRefFromServer.value = data
      console.log(teachersBySubjectIdRefFromServer.value)

      // mapeo los datos para solo almacenar los profesores
      onlyTeachersArray.value = teachersBySubjectIdRefFromServer.value.teachers.map(teacher => teacher.teacher)

      console.table(onlyTeachersArray.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    teachersBySubjectIdRefFromServer.value = null
  }
}

// getTeachersData()

// REFERENCIAS DE LA MATRICULA
const subjectSelected: Ref<{
  id: number
  nombre: string
} | null> = ref(null)

const teacherSelected: Ref<{
  id: number
  nombre: string
  apellidos: string
} | null> = ref(null)

const studentSelected: Ref<{
  id: number
  usuario_id: string
  nombre: string
  apellidos: string
  dni: string
  direccion: string
  telefono: string
  email: string
} | null> = ref(null)

watch(studentSelected, () => {
  if (!studentSelected.value) {
    subjectSelected.value = null
  }
});

const formSubmitted = ref(false); // variable para avisos con InlineText


// ENVIO DATOS POST A LA BD DE LA MATRICULA
const crearMatricula = async () => {
  const fullDate = new Date()
  let añoEscolar = new Date().getFullYear() //2024
  if (fullDate.getMonth() < 7) {
    añoEscolar -= 1
    // si estamos en julio es que ya habrá acabado el curso escolar anterior
  }
  console.log(añoEscolar)

  formSubmitted.value = true;
  let isValid = true;

  if (!teacherSelected.value || !subjectSelected.value || !teacherSelected.value) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false;
  }

  try {
    const response = await fetch('http://localhost:3000/matricula', {
      method: 'POST',
      body: JSON.stringify({
        alumno: studentSelected.value?.id,
        asignatura: subjectSelected.value?.id,
        profesor: teacherSelected.value?.id,
        year: añoEscolar
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

      const matricula = {
        alumno: {
          nombre: studentSelected.value?.nombre,
          apellidos: studentSelected.value?.apellidos
        },
        asignatura: subjectSelected.value?.nombre,
        profesor: {
          nombre: teacherSelected.value?.nombre,
          apellidos: teacherSelected.value?.apellidos
        }
      }

      const data = (await response.json()) as typeof matricula

      console.table(data)

      // reiniciar todos los valores menos el del alumno
      subjectSelected.value = null
      teacherSelected.value = null
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  } finally {
    teachersBySubjectIdRefFromServer.value = null
    onlyTeachersArray.value = []
    formSubmitted.value = false;
  }
}

// para resetear los datos del formulario y poner cada ref a vacío
const borrarDatosForm = () => {
  formSubmitted.value = false;
  studentSelected.value = null
  teacherSelected.value = null
  subjectSelected.value = null
}

// COMPONENTE COMO POPUP PARA EDITAR
const emit = defineEmits(['cerrarPopUp', 'obtenerMatriculas', 'resetearMatricula'])
const props = defineProps<{
  matriculaParaEditar: {
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
  } | null
  isEditing: boolean
}>()

let matriculaEditada = ref({ ...props.matriculaParaEditar })

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

</script>

<template>
  <div class="card col-12 xl:col-9 lg:col-12 md:col-12 sm:col-12">
    <form @submit.prevent="crearMatricula()">
      <h2>Nueva Matrícula</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12 ">
          <label class="">Seleccionar alumno</label>
          <Dropdown class="" :options="studentsRefFromServer" checkmark :highlightOnSelect="false" showClear placeholder="Selecciona un alumno" v-model="studentSelected">
            <template #option="slotProps">
              <div>
                {{ slotProps.option.nombre }}
                {{ slotProps.option.apellidos }} |
                {{ slotProps.option.dni }}
              </div>
            </template>

            <template #value="slotProps">
              <div v-if="slotProps.value">
                {{ slotProps.value.nombre }}
                {{ slotProps.value.apellidos }} |
                {{ slotProps.value.dni }}
              </div>
            </template>
          </Dropdown>
          <InlineMessage v-if="!studentSelected && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El alumno es obligatorio</InlineMessage>
        </div>

        <div class="field col-12 lg:col-4 md:col-12 sm:col-12 ">
          <label class="">Seleccionar asignatura</label>
          <Dropdown :disabled="!studentSelected" class="" :options="subjectsRefFromServer" checkmark :highlightOnSelect="false" optionLabel="nombre" showClear placeholder="Selecciona una asignatura"
            v-model="subjectSelected" @change="getTeachersData()">
          </Dropdown>
          <InlineMessage v-if="!subjectSelected && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La asignatura es obligatoria</InlineMessage>
        </div>

        <div class="field col-12 lg:col-4 md:col-12 sm:col-12 ">
          <label class="">Seleccionar profesor</label>
          <Dropdown :disabled="!subjectSelected" class="" :options="onlyTeachersArray" checkmark :highlightOnSelect="false" showClear placeholder="Selecciona un profesor" v-model="teacherSelected">
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
          <InlineMessage v-if="!subjectSelected && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La asignatura es obligatoria</InlineMessage>
        </div>

        <!-- Tabla del alumno seleccionado -->
        <div v-if="studentSelected" class="field col-12">
          <label class="text-xl text-800 font-bold pl-1">Datos del alumno</label>
          <DataTable :value="[studentSelected]" class="pt-1" tableStyle="width: 100%" :pt="{
      table: {
        class: 'mt-0 pl-1',
        style: { 'border': 'none' }
      }
    }
      ">
            <Column field="nombre" header="Nombre" Class="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
            <Column field="apellidos" header=" Apellidos" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
            <Column field="dni" header="DNI" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
            <Column field="direccion" header="Dirección" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
            <Column field="telefono" header="Teléfono" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
            <Column field="email" header="Email" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
          </DataTable>
        </div>

        <!-- Tabla del profesor seleccionado -->
        <div v-if="teacherSelected" class="field col-5">
          <label class="text-xl text-800 font-bold pl-1">Datos del profesor</label>
          <DataTable :value="[teacherSelected]" class="pt-1" tableStyle="width: 100%" :pt="{
      table: {
        class: 'mt-0 pl-1',
        style: { 'border': 'none' }
      }
    }
      ">
            <Column field="nombre" header="Nombre" Class="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
            <Column field="apellidos" header=" Apellidos" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
            <Column field="email" header="Email" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
          </DataTable>
        </div>
        <div class="field col-12">
          <Button class="justify-content-center w-auto h-auto" icon="pi pi-send" iconPos="left" type="submit" label="Enviar"></Button>
          <Button class="justify-content-center w-auto h-auto" severity="secondary" icon="pi pi-trash" iconPos="left" label="Borrar" @click="borrarDatosForm()"></Button>
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
