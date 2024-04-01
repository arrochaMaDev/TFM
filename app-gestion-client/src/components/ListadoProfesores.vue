<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
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

// OBTENER DATOS DE TODOS LOS PROFESORES
const teachersRefFromServer: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    email: string
    userId: {
      id: number
      username: string
      email: string
      permiso: number | string // para poder cambiar el permiso a string
    }
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
      loadingStore.loadingTrue()

      // const data = (await response.json())
      const data: {
        id: number;
        usuario_id: string;
        nombre: string;
        apellidos: string;
        email: string;
        userId: {
          id: number;
          username: string;
          email: string;
          permiso: number;
        };
      }[] = await response.json(); console.log(data)

      // Para cambiar el permiso a string
      const updatedData = data.map((teacher) => ({
        ...teacher,
        userId: {
          ...teacher.userId,
          permiso: PermisoToString(teacher.userId.permiso)
        }
      }));
      teachersRefFromServer.value = updatedData
      console.log(teachersRefFromServer.value)
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


// LÓGICA BORRAR PROFESOR

const confirmDelete = (profesor: typeof teachersRefFromServer.value[0]) => {
  console.table(profesor) // al ser un array, le indico el valor de la casilla 0
  confirm.require({
    message: '¿Seguro que quiere borrar este profesor?',
    header: 'Borrar Profesor',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarProfesor(profesor)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

const borrarProfesor = async (profesor: typeof teachersRefFromServer.value[0]) => {
  console.table(profesor)
  const idProfesor = profesor.id
  try {
    const response = await fetch(`http://localhost:3000/teacher/${idProfesor}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Profesor borrado', life: 3000 });
      getTeachersData()
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)
    if (error.message.includes('400')) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'No se puede borrar el profesor porque tiene asignaturas asignadas o alumnos matriculados', life: 3000 });
    }
    else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error borrando', life: 3000 });
    }
  }
  finally {
    getTeachersData()
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
  if (profesorEditar.value?.userId.id != undefined) {
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


// LÓGICA EDITAR PROFESOR
const visibleDialog: Ref<boolean> = ref(false);

const profesorEditar: Ref<
  {
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

const mostrarDialog = async (teacher: typeof teachersRefFromServer.value[0]) => {
  await getUser() //Obtener usuario
  visibleDialog.value = true
  profesorEditar.value = { ...teacher } // spread crea un nuevo objeto y copia superficialmente el objeto
  console.table(profesorEditar.value)
}

// validar datos del dialog
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const editarProfesor = async () => {
  let isValid = true
  if (!patronEmail.test(profesorEditar.value.email)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (!profesorEditar.value.nombre || !profesorEditar.value.apellidos || !profesorEditar.value.email || isNaN(profesorEditar.value.userId.id)) {
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
      visibleDialog.value = false
      getTeachersData()
    }
  }
}

// Ir a la página idividual del profesor
const goToTeacher = (id: number) => {
  router.push({
    path: `/profesor/${id}`
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

// ON MOUNTED
onMounted(() => {
  getTeachersData()
})

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
      return 'primary';

    case 'administrador':
      return 'warning';

    default:
      return undefined;
  }
};

</script>

<template>
  <div class="flex justify-content-start pt-2">
    <div class="card flex justify-content-center">
      <DataTable v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['nombre', 'apellidos', 'email', 'userId.username', 'userId.email', 'userId.permiso']" class="" removableSort
        :value="teachersRefFromServer" dataKey="id" stripedRows selectionMode="single" sortField="nombre" :sortOrder="1" :paginator="true" :rows="10" tableStyle="width: 40rem" :pt="{
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
      }
        ">

        <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Listado Profesores</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem" v-model="filters['global'].value" placeholder="Búsqueda global..." />
            <Button rounded icon="pi pi-filter-slash" label="" v-tooltip.top="'Limpiar filtros'" outlined @click="clearFilter()"></Button>
            <Button rounded icon="pi pi-users" label="" v-tooltip.top="'Mostrar Usuarios'" outlined @click="toogleMostrarUsuario()"></Button>
          </span>
        </div>

        <ColumnGroup type="header" class="">
          <Row>
            <Column :hidden="!mostrarUsuario" header="Profesor" :colspan="3" headerClass="h-3rem pl-1"></Column>
            <Column :hidden="!mostrarUsuario" header="Usuario" :colspan="4" headerClass="h-3rem pl-1"></Column>
          </Row>
          <Row>
            <Column field="nombre" header="Nombre" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 pr-5" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column field="apellidos" header="Apellidos" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 pr-5" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column field="email" header="Email" sortable headerStyle="width:40%; min-width:6rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 pr-5" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <!-- columnas de ver usuario -->
            <div v-if="mostrarUsuario">
              <Column field="userId.username" header="Username" sortable headerStyle="width:40%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 pr-5" :show-filter-match-modes="false">
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
                </template>
              </Column>
              <Column field="userId.email" header="Email de usuario" sortable headerStyle="width:40%; min-width:13rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 pr-5"
                :show-filter-match-modes="false">
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
                </template>
              </Column>
              <Column field="userId.permiso" header="Permiso" headerStyle="width:40%; min-width:6rem" :show-filter-match-modes="false">
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
            <Column field="" header=""></Column>
          </Row>
        </ColumnGroup>

        <Column field="nombre"></Column>
        <Column field="apellidos"></Column>
        <Column field="email"></Column>
        <div v-if="mostrarUsuario">
          <Column field="userId.username"></Column>
          <Column field="userId.email"></Column>
          <Column field="userId.permiso">
            <template #body="{ data }">
              <Tag :value="data.userId.permiso" :severity="getSeverity(data.userId.permiso)" />
            </template>
          </Column>
        </div>


        <Column headerStyle="width:20%; min-width:8rem" bodyClass="flex p-1 pl-1">
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Profesor'" @click="goToTeacher(slotProps.data.id)"></Button>
            <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Profesor'" @click="mostrarDialog(slotProps.data)"></Button>
            <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Profesor'" @click="confirmDelete(slotProps.data)"></Button>
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

      <!-- Dialog editar Profesor-->
      <Dialog v-model:visible="visibleDialog" modal header="Editar Profesor" class="w-3" :pt="{
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
          <Dropdown class="" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput"
            placeholder="Selecciona un usuario" v-model="profesorEditar.userId.id" @change="getUser()" :class="{ 'p-invalid': profesorEditar.userId.id == undefined }" />
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
                {{ permisoString }}
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="flex justify-content-center mb-3 pt-2">
          <Button type="button" rounded label="Cancelar" severity="secondary" @click="getTeachersData(), visibleDialog = false"></Button>
          <Button type="button" rounded label="Actualizar" @click="editarProfesor()"></Button>
        </div>
        <Toast></Toast>
      </Dialog>

    </div>
  </div>
</template>

<style scoped></style>
