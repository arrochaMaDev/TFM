<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { FilterMatchMode } from 'primevue/api';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';



const confirm = useConfirm();
const toast = useToast();

const router = useRouter()

// OBTENER DATOS DE TODOS LOS USUARIOS
const usersRefFromServer: Ref<
  {
    id: number
    username: string
    email: string
    permiso: number | string // para poder cambiar el permiso a string
  }[]
> = ref([])

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
      // const data = (await response.json())
      const data: {
        id: number;
        username: string;
        email: string;
        permiso: number;
      }[] = await response.json(); console.log(data)

      // Para cambiar el permiso a string
      const updatedData = data.map((user) => ({
        ...user,
        permiso: PermisoToString(user.permiso)
      }
      ));
      usersRefFromServer.value = updatedData
      console.log(usersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
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
  getUsersData()
})


// LÓGICA BORRAR USUARIO
const confirmDelete = (usuario: typeof usersRefFromServer.value[0]) => {
  console.table(usuario) // al ser un array, le indico el valor de la casilla 0
  confirm.require({
    message: '¿Seguro que quiere borrar este profesor?',
    header: 'Borrar Profesor',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarUsuario(usuario)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

const borrarUsuario = async (usuario: typeof usersRefFromServer.value[0]) => {
  try {
    const response = await fetch(`http://localhost:3000/usuario/${usuario.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Usuario borrado', life: 3000 });
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  } finally {
    getUsersData()
  }
}


// LÓGICA EDITAR USUARIO
const visibleDialog: Ref<boolean> = ref(false);

const usuarioEditar: Ref<
  | {
    id: number
    username: string
    email: string
    pass: string
    permiso: number | string
  }> = ref({
    id: 0,
    username: '',
    pass: '',
    email: '',
    permiso: 0
  }); // lo inicializo para evitar problemas con null o undefined en v-model

// Para cambiar el permiso a un número y evitar problemas en el post
const permisoToNumber = (permiso: string) => {
  switch (permiso) {
    case 'Alumno':
      return 0
    case 'Profesor':
      return '1'
    case 'Administrador':
      return 9
    default:
      return ''
  }
}

const mostrarDialog = (usuario: typeof usuarioEditar.value) => {
  visibleDialog.value = true
  usuarioEditar.value = { ...usuario } // spread crea un nuevo objeto y copia superficialmente el objeto
  usuarioEditar.value.permiso = permisoToNumber(usuarioEditar.value.permiso.toString())
  console.table(usuarioEditar.value)
}

// validar datos del dialog
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const editarUsuario = async () => {
  let isValid = true
  if (!patronEmail.test(usuarioEditar.value.email)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (!usuarioEditar.value.username || !usuarioEditar.value.email || !usuarioEditar.value.pass || !usuarioEditar.value.permiso) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (isValid) {
    try {
      const response = await fetch(`http://localhost:3000/usuario/${usuarioEditar.value?.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          username: usuarioEditar.value?.username,
          email: usuarioEditar.value?.email,
          pass: usuarioEditar.value?.pass,
          permiso: usuarioEditar.value?.permiso
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Editado', detail: 'Usuario editado', life: 3000 });
        const usuarioEditado = {
          username: usuarioEditar.value?.username,
          email: usuarioEditar.value?.email,
          pass: usuarioEditar.value?.pass,
          permiso: usuarioEditar.value?.permiso
        };
        console.table(usuarioEditado)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    } finally {
      visibleDialog.value = false
      getUsersData()
    }
  }
}

// Dropdown permisos 
const permisos = ref([
  { name: 'Alumno', code: 0 },
  { name: 'Profesor', code: 1 },
  { name: 'Administrador', code: 9 },
]);

// Ir a la página idividual del usuario
const goToUser = (id: number) => {
  router.push({
    path: `/usuario/${id}`
  })
}

// Filtrar datos
const filters = ref() // variable filtro

const permisos1 = ['Alumno', 'Profesor', 'Administrador'];

const initFilters = () => { // componente filtro en global para que busque cualquier valor
  filters.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'username': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'permiso': { value: null, matchMode: FilterMatchMode.EQUALS },
  }
}
initFilters()

const clearFilter = () => { // para borrar los filtros, reinicio la función y el value = null
  initFilters()
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
  <div class="flex justify-content-start pt-2">
    <div class="card flex justify-content-center">
      <DataTable v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['username', 'email', 'permiso']" class="" removableSort :value="usersRefFromServer" dataKey="id" stripedRows
        selectionMode="single" sortField="nombre" :sortOrder="1" :paginator="true" :rows="10" tableStyle="width: auto" :pt="{
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
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Listado Usuarios</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button rounded icon="pi pi-filter-slash" label="" v-tooltip.top="'Limpiar filtros'" outlined @click="clearFilter()"></Button>
          </span>
        </div>

        <Column field="username" header="Username" sortable headerStyle="min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="email" header="Email" sortable headerStyle="min-width:14rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="permiso" header="Permiso" sortable headerStyle="min-width:7rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #body="{ data }">
            <Tag :value="data.permiso" :severity="getSeverity(data.permiso)" />
          </template>
          <template #filter="{ filterModel }">
            <Dropdown v-model="filterModel.value" :options="permisos1" placeholder="Selecciona" class="p-column-filter" style="width: auto">
              <template #option="slotProps">
                <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
              </template>
            </Dropdown>
          </template>
        </Column>
        <Column headerStyle="width:20%; min-width:8rem" bodyClass="flex p-1 pl-1">
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" @click="goToUser(slotProps.data.id)"></Button>
            <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" @click="mostrarDialog(slotProps.data)"></Button>
            <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)"></Button>
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


      <Dialog v-model:visible="visibleDialog" modal header="Editar Usuario" class="w-3" :pt="{
        header: { class: 'flex align-items-baseline h-5rem' },
        title: { class: '' },
        closeButtonIcon: { class: '' },
        mask: {
          style: 'backdrop-filter: blur(3px)'
        }
      }">

        <span class="p-text-secondary flex mb-5">Actualizar información</span>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="username" class="font-semibold w-6rem">Username</label>
          <InputText id="username" class="w-7" v-model="usuarioEditar.username" :class="{ 'p-invalid': !usuarioEditar.username }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="email" class="font-semibold w-6rem">Email</label>
          <InputText id="email" class="w-7" v-model="usuarioEditar.email" :class="{ 'p-invalid': !usuarioEditar.email }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="pass" class="font-semibold w-6rem">Contraseña</label>
          <Password id="pass" class="w-7" :feedback="false" v-model="usuarioEditar.pass" :class="{ 'p-invalid': !usuarioEditar.pass }" />
        </div>
        <div class="flex align-items-center gap-3 mb-3">
          <label for="permiso" class="font-semibold w-6rem">Permiso</label>
          <Dropdown class="" id="permisos" :options="permisos" optionLabel="name" optionValue="code" checkmark :highlightOnSelect="false" showClear placeholder="Selecciona un permiso"
            v-model="usuarioEditar.permiso" :class="{ 'p-invalid': usuarioEditar.permiso == null }" />
        </div>
        <div class=" flex justify-content-center mb-3 pt-2">
          <Button type="button" rounded label="Cancelar" severity="secondary" @click="visibleDialog = false"></Button>
          <Button type="button" rounded label="Actualizar" @click="editarUsuario()"></Button>
        </div>
        <Toast></Toast>
      </Dialog>

    </div>
  </div>
</template>
<style scoped></style>
