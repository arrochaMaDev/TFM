<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown';
import { FilterMatchMode } from 'primevue/api';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';



const confirm = useConfirm();
const toast = useToast();

const router = useRouter() // router para ir al alumno cuando se clique en él
const loadingStore = useLoadingStore() // store del Spinner

// OBTENER DATOS DE TODOS LOS ESTUDIANTES
const studentsRefFromServer: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
    email: string
    userId: {
      id: number
      username: string
      email: string
      permiso: number | string // para poder cambiar el permiso a string
    }
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

      // const data = (await response.json())
      const data = (await response.json()) as {
        id: number
        usuario_id: string
        nombre: string
        apellidos: string
        dni: string
        direccion: string
        telefono: number
        email: string
        userId: {
          id: number
          username: string
          email: string
          permiso: number
        }
      }[]

      // Para cambiar el permiso a string
      const updatedData = data.map((student) => ({
        ...student,
        userId: {
          ...student.userId,
          permiso: PermisoToString(student.userId.permiso)
        }
      }));
      studentsRefFromServer.value = updatedData
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

onMounted(() => {
  getStudentsData()
})

// LÓGICA BORRAR ALUMNO
const confirmDelete = (alumno: typeof studentsRefFromServer.value[0]) => { // al ser un array, le indico el valor de la casilla 0
  confirm.require({
    message: '¿Seguro que quiere borrar este alumno?',
    header: 'Borrar Alumno',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarAlumno(alumno)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

const borrarAlumno = async (alumno: typeof studentsRefFromServer.value[0]) => {
  console.table(alumno)
  // const idAlumno = alumno.id
  try {
    const response = await fetch(`http://localhost:3000/student/${alumno.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Alumno borrado', life: 3000 });
      getStudentsData()
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
  finally {
    getStudentsData()
  }
}

//OBTENER USUARIOS PARA EDITAR ASIGNACION
const usersRefFromServer: Ref<{
  id: number,
  username: string,
  email: string,
  permiso: number
}[]> = ref([])

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

//OBTENER USUARIO PARA MOSTRAR
const permisoString: Ref<string> = ref("")

const getUser = async () => {
  if (alumnoEditar.value.userId.id != undefined) {
    try {
      const response = await fetch(`http://localhost:3000/usuario/${alumnoEditar.value.userId.id}`, {
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
        alumnoEditar.value.userId = data
        // console.table(user.value)

        // PERMISO A STRING
        switch (alumnoEditar.value.userId.permiso) {
          case 0:
            permisoString.value = 'Alumno'
            break;
          case 1:
            permisoString.value = 'Profesor'
            break;
          case 9:
            permisoString.value = 'Aministrador'
            break;
          case null:
            permisoString.value = '';
            break;
          // default:
          //   permisoString.value = ''
        }
      }
    }
    catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    }
  }
}

// LÓGICA EDITAR ALUMNO
const visibleDialog: Ref<boolean> = ref(false);

const alumnoEditar: Ref<
  | {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
    email: string
    userId: {
      id: number
      username: string
      email: string
      permiso: number | string // para poder cambiar el permiso a string
    }
  }> = ref({
    id: 0,
    usuario_id: '',
    nombre: '',
    apellidos: '',
    dni: '',
    direccion: '',
    telefono: 0,
    email: '',
    userId: {
      id: 0,
      username: '',
      email: '',
      permiso: 0
    }
  }); // lo inicializo para evitar problemas con null o undefined en v-model

const mostrarDialog = (student: typeof studentsRefFromServer.value[0]) => {
  getUser() //Obtener usuario
  visibleDialog.value = true
  alumnoEditar.value = { ...student } // spread crea un nuevo objeto y copia superficialmente el objeto
  console.table(alumnoEditar.value)
}


// validar datos del dialog
const patronTel = /^\d{9}$/
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const editarAlumno = async () => {
  let isValid = true
  if (alumnoEditar.value.telefono && !patronTel.test(alumnoEditar.value.telefono.toString())) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'El número de teléfono debe tener 9 dígitos numéricos', life: 3000 });
    isValid = false
  }
  if (!patronEmail.test(alumnoEditar.value.email)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (!alumnoEditar.value.nombre || !alumnoEditar.value.apellidos || !alumnoEditar.value.dni || !alumnoEditar.value.direccion || !alumnoEditar.value.telefono || !alumnoEditar.value.email || !alumnoEditar.value.userId.id) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (isValid) {
    try {
      const response = await fetch(`http://localhost:3000/student/${alumnoEditar.value?.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: alumnoEditar.value?.nombre,
          apellidos: alumnoEditar.value?.apellidos,
          dni: alumnoEditar.value?.dni,
          direccion: alumnoEditar.value?.direccion,
          telefono: Number(alumnoEditar.value?.telefono),
          email: alumnoEditar.value?.email,
          userId: alumnoEditar.value?.userId.id
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Editado', detail: 'Alumno editado', life: 3000 });
        const alumnoActualizado = {
          nombre: alumnoEditar.value?.nombre,
          apellidos: alumnoEditar.value?.apellidos,
          dni: alumnoEditar.value?.dni,
          direccion: alumnoEditar.value?.direccion,
          telefono: alumnoEditar.value?.telefono,
          email: alumnoEditar.value?.email
        };
        console.table(alumnoActualizado)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    } finally {
      visibleDialog.value = false
      getStudentsData()
    }
  }
}


// Ir a la página idividual del alumno
const goToStudent = (id: number) => {
  router.push({
    path: `/alumno/${id}`
  })
}

// Filtrar datos
const filters = ref() // variable filtro

const permisos = ['Alumno', 'Profesor', 'Administrador'];

const initFilters = () => { // componente filtro en global para que busque cualquier valor
  filters.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'dni': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'direccion': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'telefono': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'userId.username': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'userId.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'userId.permiso': { value: null, matchMode: FilterMatchMode.EQUALS },
  }
}
initFilters()

const clearFilter = () => { // para borrar los filtros, reinicio la función y el value = null
  initFilters()
}

//Ver usuarios asignados
const mostrarUsuario = ref(false)
const toogleMostrarUsuario = () => {
  mostrarUsuario.value = !mostrarUsuario.value
}

const getSeverity = (permiso: string) => {
  switch (permiso.toLowerCase()) {
    case 'alumno':
      return 'success';

    case 'profesor':
      return 'info';

    case 'administrador':
      return 'warning';

    default:
      return undefined;
  }
};
</script>

<template>
  <div class="flex justify-content-start pt-2 ">
    <div class="card flex justify-content-center">
      <DataTable v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['nombre', 'apellidos', 'email', 'userId.username', 'userId.email', 'userId.permiso']" class="" removableSort
        :value="studentsRefFromServer" dataKey="id" stripedRows selectionMode="single" sortField="nombre" :sortOrder="1" :paginator="true" :rows="10" tableStyle="width: fit-content" :pt="{
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

        <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Listado Alumnos</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem" v-model="filters['global'].value" placeholder="Búsqueda global..." />
            <Button rounded icon="pi pi-filter-slash" label="" v-tooltip.top="'Limpiar filtros'" outlined @click="clearFilter()"></Button>
            <Button rounded icon="pi pi-users" label="" v-tooltip.top="'Mostrar Usuarios'" outlined @click="toogleMostrarUsuario()"></Button>
          </span>
        </div>

        <Column field="nombre" header="Nombre" sortable headerStyle="min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="apellidos" header="Apellidos" sortable headerStyle="min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="dni" header="DNI" sortable headerStyle="min-width:7rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="direccion" header="Dirección" sortable headerStyle="min-width:19rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="telefono" header="Teléfono" sortable headerStyle="min-width:6rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="number" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="email" header="Email" sortable headerStyle="min-width:13rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <div v-if="mostrarUsuario">
          <Column field="userId.username" header="Username" sortable headerStyle="min-width:6rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
            </template>
          </Column>
          <Column field="userId.email" header="Email de Usuario" sortable headerStyle="min-width:13rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
            </template>
          </Column>
          <Column field="userId.permiso" header="Permiso" sortable headerStyle="min-width:7rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #body="{ data }">
              <Tag :value="data.userId.permiso" :severity="getSeverity(data.userId.permiso)" />
            </template>
            <template #filter="{ filterModel }">
              <Dropdown v-model="filterModel.value" :options="permisos" placeholder="Selecciona" class="p-column-filter" style="width: auto">
                <template #option="slotProps">
                  <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                </template>
              </Dropdown>
            </template>
          </Column>
        </div>
        <Column headerStyle="min-width:8rem" bodyClass="flex p-1 pl-0">
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Alumno'" @click="goToStudent(slotProps.data.id)"></Button>
            <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Alumno'" @click="mostrarDialog(slotProps.data)"></Button>
            <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Alumno'" @click="confirmDelete(slotProps.data)"></Button>
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
      }"></Toast>
      <ConfirmDialog :pt="{
        header: { class: 'pb-0 pt-2' },
        content: { class: 'pb-3 pt-1' }
      }"></ConfirmDialog>

      <Dialog v-model:visible="visibleDialog" modal header="Editar Alumno" class="w-3" :pt="{
        header: { class: 'flex align-items-baseline h-5rem' },
        title: { class: '' },
        closeButtonIcon: { class: '' },
        mask: {
          style: 'backdrop-filter: blur(3px)'
        }
      }">

        <span class="p-text-secondary flex mb-5">Actualizar información</span>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="nombre" class="font-semibold w-6rem">Nombre</label>
          <InputText id="nombre" class="w-7" v-model="alumnoEditar.nombre" :class="{ 'p-invalid': !alumnoEditar.nombre }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="apellidos" class="font-semibold w-6rem">Apellidos</label>
          <InputText id="apellidos" class="w-7" v-model="alumnoEditar.apellidos" :class="{ 'p-invalid': !alumnoEditar.apellidos }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="dni" class="font-semibold w-6rem">DNI</label>
          <InputText id="dni" class="w-3" v-model="alumnoEditar.dni" :class="{ 'p-invalid': !alumnoEditar.dni }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="direccion" class="font-semibold w-6rem">Dirección</label>
          <InputText id="direccion" class="flex-auto" v-model="alumnoEditar.direccion" :class="{ 'p-invalid': !alumnoEditar.direccion }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="telefono" class="font-semibold w-6rem">Teléfono</label>
          <InputNumber id="telefono" inputId="withoutgrouping" :useGrouping="false" class="w-3" v-model="alumnoEditar.telefono" :class="{ 'p-invalid': !alumnoEditar.telefono }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="email" class="font-semibold w-6rem">Email</label>
          <InputText id="email" class="w-5" v-model="alumnoEditar.email" :class="{ 'p-invalid': !alumnoEditar.email }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="usuario" class="font-semibold w-6rem">Usuario</label>
          <Dropdown class="" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput"
            placeholder="Selecciona un usuario" v-model="alumnoEditar.userId.id" @change="getUser()" :class="{ 'p-invalid': alumnoEditar.userId.id == undefined }" />
        </div>
        <div v-if="alumnoEditar.userId.id != undefined" class="">
          <DataTable :value="[alumnoEditar.userId]" class="pl-1" tableStyle="width: 30rem" :pt="{
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
                {{ permisoString }}
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="flex justify-content-center mb-3 pt-2">
          <Button type="button" rounded label="Cancelar" severity="secondary" @click="getStudentsData(), visibleDialog = false"></Button>
          <Button type="button" rounded label="Actualizar" @click="editarAlumno()"></Button>
        </div>
        <Toast></Toast>
      </Dialog>

    </div>
  </div>
</template>

<style scoped></style>
