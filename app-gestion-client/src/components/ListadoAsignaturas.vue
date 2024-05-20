<script setup lang="ts">
import { type Ref, ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from 'primevue/api';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import { useAdminStore } from '@/stores/isAdmin';
import type { VueCookies } from 'vue-cookies';


const confirm = useConfirm();
const toast = useToast();

const router = useRouter() // router para ir al alumno cuando se clique en él

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


// OBTENER LA LISTA DE ASIGNATURAS DEL SERVIDOR:
const asignaturasRefFromServer: Ref<
  {
    id: number
    nombre: string
  }[]
> = ref([])

const getAsignaturasData = async () => {
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
      asignaturasRefFromServer.value = data
      console.table(data)
    }
  }
  catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}


// LÓGICA BORRAR ASIGNATURA
const confirmDelete = (asignatura: typeof asignaturasRefFromServer.value[0]) => { // al ser un array, le indico el valor de la casilla 0
  confirm.require({
    message: '¿Seguro que quiere borrar esta asignatura?',
    header: 'Borrar Asignatura',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarAsignatura(asignatura)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

const borrarAsignatura = async (asignatura: typeof asignaturasRefFromServer.value[0]) => {
  console.table(asignatura)
  // const idAsignatura = asignatura.id
  try {
    const response = await fetch(
      `http://localhost:3000/asignatura/${asignatura.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Asignatura borrada', life: 3000 });
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)
    if (error.message.includes('400')) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'No se puede borrar la asignatura porque está asignada a un profesor o tiene a un alumno matriculado en ella', life: 3000 });
    }
    else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error borrando', life: 3000 });
    }
  }
  finally {
    getAsignaturasData()
  }
}

// LÓGICA EDITAR ASIGNATURA
const visibleDialog: Ref<boolean> = ref(false);

const asignaturaEditar: Ref<
  | {
    id: number
    nombre: string
  }> = ref({
    id: 0,
    nombre: '',
  }); // lo inicializo para evitar problemas con null o undefined en v-model

const mostrarDialog = (asignatura: typeof asignaturasRefFromServer.value[0]) => {
  visibleDialog.value = true
  asignaturaEditar.value = { ...asignatura } // spread crea un nuevo objeto y copia superficialmente el objeto
  console.table(asignaturaEditar.value)
}
const buscarAsignatura = (): boolean => {
  for (const asignatura of asignaturasRefFromServer.value) {
    if (asignatura.nombre.toLowerCase() === asignaturaEditar.value.nombre.toLowerCase()) {
      return true // Si se encuentra la asignatura, devuelve true
    }
  }
  return false // Si no se encuentra la asignatura, devuelve false
}

const editarAsignatura = async () => {
  let isValid = true
  let repetido: boolean = buscarAsignatura()

  if (repetido) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'La asignatura ya está en la base de datos', life: 3000 });
    isValid = false
  }
  if (!asignaturaEditar.value || asignaturaEditar.value.nombre === '') {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (!repetido && isValid) {
    try {
      const response = await fetch(`http://localhost:3000/asignatura/${asignaturaEditar.value.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: asignaturaEditar.value.nombre
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Editada', detail: 'Asignatura editada', life: 3000 });

        const asignaturaActualizada = {
          id: asignaturaEditar.value.id,
          nombre: asignaturaEditar.value.nombre
        }
        console.table(asignaturaActualizada)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    } finally {
      visibleDialog.value = false
      getAsignaturasData()
    }
  }
}

// LÓGICA MOSTRAR PROFESORES ASIGNADOS
const visibleDialogTeacher: Ref<boolean> = ref(false);

const teachersBySubjectId: Ref<{
  subject: {
    id: number
    nombre: string
  },
  teachers: {
    id: number
    teacher: {
      id: number
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
  }[]
} | undefined> = ref(undefined)

const getTeachersBySubjectId = async (subject: typeof asignaturasRefFromServer.value[0]) => {

  try {
    const response = await fetch(`http://localhost:3000/asignaturas_profesores/subject/${subject.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 404) {
      toast.add({ severity: 'warn', summary: 'No hay datos', detail: 'La asignatura no tiene profesores asignados', life: 3000 });
      return null;
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      visibleDialogTeacher.value = true

      const data = (await response.json())
      teachersBySubjectId.value = data
      console.table(teachersBySubjectId.value)
    }
  }
  catch (error: any) {
    console.error('Error en la solicitud:', error)
    if (error.message.includes('404')) {
      return null;
    } else {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    }
  }
}

// LÓGICA BORRAR ASIGNACIÓN
const confirmDeleteAsignacion = (asignacionId: number) => {
  console.log(asignacionId)
  confirm.require({
    message: '¿Seguro que quiere borrar esta asignación?',
    header: 'Borrar Asignación',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarSubjectTeacher(asignacionId)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};


const borrarSubjectTeacher = async (asignacionId: number) => {
  console.table(asignacionId)
  // const idAsignacion = asignacion.id
  try {
    const response = await fetch(
      `http://localhost:3000/asignatura_profesor/${asignacionId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.ok) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Asignación borrada', life: 3000 });
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  } finally {
    visibleDialogTeacher.value = false
    getAsignaturasData()

  }
}

const resetDataTeachers = () => {
  visibleDialogTeacher.value = false
  teachersBySubjectId.value = undefined
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
  }
}
initFilters()

const clearFilter = () => { // para borrar los filtros, reinicio la función y el value = null
  initFilters()
}

// ON MOUNTED
onMounted(() => {
  getAsignaturasData()
})

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
  <div class="flex justify-content-start pt-2" v-if="isAdmin">
    <div class="card flex justify-content-center ">
      <DataTable v-model:filters="filters" class="" :value="asignaturasRefFromServer" dataKey="id" stripedRows selectionMode="single" sortField="nombre" :sortOrder="1" :paginator="true" :rows="10"
        tableStyle="width: fit-content" :pt="{
    paginator: {
      paginatorWrapper: { class: 'col-12 flex justify-content-center' },
      firstPageButton: { class: 'w-auto' },
      previousPageButton: { class: 'w-auto' },
      pageButton: { class: 'w-auto' },
      nextPageButton: { class: 'w-auto' },
      lastPageButton: { class: 'w-auto' },
    },
    table: {
      class: 'mt-0',
      style: { 'border': 'none' }
    }


  }">

        <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-max pt-3 pb-3 border-round-top" style="background-color:  #f8f9fa">
          <h5 class="flex m-0 text-3xl text-800 font-bold pl-1 mr-5">Listado Asignaturas</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem mr-2" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button class="mr-2" rounded icon="pi pi-filter-slash" label="" v-tooltip.top="'Limpiar filtros'" outlined @click="clearFilter()"></Button>
          </span>
        </div>
        <Column field="nombre" header="Nombre" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1"> </Column>
        <Column headerStyle="width: 5%" bodyClass="flex p-1 pl-1">
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver profesores'" @click="getTeachersBySubjectId(slotProps.data)"></Button>
            <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Asignatura'" @click="mostrarDialog(slotProps.data)"></Button>
            <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Asignatura'" @click="confirmDelete(slotProps.data)"></Button>
          </template>
        </Column>
      </DataTable>

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
      <!-- Dialog editar asignatura  -->
      <Dialog v-model:visible="visibleDialog" modal header="Editar Asignatura" class="w-2" :pt="{
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
          <InputText id="nombre" class="w-full" v-model="asignaturaEditar.nombre" :class="{ 'p-invalid': !asignaturaEditar.nombre }" />
        </div>
        <div class="flex justify-content-center mb-3 pt-2">
          <Button class="mr-2" type="button" rounded label="Cancelar" severity="secondary" @click="visibleDialog = false"></Button>
          <Button type="button" rounded label="Actualizar" @click="editarAsignatura()"></Button>
        </div>
        <Toast></Toast>
      </Dialog>

      <!-- Dialog ver profesores asignados -->
      <Dialog v-model:visible="visibleDialogTeacher" @after-hide="resetDataTeachers()" modal header="Profesores asignados" class="w-auto" :pt="{
    header: { class: 'flex align-items-baseline h-5rem' },
    title: { class: '' },
    closeButtonIcon: { class: '' },
    mask: {
      style: 'backdrop-filter: blur(3px)'
    }
  }">
        <DataTable :value="teachersBySubjectId?.teachers" dataKey="teachers.id" stripedRows selectionMode="single" sortField="teachers.teacher.id" :sortOrder="1" :pt="{
    table: {
      class: 'mt-0 mb-5 w-max',
      style: { 'border': 'none' }
    }
  }">
          <Column field="teacher.nombre" header="Nombre" sortable headerStyle="" headerClass="h-2rem pl-1 pr-3" bodyClass="h-3rem p-0 pl-1"> </Column>
          <Column field="teacher.apellidos" header="Apellidos" sortable headerStyle="" headerClass="h-2rem pl-1 pr-3" bodyClass="h-3rem p-0 pl-1"></Column>
          <Column field="teacher.dni" header="DNI" sortable headerStyle="" headerClass="h-2rem pl-1 pr-3" bodyClass="h-3rem p-0 pl-1"></Column>
          <Column field="teacher.direccion" header="Dirección" sortable headerStyle="" headerClass="h-2rem pl-1 pr-3" bodyClass="h-3rem p-0 pl-1"></Column>
          <Column field="teacher.telefono" header="Teléfono" sortable headerStyle="" headerClass="h-2rem pl-1 pr-3" bodyClass="h-3rem p-0 pl-1"></Column>
          <Column field="teacher.email" header="Email" headerStyle="" headerClass="h-2rem pl-1" bodyClass="h-3rem p-0 pl-1 pr-3"></Column>
          <Column headerStyle="" bodyClass="flex p-1 pl-1">
            <template #body="slotProps">
              <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Profesor'" @click="goToTeacher(slotProps.data.teacher.id)"></Button>
              <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Asignación'" @click="confirmDeleteAsignacion(slotProps.data.id)"></Button>
            </template>
          </Column>
        </DataTable>
      </Dialog>
    </div>
  </div>
</template>

<style scoped></style>
