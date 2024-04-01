<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
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

const userDataFromServer: Ref<{
  id: number
  username: string
  email: string
  pass: string
  permiso: number | string
} | undefined> = ref(undefined)

const userId = Number(router.currentRoute.value.params.id)
console.log(userId)
console.log(router.currentRoute.value.params['id'])


// OBTENER DATOS DEL USUARIO
const getUserData = async () => {

  try {
    const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
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
      userDataFromServer.value = data
      console.log(userDataFromServer.value)
      // Para cambiar el permiso a string
      if (userDataFromServer.value) {
        userDataFromServer.value.permiso = PermisoToString(Number(userDataFromServer.value?.permiso))
      }

    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error obteniendo los datos del alumno', life: 3000 });
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

getUserData()


// LÓGICA BORRAR USUARIO
const confirmDeleteUsuario = () => {
  console.log("borrando usuario")
  confirm.require({
    message: '¿Seguro que quiere eliminar este usuario?',
    header: 'Borrar Alumno',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarUsuario()
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

// LÓGICA BORRAR USUARIO
const borrarUsuario = async () => {
  try {
    const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Usuario borrado', life: 3000 });
      toast.add({ severity: 'info', summary: 'Redirigiendo', detail: 'Redirigiendo al listado de usuarios...', life: 3000 });
      setTimeout(() => {
        router.push('/listado-usuarios')
      }, 2000)
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)

    if (error.message.includes('400')) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'No se puede borrar el usuario porque está asignado a un profesor o alumno', life: 3000 });
    }
    else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al borrar al usuario', life: 3000 });
    }
  } finally {
    getUserData()
  }
}

// LÓGICA EDITAR USUARIO
const visibleDialogEditarUsuario: Ref<boolean> = ref(false);

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

const mostrarDialogEditarUsuario = async () => {
  visibleDialogEditarUsuario.value = true
  if (userDataFromServer.value) {
    usuarioEditar.value = { ...userDataFromServer.value }
  }
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
  if (!usuarioEditar.value.username || !usuarioEditar.value.email || !usuarioEditar.value.pass || isNaN(Number(usuarioEditar.value.permiso))) {
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
      visibleDialogEditarUsuario.value = false
      getUserData()
    }
  }
}

// Dropdown permisos 
const permisos = ref([
  { name: 'Alumno', code: 0 },
  { name: 'Profesor', code: 1 },
  { name: 'Administrador', code: 9 },
]);


// volver a la página anterior
const volver = () => {
  window.history.back()
}
</script>

<template>
  <div class="col-10">
    <div class="grid">
      <div id="header" class="flex col-12 justify-content-between h-auto mb-2">
        <h2 class="m-0 text-4xl text-800 font-bold">Perfil del Usuario</h2>
        <Button class="w-auto" severity="secondary" @click="volver()">Volver</Button>
      </div>

      <div id="datos" class="card col-12">
        <div id="datos-usuario" class="mb-5">

          <ul id="datos-usuario" class="list-none p-0">
            <li class="flex mb-3">
              <div class="bg-green-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-user text-green-500" style="font-size: 2rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Username</span>
                <span class="flex justify-content-start "> {{ userDataFromServer?.username }}</span>
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-blue-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-envelope text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Email</span>
                <a :href="'mailto:' + userDataFromServer?.email" class="flex justify-content-start"> {{ userDataFromServer?.email }}</a>
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-pink-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-key text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Pass</span>
                <span class="flex justify-content-start "> {{ userDataFromServer?.pass }}</span>

              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-bluegray-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-verified text-bluegray-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Permiso</span>
                <span class="flex justify-content-start "> {{ userDataFromServer?.permiso }}</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="ml-2">
          <!-- TODO mostrar solo si es admin -->
          <Button class="w-max w-3rem mr-2" icon="pi pi-trash" severity="danger" v-tooltip.top="'Borrar Usuario'" @click="confirmDeleteUsuario()"></Button>
          <Button class="w-max w-3rem" icon="pi pi-pencil" severity="secondary" v-tooltip.top="'Editar Usuario'" @click="mostrarDialogEditarUsuario()"></Button>
        </div>
      </div>
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

  <!-- Dialog Editar Usuario -->
  <Dialog v-model:visible="visibleDialogEditarUsuario" modal header="Editar Usuario" class="w-3" :pt="{
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
        v-model="usuarioEditar.permiso" :class="{ 'p-invalid': usuarioEditar.permiso == null }">

      </Dropdown>
    </div>
    <div class=" flex justify-content-center mb-3 pt-2">
      <Button type="button" rounded label="Cancelar" severity="secondary" @click="visibleDialogEditarUsuario = false"></Button>
      <Button type="button" rounded label="Actualizar" @click="editarUsuario()"></Button>
    </div>
    <Toast></Toast>
  </Dialog>

</template>

<style></style>
