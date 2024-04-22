<script setup lang="ts">
import { inject, onBeforeMount, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown';
import { FilterMatchMode } from 'primevue/api';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import { useAdminStore } from '@/stores/isAdmin';
import type { VueCookies } from 'vue-cookies';

const confirm = useConfirm();
const toast = useToast();
const router = useRouter()

// VERIFICAR SI SE ES ADMINISTRADOR
const adminStore = useAdminStore()
const $cookies = inject<VueCookies>('$cookies')
const isAdmin: Ref<boolean> = ref(adminStore.isAdmin)

onMounted(() => {
  const userCookie = $cookies?.get('user') // si no existe, userCookie es null
  console.log(userCookie)
  if (userCookie?.permiso == 9) {
    adminStore.isAdminTrue()
    isAdmin.value = true
  }
  else if (!isAdmin.value || userCookie?.permiso == null || userCookie?.permiso != '9') {
    adminStore.isAdminFalse()
  }
})


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

// Función para ocultar la contraseña
const ocultarContraseña = () => {
  if (userDataFromServer.value?.pass) {
    return '*'.repeat(userDataFromServer.value.pass.length)
  }
};


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

const cambiarContraseña: Ref<boolean> = ref(false);
const cambiarEmail: Ref<boolean> = ref(false);

const cambioContraseña = async () => {
  cambiarContraseña.value = true
}
const cambioEmail = async () => {
  cambiarEmail.value = true
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
      cambiarContraseña.value = false
      cambiarEmail.value = false
      getUserData()
    }
  }
}

// LÓGICA MOSTRAR ALUMNOS Y PROFESORES ASIGNADOS A ESTE USUARIO
// obtener alumnos + obtener profesores y filtrar por userId

// Obtener todos los alumnos y filtrar
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

      // filtrar por UserId 
      const updatedData = data.filter(student => student.userId.id == userDataFromServer.value?.id)
      studentsRefFromServer.value = updatedData

      // console.log(data)
      console.log(studentsRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

getStudentsData()

// Obtener todos los profesores y filtrar
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

      // filtrar por UserId 
      const updatedData = data.filter(student => student.userId.id == userDataFromServer.value?.id)
      teachersRefFromServer.value = updatedData

      console.log(teachersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

getTeachersData()

// LÓGICA EDITAR ASGNACIÓN USUARIO

// Obtener todos los usuarios 
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

// Obtener usuario elegido para que se muestre en la tabla 
const getUser = async (userId: number) => {
  if (profesorEditar.value?.userId.id != undefined) {
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
          // default:
          //   permisoString.value = ''
        }

        alumnoEditar.value.userId = data
        // PERMISO A STRING
        switch (alumnoEditar.value.userId.permiso) {
          case 0:
            alumnoEditar.value.userId.permiso = 'Alumno'
            break;
          case 1:
            alumnoEditar.value.userId.permiso = 'Profesor'
            break;
          case 9:
            alumnoEditar.value.userId.permiso = 'Aministrador'
            break;
          case null:
            alumnoEditar.value.userId.permiso = '';
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

// Editar profesor
const visibleDialogEditarProfesor: Ref<boolean> = ref(false);

const mostrarDialogEditarProfesor = async (teacher: typeof teachersRefFromServer.value[0]) => {
  visibleDialogEditarProfesor.value = true
  profesorEditar.value = { ...teacher } // spread crea un nuevo objeto y copia superficialmente el objeto
  await getUser(teacher.userId.id) //Obtener usuario
  console.table(usuarioEditar.value)
}

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

const editarProfesor = async () => {
  let isValid = true
  if (isNaN(profesorEditar.value.userId.id)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, seleccione un usuario', life: 3000 });
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
      visibleDialogEditarProfesor.value = false
      getTeachersData()
    }
  }
}

// editar Alumno
const visibleDialogEditarAlumno: Ref<boolean> = ref(false);

const mostrarDialogEditarAlumno = async (student: typeof studentsRefFromServer.value[0]) => {
  visibleDialogEditarAlumno.value = true
  alumnoEditar.value = { ...student } // spread crea un nuevo objeto y copia superficialmente el objeto
  await getUser(student.userId.id) //Obtener usuario

  console.table(alumnoEditar.value)
}

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

const editarAlumno = async () => {
  let isValid = true

  if (isNaN(alumnoEditar.value.userId.id)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, seleccione un usuario', life: 3000 });
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
      visibleDialogEditarAlumno.value = false
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

// Ir a la página idividual del profesor
const goToTeacher = (id: number) => {
  router.push({
    path: `/profesor/${id}`
  })
}


// Dropdown permisos 
const permisos = ref([
  { name: 'Alumno', code: 0 },
  { name: 'Profesor', code: 1 },
  { name: 'Administrador', code: 9 },
]);

// severity del Tag de la tabla
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



// volver a la página anterior
const volver = () => {
  window.history.back()
}

// Filtrar datos
const filters = ref() // variable filtro

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
</script>

<template>
  <div class="w-max">
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
            <li class="flex align-items-center mb-3">
              <div class="bg-blue-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-envelope text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex align-self-center">
                <span class="flex justify-content-start align-self-center font-bold">Email</span>
                <a :href="'mailto:' + userDataFromServer?.email" class="ml-2 flex justify-content-start align-self-center"> {{ userDataFromServer?.email }}</a>
                <Button v-if="!isAdmin" class="ml-5 w-max w-3rem" icon="pi pi-envelope" severity="info" v-tooltip.top="'Cambiar email'" @click="cambioEmail(), mostrarDialogEditarUsuario()"></Button>
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-pink-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-key text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex align-self-center">
                <span class="flex justify-content-start align-self-center font-bold">Pass</span>
                <!-- <span class="flex justify-content-start "> {{ userDataFromServer?.pass }}</span> -->
                <!-- <span class="flex justify-content-start "> {{ ocultarContraseña() }}</span> -->
                <span class="ml-2 flex justify-content-start align-self-center  "> ******************** </span>
                <Button v-if="!isAdmin" class="ml-5 w-max w-3rem" icon="pi pi-key" severity="danger" v-tooltip.top="'Cambiar contraseña'"
                  @click="cambioContraseña(), mostrarDialogEditarUsuario()"></Button>
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-bluegray-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-verified text-bluegray-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Permiso</span>
                <!-- <span class="flex justify-content-start "> {{ userDataFromServer?.permiso }}</span> -->
                <Tag v-if="userDataFromServer" :severity="getSeverity(userDataFromServer?.permiso.toString())" style="font-size: small;"> {{ userDataFromServer?.permiso }} </Tag>

              </div>
            </li>
          </ul>
        </div>

        <div class="ml-2" v-if="isAdmin">
          <!--  mostrar solo si es admin -->
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
        }
          ">

    <span class="p-text-secondary flex mb-5">Actualizar información</span>
    <div class="flex align-items-center gap-3 mb-3" v-if="!cambiarContraseña && !cambiarEmail">
      <label for="username" class="font-semibold w-6rem">Username</label>
      <InputText id="username" class="w-7" v-model="usuarioEditar.username" :class="{ 'p-invalid': !usuarioEditar.username }" />
    </div>
    <div class="flex align-items-center gap-3 mb-3" v-if="cambiarEmail && !cambiarContraseña || isAdmin">
      <label for="email" class="font-semibold w-6rem">Email</label>
      <InputText id="email" class="w-7" v-model="usuarioEditar.email" :class="{ 'p-invalid': !usuarioEditar.email }" />
    </div>
    <div class="flex align-items-center gap-3 mb-3" v-if="cambiarContraseña && !cambiarEmail || isAdmin">
      <label for="pass" class="font-semibold w-6rem">Contraseña</label>
      <Password id="pass" class="w-7" :feedback="false" v-model="usuarioEditar.pass" :class="{ 'p-invalid': !usuarioEditar.pass }" />
    </div>
    <div class="flex align-items-center gap-3 mb-3" v-if="isAdmin && !cambiarContraseña && !cambiarEmail">
      <label for="permiso" class="font-semibold w-6rem">Permiso</label>
      <Dropdown class="" id="permisos" :options="permisos" optionLabel="name" optionValue="code" checkmark :highlightOnSelect="false" showClear placeholder="Selecciona un permiso"
        v-model="usuarioEditar.permiso" :class="{ 'p-invalid': usuarioEditar.permiso == null }">

      </Dropdown>
    </div>
    <div class=" flex justify-content-center mb-3 pt-2">
      <Button class="mr-2" type="button" rounded label="Cancelar" severity="secondary" @click="visibleDialogEditarUsuario = false, cambiarContraseña = false, cambiarEmail = false"></Button>
      <Button type="button" rounded label="Actualizar" @click="editarUsuario()"></Button>
    </div>
    <Toast></Toast>
  </Dialog>

  <!-- Tabla alumnos asignados -->
  <!-- v-if="studentsRefFromServer.length > 0" -->
  <div class="card w-max " >
    <DataTable v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['nombre', 'apellidos', 'email', 'userId.username', 'userId.email', 'userId.permiso']" class="" removableSort
      :value="studentsRefFromServer" dataKey="id" stripedRows selectionMode="single" sortField="nombre" :sortOrder="1" :paginator="true" :rows="5" :pt="{
          paginator: {
            paginatorWrapper: { class: 'col-12 flex justify-content-center' },
            firstPageButton: { class: 'w-auto' },
            previousPageButton: { class: 'w-auto' },
            pageButton: { class: 'w-auto' },
            nextPageButton: { class: 'w-auto' },
            lastPageButton: { class: 'w-auto' },
          },
          table: {
            class: 'mt-0 w-auto',
            style: { 'border': 'none' }
          }
        }
          ">

      <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
        <h5 class="m-0 text-3xl text-800 font-bold pl-1">Alumnos asignados</h5>
        <span class="mt-2 md:mt-0 p-input-icon-left flex align-items-center">
          <i class="pi pi-search"></i>
          <InputText class="h-3rem mr-2" v-model="filters['global'].value" placeholder="Búsqueda global..." />
          <Button class="mr-2" rounded icon="pi pi-filter-slash" label="" v-tooltip.top="'Limpiar filtros'" outlined @click="clearFilter()"></Button>
        </span>
      </div>

      <ColumnGroup type="header" class="">
        <Row>
          <Column field="nombre" header="Nombre" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
            </template>
          </Column>
          <Column field="apellidos" header="Apellidos" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
            </template>
          </Column>
          <Column field="dni" header="DNI" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
            </template>
          </Column>
          <Column field="direccion" header="Dirección" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
            </template>
          </Column>
          <Column field="telefono" header="Teléfono" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="number" class="p-column-filter" placeholder="Buscar..." />
            </template>
          </Column>
          <Column field="email" header="Email" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
            <template #filter="{ filterModel }">
              <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
            </template>
          </Column>
          <Column field="" header=""></Column>

        </Row>
      </ColumnGroup>

      <Column field="nombre"></Column>
      <Column field="apellidos"></Column>
      <Column field="dni"></Column>
      <Column field="direccion"></Column>
      <Column field="telefono"></Column>
      <Column field="email"></Column>

      <Column headerStyle="min-width:rem" bodyClass="flex p-1 pl-0">
        <template #body="slotProps">
          <Button class="m-0 p-0 h-4rem w-4rem" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Alumno'" @click="goToStudent(slotProps.data.id)"></Button>

          <!-- mostrar solo si es ADMIN -->
          <Button v-if="isAdmin" class="m-0 p-0 h-4rem w-4rem" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Alumno'"
            @click="mostrarDialogEditarAlumno(slotProps.data)"></Button>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog editar alumno -->
    <Dialog v-model:visible="visibleDialogEditarAlumno" modal header="Editar Alumno" class="w-3" :pt="{
          header: { class: 'flex align-items-baseline h-5rem' },
          title: { class: '' },
          closeButtonIcon: { class: '' },
          mask: {
            style: 'backdrop-filter: blur(3px)'
          }
        }">

      <span class="p-text-secondary flex mb-5">Actualizar información</span>

      <div class="flex align-items-center gap-3 mb-3">
        <label for="usuario" class="font-semibold w-6rem">Usuario</label>
        <Dropdown class="" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput" placeholder="Selecciona un usuario"
          v-model="alumnoEditar.userId.id" @change="getUser(alumnoEditar.userId.id)" :class="{ 'p-invalid': alumnoEditar.userId.id == undefined }" />
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
          <Column field="permiso" header="Permiso" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
        </DataTable>
      </div>
      <div class="flex justify-content-center mb-3 pt-2">
        <Button class="mr-2" type="button" rounded label="Cancelar" severity="secondary" @click="getStudentsData(), visibleDialogEditarAlumno = false"></Button>
        <Button type="button" rounded label="Actualizar" @click="editarAlumno()"></Button>
      </div>
      <Toast></Toast>
    </Dialog>
  </div>

  <!-- Tabla profesores asignados -->
  <!-- v-if="teachersRefFromServer.length > 0" -->
  <div class="card w-max" >
    <DataTable v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['nombre', 'apellidos', 'email', 'userId.username', 'userId.email', 'userId.permiso']" class="" removableSort
      :value="teachersRefFromServer" dataKey="id" stripedRows selectionMode="single" sortField="nombre" :sortOrder="1" :paginator="true" :rows="5" :pt="{
          paginator: {
            paginatorWrapper: { class: 'col-12 flex justify-content-center' },
            firstPageButton: { class: 'w-auto' },
            previousPageButton: { class: 'w-auto' },
            pageButton: { class: 'w-auto' },
            nextPageButton: { class: 'w-auto' },
            lastPageButton: { class: 'w-auto' },
          },
          table: {
            class: 'mt-0 w-auto',
            style: { 'border': 'none' }
          }
        }
          ">

      <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
        <h5 class="m-0 text-3xl text-800 font-bold pl-1 mr-5">Profesores asignados</h5>
        <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
          <i class="pi pi-search"></i>
          <InputText class="h-3rem mr-2" v-model="filters['global'].value" placeholder="Búsqueda global..." />
          <Button class="mr-2" rounded icon="pi pi-filter-slash" label="" v-tooltip.top="'Limpiar filtros'" outlined @click="clearFilter()"></Button>
        </span>
      </div>

      <ColumnGroup type="header" class="">
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

          <Column field="" header=""></Column>
        </Row>
      </ColumnGroup>

      <Column field="nombre"></Column>
      <Column field="apellidos"></Column>
      <Column field="email"></Column>



      <Column headerStyle="width:20%; min-width:8rem" bodyClass="flex p-1 pl-1">
        <template #body="slotProps">
          <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Profesor'" @click="goToTeacher(slotProps.data.id)"></Button>

          <!-- mostrar solo si es ADMIN -->
          <Button v-if="isAdmin" class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Profesor'" @click="mostrarDialogEditarProfesor(slotProps.data)"></Button>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog editar Profesor-->
    <Dialog v-model:visible="visibleDialogEditarProfesor" modal header="Editar Profesor" class="w-3" :pt="{
          header: { class: 'flex align-items-baseline h-5rem' },
          title: { class: '' },
          closeButtonIcon: { class: '' },
          mask: {
            style: 'backdrop-filter: blur(3px)'
          }
        }
          ">

      <span class="p-text-secondary flex mb-5">Actualizar asignación</span>

      <div class="flex align-items-center gap-3 mb-3">
        <label for="usuario" class="font-semibold w-6rem">Usuario</label>
        <Dropdown class="" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput" placeholder="Selecciona un usuario"
          v-model="profesorEditar.userId.id" @change="getUser(profesorEditar.userId.id)" :class="{ 'p-invalid': profesorEditar.userId.id == undefined }" />
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
          <Column field="permiso" header="Permiso" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
        </DataTable>
      </div>
      <div div class=" flex justify-content-center mb-3 pt-2">
        <Button class="mr-2" type="button" rounded label="Cancelar" severity="secondary" @click="getTeachersData(), visibleDialogEditarProfesor = false"></Button>
        <Button type="button" rounded label="Actualizar" @click="editarProfesor()"></Button>
      </div>
      <Toast></Toast>
    </Dialog>
  </div>


</template>

<style></style>
