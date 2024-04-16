<script setup lang="ts">
import { type Ref, ref, watch, inject, onMounted } from 'vue'
import Dropdown from 'primevue/dropdown';
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import router from '@/router';
import { useAdminStore } from '@/stores/isAdmin';
import type { VueCookies } from 'vue-cookies';

const toast = useToast();

// VERIFICAR SI SE ES ADMINISTRADOR
const adminStore = useAdminStore()
const $cookies = inject<VueCookies>('$cookies')
const isAdmin = ref(adminStore.isAdmin)

onMounted(() => {
  const userCookie = $cookies?.get('user') // si no existe, userCookie es null
  // console.log(userCookie)
  if (userCookie?.permiso == '9') {
    adminStore.isAdminTrue()
  }
  else if (!isAdmin.value || userCookie?.permiso == null || userCookie?.permiso != '9') {
    adminStore.isAdminFalse()
    toast.add({ severity: 'info', summary: 'No tienes permiso', detail: 'No tienes permiso de administrador para ver esta página', group: 'tc', life: 3000, });

    setTimeout(() => {
      router.push('/')
    }, 3000)
  }
})

// OBTENER DATOS DE TODOS LOS ESTUDIANTES
const studentsRefFromServer: Ref<
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
  }
}

getStudentsData()

// OBTENER DATOS DE TODAS LAS ASIGNATURAS
const subjectsRefFromServer: Ref<
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

const getTeachersBySubjectData = async () => {
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

watch([studentSelected, subjectSelected], () => {
  if (!studentSelected.value) {
    subjectSelected.value = null
    teacherSelected.value = null
  }
  if (!subjectSelected.value) {
    teacherSelected.value = null
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
  if (!existenDuplicados) {
    if (isValid) {
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
          toast.add({ severity: 'success', summary: 'Creado', detail: 'Matrícula creada', life: 3000 });

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
  } else { // existenDuplicados == true
    toast.add({ severity: 'warn', summary: 'Error', detail: 'El alumno ya está matriculado en esa asignatura', life: 3000 });
  }
}

// LÓGICA PARA EVITAR DUPLICADOS: obtener matriculas de todos y comprobar si ya existe esa asignatura

// Obtener estudiantes
const matriculasByStudentId: Ref<{
  student: {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
    email: string
  },
  matriculas: {
    id: number,
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      email: string
    }
    year: number
  }[]
} | undefined> = ref(undefined)

const getMatriculasByStudentId = async (studentId: number) => {
  // console.log(teacher)
  try {
    const response = await fetch(`http://localhost:3000/matriculas/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (response.status === 404) {
      console.warn(`El estudiante con id ${studentId} no tiene matrículas`);
      return null;
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }
    else {
      const data = await response.json()
      console.log(data);

      // Verificar si el array de asignaciones está vacío
      if (data && data.matriculas && data.matriculas.length > 0) {
        matriculasByStudentId.value = data;
        console.table(matriculasByStudentId.value)
        return data;
      }

    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)

    if (error.message.includes('404')) {
      return null;
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al obtener los datos de este estudiante', life: 3000 });
    }
  }
}

// Chequear si el alumno ya está matriculado en esa asignatura
const existenDuplicados = () => {
  if (studentSelected.value) {
    getMatriculasByStudentId(studentSelected.value?.id)
  }

  if (matriculasByStudentId.value && subjectSelected) {
    // recorro el array y extraigo todos los Ids de las asignaturas que haya
    const subjectsIdsOfMatriculasOfStudent = matriculasByStudentId.value.matriculas.map(matricula => matricula.subject.id);
    const selectedSubjectId = subjectSelected.value?.id
    const duplicados = subjectsIdsOfMatriculasOfStudent.filter(subjectId => subjectId === selectedSubjectId); // filtro si esa asignatura ya se encuentra en las matriculas del alumno

    if (duplicados.length > 0) {
      return true
    }
    if (duplicados.length == 0) {
      return false
    }
  }
};

// para resetear los datos del formulario y poner cada ref a vacío
const borrarDatosForm = () => {
  formSubmitted.value = false;
  studentSelected.value = null
  teacherSelected.value = null
  subjectSelected.value = null
}

</script>

<template>
  <Toast position="top-center" group="tc" :pt="{
    container: {
      class: 'align-items-center m-8 w-max',
    },
    closeButton: {
      class: 'border-1'
    }
  }
    "></Toast>
  <div class="card col-12 xl:col-9 lg:col-12 md:col-12 sm:col-12" v-if="isAdmin">
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
            v-model="subjectSelected" @change="getTeachersBySubjectData()">
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
          <InlineMessage v-if="!teacherSelected && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El profesor es obligatorio</InlineMessage>
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
          <Button class="justify-content-center w-auto h-auto mr-2" icon="pi pi-send" iconPos="left" type="submit" label="Enviar"></Button>
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
