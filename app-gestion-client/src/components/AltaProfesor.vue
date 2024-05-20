<script setup lang="ts">
import { inject, onMounted, ref, watch, type Ref } from 'vue'
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import FileUpload from 'primevue/fileupload';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import InlineMessage from 'primevue/inlinemessage';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import router from '@/router';
import { useAdminStore } from '@/stores/isAdmin';
import type { VueCookies } from 'vue-cookies';
import DireccionService from '@/utils/direccion.service';

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

// Referencias del formulario
const teacherRef = {
  nombre: ref<string | undefined>(undefined),
  apellidos: ref<string | undefined>(undefined),
  dni: ref<string | undefined>(undefined),
  direccion: ref<string | undefined>(undefined),
  codigoPostal: ref<string | undefined>(undefined),
  ciudad: ref<string | undefined>(undefined),
  provincia: ref<string | undefined>(undefined),
  telefono: ref<string | undefined>(undefined),
  email: ref<string | undefined>(undefined),
  foto: ref<File | null>(null),
  userId: ref<number | undefined>(undefined)
}
const formSubmitted = ref(false); // variable para avisos con InlineText

// para resetear los datos del formulario y poner cada ref a vacío
const borrarDatosForm = () => {
  teacherRef.nombre.value = undefined
  teacherRef.apellidos.value = undefined
  teacherRef.email.value = undefined
  selectedUserId.value = undefined
  formSubmitted.value = false;
  user.value = undefined
}

// // OBTENER ASIGNATURAS DE LA BD
// let asignaturas: Ref<
//   {
//     id: number
//     nombre: string
//   }[]
// > = ref([])

// const getSubjectsData = async () => {
//   try {
//     const response = await fetch('http://localhost:3000/asignaturas', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     })
//     if (!response.ok) {
//       throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
//     } else {
//       const data = (await response.json()) as {
//         id: number
//         nombre: string
//       }[]
//       asignaturas.value = data
//       console.log(data)
//     }
//   } catch (error) {
//     alert('Hay un error' + error)
//     toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo las asignaturas', life: 3000 });
//   }
// }
// getSubjectsData()

//OBTENER USUARIOS
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
const selectedUserId: Ref<number | undefined> = ref(undefined)
const user: Ref<{
  id: number | null;
  username: string;
  email: string;
  permiso: number | null;
} | undefined> = ref(undefined);

const permisoString: Ref<string> = ref("")

const getUser = async () => {
  if (selectedUserId.value != undefined) {
    try {
      const response = await fetch(`http://localhost:3000/usuario/${selectedUserId.value}`, {
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
        user.value = data
        // console.table(user.value)

        // PERMISO A STRING
        switch (user.value.permiso) {
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
          default:
            permisoString.value = ''
        }
      }
    }
    catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    }
  }
}

watch(selectedUserId, () => {
  if (selectedUserId.value != undefined) {
    getUser()
  }
})

// VALIDAR DATOS DEL FORMULARIO
const patronTel = /^\d{9}$/
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const patronDNI = /^\d{8}[a-zA-Z]$/;


// FETCH PARA ENVIAR DATOS DEL PROFESOR A LA BD:

const foto: Ref<File | null> = ref(null);

const handleFileChange = (event: any) => {
  foto.value = event.files[0]
  console.log(foto.value)
};

const crearProfesor = async () => {
  formSubmitted.value = true;
  let isValid = true
  if (teacherRef.telefono.value && !patronTel.test(teacherRef.telefono.value)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'El número de teléfono debe tener 9 dígitos numéricos', life: 3000 });
    isValid = false
  }
  if (teacherRef.email.value && !patronEmail.test(teacherRef.email.value)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (teacherRef.dni.value && !patronDNI.test(teacherRef.dni.value)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un DNI válido. Sin guiones ni puntos', life: 3000 });
    isValid = false
  }
  if (!teacherRef.nombre.value || !teacherRef.apellidos.value || !teacherRef.email.value) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (!user.value) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Debe seleccionar un usuario', life: 3000 });
    isValid = false
  }
  if (isValid) {
    try {
      // const response = await fetch('http://localhost:3000/teacher', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     nombre: teacherRef.nombre.value,
      //     apellidos: teacherRef.apellidos.value,
      //     dni: teacherRef.dni.value,
      //     direccion: teacherRef.direccion.value,
      //     telefono: Number(teacherRef.telefono.value),
      //     email: teacherRef.email.value,
      //     userId: user.value?.id
      //   }),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   credentials: 'include'
      // })

      // unir dirección completa
      teacherRef.direccion.value = teacherRef.direccion.value + ', ' + teacherRef.codigoPostal.value + '. ' + teacherRef.ciudad.value + ', ' + teacherRef.provincia.value
      // console.log(studentRef.direccion.value)

      const formData = new FormData();
      formData.append('nombre', `${teacherRef.nombre.value}`);
      formData.append('apellidos', `${teacherRef.apellidos.value}`);
      formData.append('dni', `${teacherRef.dni.value}`);
      formData.append('direccion', `${teacherRef.direccion.value}`);
      formData.append('telefono', `${teacherRef.telefono.value}`); // Ojo que se pasa como string. Se transforma como number en el DTO
      formData.append('email', `${teacherRef.email.value}`);
      formData.append('userId', `${user.value?.id}`); // Ojo que se pasa como string. Se transforma como number en el DTO
      if (foto.value) {
        formData.append('foto', foto.value);
      }

      const response = await fetch('http://localhost:3000/teacher', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Creado', detail: 'Profesor creado', life: 3000 });

        const datosProfesor = {
          nombre: teacherRef.nombre.value,
          apellidos: teacherRef.apellidos.value,
          dni: teacherRef.dni.value,
          direccion: teacherRef.direccion.value,
          telefono: teacherRef.telefono.value,
          email: teacherRef.email.value,
          userId: user.value?.id,
          foto: foto.value,
        }
        console.table(datosProfesor)
        borrarDatosForm()
        formSubmitted.value = false;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    }
  }
}

//OBTENER CCAAS Y PROVINCIAS
const ccaas: Ref<any> = ref([])
const provincias: Ref<{
  parent_code: string,
  code: string,
  label: string
}[]> = ref([])

onMounted(async () => {
  try {
    getUsersData()

    // const ccaasData = await fetch('/src/utils/ccaas.json', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   credentials: 'include'
    // });
    // const provinciasData = await fetch('/src/utils/provincias.json', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   credentials: 'include'
    // });

    const ccaasData = DireccionService.getCCAAS()
    const provinciasData = DireccionService.getProvincias()

    // if (!ccaasData.ok || !provinciasData.ok) {
    //   throw new Error('No se pudo obtener el archivo JSON');
    // }
    if (!ccaasData || !provinciasData) {
      throw new Error('No se pudo obtener el archivo JSON');
    }

    // ccaas.value = await ccaasData.json();
    // provincias.value = await provinciasData.json();
    ccaas.value = await ccaasData;
    provincias.value = await provinciasData;
    console.log(ccaas.value)
    console.log(provincias.value)
  } catch (error) {
    console.error('Error al obtener los datos del JSON:', error);
  }
});


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
    <form @submit.prevent="crearProfesor()">
      <h2>Nuevo Profesor</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Nombre</label>
          <InputText class="" id="nombreInput" v-model="teacherRef.nombre.value" />
          <InlineMessage v-if="!teacherRef.nombre.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El nombre es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Apellidos</label>
          <InputText class="" id="apellidosInput" v-model="teacherRef.apellidos.value" />
          <InlineMessage v-if="!teacherRef.apellidos.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El apellido es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Dni</label>
          <InputText class="" id="dniInput" v-model="teacherRef.dni.value" />
          <InlineMessage v-if="!teacherRef.dni.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El DNI es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Teléfono</label>
          <!-- <InputNumber class="" id="telefonoInput" :useGrouping="false" required v-model="studentRef.telefono.value" /> -->
          <InputMask class="" id="telefonoInput" mask="999999999" slotChar="" v-model="teacherRef.telefono.value" />
          <InlineMessage v-if="!teacherRef.telefono.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El teléfono es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12">
          <label class="">Email</label>
          <InputText class="" id="emailInput" v-model="teacherRef.email.value" />
          <InlineMessage v-if="!teacherRef.email.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El email es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-12 md:col-12 sm:col-12">
          <label class="">Dirección</label>
          <InputText class="" id="direcciónInput" v-model="teacherRef.direccion.value" />
          <InlineMessage v-if="!teacherRef.direccion.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La dirección es obligatoria</InlineMessage>
        </div>
        <div class="field col-12 lg:col-3 md:col-12 sm:col-12">
          <label class="">Código Postal</label>
          <InputMask class="" id="CPInput" mask="99999" slotChar="" v-model="teacherRef.codigoPostal.value" />
          <InlineMessage v-if="!teacherRef.codigoPostal.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El CP es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-5 md:col-12 sm:col-12">
          <label class="">Ciudad</label>
          <InputText class="" id="ciudadInput" v-model="teacherRef.ciudad.value" />
          <InlineMessage v-if="!teacherRef.ciudad.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La ciudad es obligatoria</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12">
          <label class="">Provincia</label>
          <Dropdown class="" :options="provincias" optionLabel="label" optionValue="label" checkmark :highlightOnSelect="false" showClear id="provinciaInput" placeholder="Selecciona una provincia"
            v-model="teacherRef.provincia.value" />
          <InlineMessage v-if="!teacherRef.provincia.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La provincia es obligatoria</InlineMessage>
        </div>
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12 ">
          <label class="">Seleccionar usuario</label>
          <Dropdown class="w-max" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput"
            placeholder="Selecciona un usuario" v-model="selectedUserId" />
          <InlineMessage v-if="!user && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El usuario es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Seleccionar imagen de perfil</label>
          <FileUpload class="w-auto" mode="basic" choose-label="Seleccionar archivo" accept="image/*" :maxFileSize="1000000" @select="handleFileChange"></FileUpload>
        </div>
        <div class="field col-12 mb-3" v-if="selectedUserId != undefined">
          <DataTable :value="[user]" class="pl-1" tableStyle="width: 30rem" :pt="{
    table: {
      class: 'mt-0',
      style: { 'border': 'none' }
    }
  }">
            <Column field="username" header="Username" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
            <Column field="email" header="Email" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
            <Column field="permiso" header="Permiso" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem">
              <template #body="">
                {{ permisoString }}
              </template>
            </Column>
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