<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEditingStore } from '@/stores/editar'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from 'primevue/api';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';


const confirm = useConfirm();
const toast = useToast();

const router = useRouter()

const studentDataFromServer: Ref<{
  id: number
  usuario_id: string
  nombre: string
  apellidos: string
  dni: string
  direccion: string
  telefono: string
  email: string
  userId: {
    id: number
    username: string
    email: string
    permiso: number | string // para poder cambiar el permiso a string
  }
} | undefined> = ref(undefined)

const studentId = Number(router.currentRoute.value.params.id) // Obtengo el id de la url
console.log(studentId)
console.log(router.currentRoute.value.params['id'])

// OBTENER DATOS DEL ESTUDIANTE
const getStudentData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = (await response.json())
      studentDataFromServer.value = data
      console.log(studentDataFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error obteniendo los datos del alumno', life: 3000 });
  }
}

// OBTENER MATRICULAS DEL ALUMNO
const matriculaFromServer: Ref<{
  student: {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: string
    email: string
  }
  matriculas: {
    id: number
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      nombre: string
      apellidos: string
      email: string
    }
    year: number
  }[]
} | null> = ref(null)

const getMatriculasData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/matriculas/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status == 404 && !matriculaFromServer.value?.matriculas) {
      toast.add({ severity: 'info', summary: 'Error', detail: 'EL alumno no tiene matrículas asignadas', life: 3000 });
      return
    }
    if (response.ok) {
      const data = await response.json()
      matriculaFromServer.value = data
      console.log(data)
      console.dir(matriculaFromServer.value)
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

getStudentData()
getMatriculasData()


// LÓGICA BORRAR ALUMNO
const confirmDeleteAlumno = () => {
  console.log("borrando alumno")
  confirm.require({
    message: '¿Seguro que quiere eliminar este alumno?',
    header: 'Borrar Alumno',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarAlumno()
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

const borrarAlumno = async () => {
  try {
    const response = await fetch(`http://localhost:3000/student/${studentIdRef.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Alumno borrado', life: 3000 });
      toast.add({ severity: 'info', summary: 'Redirigiendo', detail: 'Redirigiendo al listado de alumnos...', life: 3000 });
      setTimeout(() => {
        router.push('/listado-alumnos')
      }, 2000)
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)

    if (error.message.includes('400')) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se puede borrar el alumno porque tiene matrículas asignadas', life: 3000 });
    }
    else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al borrar al alumno', life: 3000 });
    }
  }
}

// LÓGICA BORRAR MATRICULA
const confirmDeleteMatricula = (matriculaId: number) => { // al ser un array, le indico el valor de la casilla 0
  console.log(matriculaId)
  confirm.require({
    message: '¿Seguro que quiere borrar esta matrícula?',
    header: 'Borrar Matrícula',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarMatricula(matriculaId)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};


const borrarMatricula = async (matriculaId: number) => {
  console.log(matriculaId)
  try {
    const response = await fetch(
      `http://localhost:3000/matricula/${matriculaId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.ok) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Matrícula borrada', life: 3000 });
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  } finally {
    getMatriculasData()
  }
}



// LÓGICA EDITAR MATRICULA
const editingStore = useEditingStore() // store del componente editar Alumno

let popUpState: Ref<boolean> = ref(editingStore.editarFalse()) // variable del estado del popUp
console.log(popUpState.value)

let matriculaEditar: Ref<
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
> = ref(undefined)

const editarMatricula = (matricula: any) => {
  // popUpState.value = true
  editingStore.editarTrue()
  matriculaEditar.value = matricula
  // fetch para obtener los datos del alumno
  fetch(`http://localhost:3000/matricula/${matriculaEditar.value?.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then(async (response) => {
    const data = (await response.json()) as {
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
    matriculaEditar.value = data
    console.table(data)
  })
}

const mostrarMatricula = () => {
  // popUpState.value = true
  popUpState.value = editingStore.editarTrue()
  console.log(popUpState.value)
}

const resetearPopUpState = () => {
  // popUpState.value = false
  popUpState.value = editingStore.editarFalse()
  console.log(popUpState.value)
}

const volver = () => {
  window.history.back()
}

// Ir a la página idividual del profesor
const goToTeacher = (id: number) => {
  router.push({
    path: `/profesor/${id}`
  })
}

// Filtrar datos
const filters = ref() // variable filtro

const initFilters = () => { // componente filtro en global para que busque cualquier valor
  filters.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'year': { value: null, matchMode: FilterMatchMode.CONTAINS },
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
        <h2 class="m-0 text-4xl text-800 font-bold">Perfil del Alumno</h2>
        <Button class="w-auto" severity="secondary" @click="volver()">Volver</Button>
      </div>
      <div id="photo" class="card col-fixed flex align-items-center justify-content-center col-3 h-20rem w-20rem">
        <i class="pi pi-user" style="font-size: 15rem;"></i>
        <!--TODO Hay que añadir fotos a la base de datos -->
      </div>
      <div id="datos" class="card col ml-5">

        <div id="Datos-personales">
          <h6 class="m-1 text-2xl text-800 font-bold"> {{ studentDataFromServer?.nombre }}</h6>
          <h6 class="m-1 text-2xl text-800 font-bold"> {{ studentDataFromServer?.apellidos }}</h6>
          <h6 class="m-1 text-xl text-800 font-bold"> {{ studentDataFromServer?.dni }}</h6>

          <ul id="datos-contacto" class="list-none p-0">
            <li class="flex mb-3">
              <div class="bg-green-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-home text-green-500" style="font-size: 2rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Dirección</span>
                <span class="flex justify-content-start "> {{ studentDataFromServer?.direccion }}</span>
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-blue-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-phone text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Teléfono</span>
                <a :href="'tel:' + studentDataFromServer?.telefono" class="flex justify-content-start"> {{ studentDataFromServer?.telefono }}</a>
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-pink-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-envelope text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Email</span>
                <a :href="'mailto:' + studentDataFromServer?.email" class="flex justify-content-start"> {{ studentDataFromServer?.email }}</a>
              </div>
            </li>
          </ul>
        </div>
        <div id="datosUsuario">
          <ul>
            <li>
              {{ studentDataFromServer?.userId.username }}
            </li>
            <li>
              {{ studentDataFromServer?.userId.email }}
            </li>
            <li>
              {{ studentDataFromServer?.userId.permiso }}
            </li>
          </ul>

        </div>
        <div>
          <!-- TODO mostrar solo si es admin -->
          <Button class="w-max w-3rem" icon="pi pi-trash" severity="danger" v-tooltip.top="'Borrar Alumno'" @click="confirmDeleteAlumno()"></Button>
          <Button class="w-max w-3rem" icon="pi pi-trash" severity="danger" v-tooltip.top="'Editar Alumno'" @click="mostrarDialogEditarAlumno()"></Button>
        </div>
      </div>
    </div>

    <div v-if="matriculaFromServer?.matriculas" class="card col-12">

      <DataTable :value="matriculaFromServer?.matriculas" dataKey="matriculas.id" v-model:filters="filters" filterDisplay="menu"
        :globalFilterFields="['subject.nombre', 'teacher.nombre', 'teacher.apellidos', 'teacher.email', 'year']" class="" removableSort sortField="matricula.subject.nombre" :sortOrder="1"
        :paginator="true" :rows="5" stripedRows selection-mode="single" :pt="{
          paginator: {
            paginatorWrapper: { class: 'flex justify-content-center' },
            firstPageButton: { class: 'w-auto' },
            previousPageButton: { class: 'w-auto' },
            pageButton: { class: 'w-auto' },
            nextPageButton: { class: 'w-auto' },
            lastPageButton: { class: 'w-auto' },
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
            <Column header="Profesor" :colspan="3" headerClass="h-3rem pl-1 bg-transparent"></Column>
          </Row>
          <Row>
            <Column header="Nombre" sortable field="teacher.nombre" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>

            <Column header="Apellidos" sortable field="teacher.apellidos" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column header="Email" sortable field="teacher.email" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
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
        <Column field="subject.nombre" h bodyClass="p-0 pl-1">
        </Column>
        <Column header="Nombre" sortable field="teacher.nombre" headerClass="h-2rem pl-1 bg-transparent">
        </Column>
        <Column header="Apellidos" field="teacher.apellidos" bodyClass="p-0 pl-1"></Column>
        <Column field="teacher.email" bodyClass="p-0 pl-1">
          <template #body="slotProps">
            <a :href="'mailto:' + slotProps.data.teacher.email" class="flex justify-content-start"> {{ slotProps.data.teacher.email }}</a>
          </template>
        </Column>
        <Column header="" headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="flex p-1 pl-1">
          <!-- TODO mostrar solo si es admin -->
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Profesor'" @click="goToTeacher(slotProps.data.teacher.id)"></Button>
            <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Matrícula'" @click="confirmDeleteMatricula(slotProps.data.id)"></Button>
            <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Matrícula'" @click="mostrarDialog(slotProps.data)"></Button>
          </template>
        </Column>
      </DataTable>
    </div>
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
