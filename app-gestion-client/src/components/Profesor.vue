<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown';
import { FilterMatchMode } from 'primevue/api';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';

const confirm = useConfirm();
const toast = useToast();
const router = useRouter()

const teacherDataFromServer: Ref<{
  id: number
  nombre: string
  apellidos: string
  email: string
  userId: {
    id: number
    username: string
    email: string
    permiso: number | string // para poder cambiar el permiso a string
  }
} | undefined> = ref(undefined)


const teacherId = Number(router.currentRoute.value.params.id)
console.log(teacherId)
console.log(router.currentRoute.value.params['id'])

// OBTENER DATOS DEL PROFESOR
const getTeacherData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/teacher/${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()
      teacherDataFromServer.value = data
      console.log(teacherDataFromServer.value)
      // Para cambiar el permiso a string
      if (teacherDataFromServer.value) {
        teacherDataFromServer.value.userId.permiso = PermisoToString(Number(teacherDataFromServer.value?.userId.permiso))
      }
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error obteniendo los datos del profesor', life: 3000 });
  }
}

const PermisoToString = (permiso: number) => {
  switch (permiso) {
    case 0:
      return 'Alumno'
    case 1:
      return 'Profesor'
    case 9:
      return 'Administrador'
    default:
      return 'Desconocido'
  }
}

// OBTENER ASIGNATURAS DEL PROFESOR
const subjectsByTeacherIdFromServer: Ref<{
  teacher: {
    id: number
    nombre: string
    apellidos: string
    asignaturas: string
  }
  asignaciones: {
    id: number
    subject: {
      id: number
      nombre: string
    }
  }[]
} | null> = ref(null)

const getSubjectsByTeacherData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/asignaturas_profesores/teacher/${teacherId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.status == 404) {
      toast.add({ severity: 'info', summary: 'Error', detail: 'El profesor no tiene asignaturas asignadas', life: 3000 });
      return
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      // loadingStore.loadingTrue()
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      const data = await response.json()
      subjectsByTeacherIdFromServer.value = data
      console.log(data)
      console.log(subjectsByTeacherIdFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo las asignaturas asignadas', life: 3000 });
  }
  // finally {
  //   loadingStore.loadingFalse()
  // }
}

// OBTENER ALUMNOS MATRICULADOS CON EL PROFESOR
const matriculasRefFromServer: Ref<{
  teacher: {
    id: number
    nombre: string
    apellidos: string
    asignaturas: string
  }
  matriculas: {
    id: number
    student: {
      id: number
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: string
      email: string
    }
    subject: {
      id: number
      nombre: string
    }
    year: number
  }[]
} | null> = ref(null)

const getMatriculasData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/matriculas/teacher/${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status == 404) {
      toast.add({ severity: 'info', summary: 'Error', detail: 'El profesor no tiene a ningún alumno matriculado', life: 3000 });
      return
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      // loadingStore.loadingTrue()
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      const data = await response.json()
      matriculasRefFromServer.value = data
      console.log(data)
      console.log(matriculasRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo a los alumnos matriculados', life: 3000 });
  }
  // finally {
  //   loadingStore.loadingFalse()
  // }
}
getMatriculasData()
getSubjectsByTeacherData()
getTeacherData()

// LÓGICA BORRAR PROFESOR
const confirmDeleteProfesor = () => {
  console.log("borrando profesor")
  confirm.require({
    message: '¿Seguro que quiere eliminar este profesor?',
    header: 'Borrar Profesor',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarProfesor()
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

const borrarProfesor = async () => {
  try {
    const response = await fetch(`http://localhost:3000/teacher/${teacherId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Profesor borrado', life: 3000 });
      toast.add({ severity: 'info', summary: 'Redirigiendo', detail: 'Redirigiendo al listado de profesores...', life: 3000 });
      setTimeout(() => {
        router.push('/listado-profesores')
      }, 2000)
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)

    if (error.message.includes('400')) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se puede borrar el profesor porque tiene asignaturas o matrículas asignadas', life: 3000 });
    }
    else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al borrar al alumno', life: 3000 });
    }
  }
}

// LÓGICA EDITAR PROFESOR
const visibleDialogProfesor: Ref<boolean> = ref(false);

const profesorEditar: Ref<
  | {
    id: number
    nombre: string
    apellidos: string
    email: string
    userId: {
      id: number
      username: string
      email: string
      permiso: number | string // para poder cambiar el permiso a string
    }
  }> = ref({
    id: 0,
    nombre: '',
    apellidos: '',
    email: '',
    userId: {
      id: 0,
      username: '',
      email: '',
      permiso: ''
    }
  }); // lo inicializo para evitar problemas con null o undefined en v-model

const mostrarDialogEditarProfesor = async () => {
  await getUsersData()
  await getTeacherData()

  visibleDialogProfesor.value = true
  if (teacherDataFromServer.value) {
    profesorEditar.value = { ...teacherDataFromServer.value }
  }
  console.table(profesorEditar.value)
}

// validar datos del dialog
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const editarProfesor = async () => {
  console.log(profesorEditar.value.userId.id)
  let isValid = true
  if (!patronEmail.test(profesorEditar.value.email)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (!profesorEditar.value.nombre || !profesorEditar.value.apellidos || !profesorEditar.value.email || !profesorEditar.value.userId.id) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (isValid) {
    try {
      const response = await fetch(`http://localhost:3000/teacher/${profesorEditar.value?.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: profesorEditar.value?.nombre,
          apellidos: profesorEditar.value?.apellidos,
          email: profesorEditar.value?.email,
          userId: profesorEditar.value?.userId.id
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Editado', detail: 'Profesor editado', life: 3000 });
        const profesorActualizado = {
          nombre: profesorEditar.value?.nombre,
          apellidos: profesorEditar.value?.apellidos,
          email: profesorEditar.value?.email,
          userId: profesorEditar.value?.userId.id
        };
        console.table(profesorActualizado)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    } finally {
      visibleDialogProfesor.value = false
      getTeacherData()
    }
  }
}

//OBTENER USUARIOS PARA EDITAR ASIGNACION
const usersRefFromServer: Ref<{
  id: number,
  username: string,
  email: string,
  permiso: number | string
}[]> = ref([])

const selectedUserId: Ref<number | undefined> = ref(undefined)

const getUsersData = async () => {
  try {
    const response = await fetch('http://localhost:3000/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json() as {
        id: number
        username: string
        email: string
        permiso: number
      }[]
      usersRefFromServer.value = data
      // console.table(usersRefFromServer.value)
      // console.log(data)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}
getUsersData()

//OBTENER USUARIO PARA MOSTRAR EN LA TABLA AL EDITAR
const getUser = async () => {
  if (profesorEditar.value.userId.id != undefined) {
    try {
      const response = await fetch(`http://localhost:3000/usuario/${profesorEditar.value.userId.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        const data = await response.json() as {
          id: number
          username: string
          email: string
          permiso: number
        }
        profesorEditar.value.userId = data
        // console.table(user.value)

        // PERMISO A STRING
        switch (profesorEditar.value.userId.permiso) {
          case 0:
            profesorEditar.value.userId.permiso = 'Alumno'
            break;
          case 1:
            profesorEditar.value.userId.permiso = 'Profesor'
            break;
          case 9:
            profesorEditar.value.userId.permiso = 'Aministrador'
            break;
          case null:
            profesorEditar.value.userId.permiso = '';
            break;
        }
      }
    }
    catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    }
  }
}

// volver a la página anterior
const volver = () => {
  window.history.back()
}

// Ir a la página idividual del profesor
const goToStudent = (id: number) => {
  router.push({
    path: `/alumno/${id}`,
  });
  window.scrollTo({ top: 0 }); // para ir al inicio de la pagina
}

// Filtrar datos
const filters = ref() // variable filtro
const filters1 = ref() // variable filtro

const initFilters = () => { // componente filtro en global para que busque cualquier valor
  filters.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
  filters1.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.dni': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.direccion': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.telefono': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}
initFilters()

const clearFilter = () => { // para borrar los filtros, reinicio la función y el value = null
  initFilters()
}
</script>

<template>
  <div class="col-10">
    <div class="grid">
      <div id="header" class="flex col-12 justify-content-between h-auto mb-2">
        <h2 class="m-0 text-4xl text-800 font-bold">Perfil del Profesor</h2>
        <Button class="w-auto" severity="secondary" @click="volver()">Volver</Button>
      </div>
      <div id="photo" class="card col-fixed flex align-items-center justify-content-center col-3 h-20rem w-20rem">
        <img src="../utils/img/user-profile-img.jpg" alt="" class="h-20rem w-20rem">
        <!--TODO Hay que añadir fotos a la base de datos -->
      </div>
      <div id="datos" class="card col ml-5">
        <div id="Datos-personales" class="mb-5">
          <h6 class="m-1 text-2xl text-800 font-bold"> {{ teacherDataFromServer?.nombre }} {{ teacherDataFromServer?.apellidos }}</h6>
          HAY QUE AÑADIR DNI A LA BASE DE DATOS
          <!-- <h6 class="m-1 text-xl text-800 font-bold"> {{ teacherDataFromServer?.dni }}</h6> -->

          <ul id="datos-contacto" class="list-none p-0">
            <li class="flex mb-3">
              <div class="bg-green-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-home text-green-500" style="font-size: 2rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Dirección</span>
                HAY QUE AÑADIR DIRECCION A LA BASE DE DATOS
                <!-- <span class="flex justify-content-start "> {{ teacherDataFromServer?.direccion }}</span> -->
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-blue-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-phone text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Teléfono</span>
                HAY QUE AÑADIR TELEFONO A LA BASE DE DATOS

                <!-- <a :href="'tel:' + teacherDataFromServer?.telefono" class="flex justify-content-start"> {{ teacherDataFromServer?.telefono }}</a> -->
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-pink-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-envelope text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Email</span>
                <a :href="'mailto:' + teacherDataFromServer?.email" class="flex justify-content-start"> {{ teacherDataFromServer?.email }}</a>
              </div>
            </li>
          </ul>
        </div>
        <!-- TODO mostrar solo si es admin -->
        <div id="datosUsuario" class="">
          <h6 class="text-xl text-800 font-bold"> Usuario asignado</h6>
          <ul id="datos-contacto" class="list-none p-0 flex align-items-center">
            <li class="flex mb-3">
              <div class="flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3 ">
                <i class="pi pi-user text-green-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Username</span>
                <span class="flex justify-content-start "> {{ teacherDataFromServer?.userId.username }}</span>
              </div>
            </li>
            <li class="flex mb-3">
              <div class=" flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3">
                <i class="pi pi-envelope text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Email</span>
                <a :href="'mailto:' + teacherDataFromServer?.email" class="flex justify-content-start">{{ teacherDataFromServer?.userId.email }}</a>
              </div>
            </li>
            <li class="flex mb-3">
              <div class=" flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3">
                <i class="pi pi-key text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Permiso</span>
                <span>{{ teacherDataFromServer?.userId.permiso }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <!-- TODO mostrar solo si es admin -->
          <Button class="w-max w-3rem" icon="pi pi-trash" severity="danger" v-tooltip.top="'Borrar Profesor'" @click="confirmDeleteProfesor()"></Button>
          <Button class="w-max w-3rem" icon="pi pi-pencil" severity="secondary" v-tooltip.top="'Editar Profesor'" @click="mostrarDialogEditarProfesor()"></Button>
        </div>
      </div>
    </div>

    <!-- Tabla de asignaturas asignadas -->
    <div v-if="subjectsByTeacherIdFromServer?.asignaciones" class="card w-max">
      <DataTable :value="subjectsByTeacherIdFromServer.asignaciones" dataKey="id" v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['subject.nombre']" class="" removableSort
        sortField="subject.nombre" :sortOrder="1" :paginator="true" :rows="5" stripedRows :showGridlines="false" selection-mode="single" :pt="{
          paginator: {
            paginatorWrapper: { class: 'flex justify-content-center' },
            firstPageButton: { class: 'w-auto m-0' },
            previousPageButton: { class: 'w-auto m-0' },
            pageButton: { class: 'w-auto m-0' },
            nextPageButton: { class: 'w-auto m-0' },
            lastPageButton: { class: 'w-auto m-0' },
          }, table: {
            class: 'mt-0 w-max',
            style: { 'border': 'none', 'background-color': 'transparent' }
          }
        }">

        <div id="header" class="h-6rem border-round-top" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Asignaciones</h5>
          <span class="p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-auto" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button rounded icon="pi pi-filter-slash" label="" outlined v-tooltip.top="'Limpiar filtros'" @click=" clearFilter()"></Button>
          </span>
        </div>
        <Column field="subject.nombre" header="Asignatura" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1"> </Column>
        <Column header="" headerStyle="" headerClass="h-2rem pl-1" bodyClass="flex p-1 pl-8">
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Asignación'" @click="confirmDelete(slotProps.data)"></Button>
            <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Asignación'" @click="mostrarDialog(slotProps.data)"></Button>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Tabla de alumnos matriculados -->
    <div v-if="matriculasRefFromServer?.matriculas" class="card w-12">
      <DataTable :value="matriculasRefFromServer.matriculas" dataKey="id" v-model:filters="filters1" filterDisplay="menu"
        :globalFilterFields="['student.nombre', 'student.apellidos', 'student.dni', 'student.direccion', 'student.telefono', 'student.email', 'subject.nombre']" class="" removableSort
        sortField="subject.nombre" :sortOrder="1" :paginator="true" :rows="10" stripedRows :showGridlines="false" selection-mode="single" :pt="{
          paginator: {
            paginatorWrapper: { class: 'flex justify-content-center' },
            firstPageButton: { class: 'w-auto m-0' },
            previousPageButton: { class: 'w-auto m-0' },
            pageButton: { class: 'w-auto m-0' },
            nextPageButton: { class: 'w-auto m-0' },
            lastPageButton: { class: 'w-auto m-0' },
          }, table: {
            class: 'mt-0 w-12',
            style: { 'border': 'none', 'background-color': 'transparent' }
          }
        }">

        <div id=" header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Matrículas</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button rounded icon="pi pi-filter-slash" label="" outlined v-tooltip.top="'Limpiar filtros'" @click=" clearFilter()"></Button>
          </span>
        </div>

        <ColumnGroup type="header">
          <Row>
            <Column header="Curso escolar" field="year" :rowspan="2" headerClass="h-3rem pl-1 bg-transparent pr-3 " :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column header="Asignatura" field="subject.nombre" :rowspan="2" sortable headerClass="h-2rem pl-1 bg-transparent" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column header="Alumno" :colspan="3" headerClass="h-3rem pl-1 bg-transparent"></Column>
          </Row>
          <Row>
            <Column header="Nombre" sortable field="student.nombre" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>

            <Column header="Apellidos" sortable field="student.apellidos" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column header="DNI" sortable field="student.dni" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
          </Row>
        </ColumnGroup>

        <Column field="year" bodyClass="p-0 pl-1">
          <template #body="slotProps">
            {{ slotProps.data.year }} / {{ slotProps.data.year + 1 }}
          </template>
        </Column>
        <Column field="subject.nombre" bodyClass="p-0 pl-1"></Column>
        <Column field="student.nombre" bodyClass="p-0 pl-1"></Column>
        <Column field="student.apellidos" bodyClass="p-0 pl-1"></Column>
        <Column field="student.dni" bodyClass="p-0 pl-1"></Column>
        <Column header="" headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="flex p-1 pl-1">
          <!-- TODO mostrar solo si es admin -->
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Alumno'" @click="goToStudent(slotProps.data.student.id)"></Button>
            <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Matrícula'" @click="confirmDeleteMatricula(slotProps.data.id)"></Button>
            <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Matrícula'" @click="mostrarDialogEditarMatricula(slotProps.data)"></Button>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Dialog editar Profesor-->
    <Dialog v-model:visible="visibleDialogProfesor" modal header="Editar Profesor" class="w-3" :pt="{
          header: { class: 'flex align-items-baseline h-5rem' },
          title: { class: '' },
          closeButtonIcon: { class: '' },
          mask: {
            style: 'backdrop-filter: blur(3px)'
          }
        }
          ">

      <span class="p-text-secondary flex mb-5">Actualizar información</span>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="nombre" class="font-semibold w-6rem">Nombre</label>
        <InputText id="nombre" class="w-7" v-model="profesorEditar.nombre" :class="{ 'p-invalid': !profesorEditar.nombre }" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="apellidos" class="font-semibold w-6rem">Apellidos</label>
        <InputText id="apellidos" class="w-7" v-model="profesorEditar.apellidos" :class="{ 'p-invalid': !profesorEditar.apellidos }" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="email" class="font-semibold w-6rem">Email</label>
        <InputText id="email" class="w-7" v-model="profesorEditar.email" :class="{ 'p-invalid': !profesorEditar.email }" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="usuario" class="font-semibold w-6rem">Usuario</label>
        <Dropdown class="" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput" placeholder="Selecciona un usuario"
          v-model="profesorEditar.userId.id" @change="getUser()" :class="{ 'p-invalid': profesorEditar.userId.id == undefined }" />
      </div>
      <div v-if="profesorEditar.userId.id != undefined" class="">
        <DataTable :value="[profesorEditar.userId]" class="pl-1" tableStyle="width: 30rem" :pt="{
          table: {
            class: 'mt-0',
            style: { 'border': 'none' }
          }
        }
          ">
          <Column field="username" header="Username" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
          <Column field="email" header="Email" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
          <Column field="permiso" header="Permiso" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem">
            <template #body="">
              {{ profesorEditar.userId.permiso }}
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="flex justify-content-center mb-3 pt-2">
        <Button type="button" rounded label="Cancelar" severity="secondary" @click=" getTeacherData(), visibleDialogProfesor = false"></Button>
        <Button type="button" rounded label="Actualizar" @click="editarProfesor()"></Button>
      </div>
      <Toast></Toast>
    </Dialog>

  </div>
  <Toast :pt="{
          container: {
            class: 'align-items-center'
          },
          closeButton: {
            class: 'border-1'
          }
        }
          "></Toast>
  <ConfirmDialog :pt="{
          header: { class: 'pb-0 pt-2' },
          content: { class: 'pb-3 pt-1' }
        }
          "></ConfirmDialog>
</template>

<style scoped></style>
