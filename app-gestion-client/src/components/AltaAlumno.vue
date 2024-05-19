<script setup lang="ts">
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import InputMask from 'primevue/inputmask';
import FileUpload from 'primevue/fileupload';
import Dropdown from 'primevue/dropdown';
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import { inject, onMounted, ref, watch, type Ref } from 'vue'
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import DireccionService from '@/utils/direccion.service';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import router from '@/router';
import { useAdminStore } from '@/stores/isAdmin';
import type { VueCookies } from 'vue-cookies';
import { stringifyQuery } from 'vue-router';

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
const studentRef = {
  nombre: ref<string | undefined>(undefined),
  apellidos: ref<string | undefined>(undefined),
  dni: ref<string | undefined>(undefined),
  direccion: ref<string | undefined>(undefined),
  // codigoPostal: ref<string | undefined>(undefined),
  // ciudad: ref<string | undefined>(undefined),
  // provincia: ref<string | undefined>(undefined),
  telefono: ref<string | undefined>(undefined),
  email: ref<string | undefined>(undefined),
  foto: ref<File | null>(null),
  userId: ref<number | undefined>(undefined)
}

const formSubmitted = ref(false); // variable para avisos con InlineText

// Resetear los datos del formulario y poner cada ref a vacío
const borrarDatosForm = () => {
  studentRef.nombre.value = undefined
  studentRef.apellidos.value = undefined
  studentRef.dni.value = undefined
  studentRef.direccion.value = undefined
  // studentRef.codigoPostal.value = undefined
  // studentRef.ciudad.value = undefined
  // studentRef.provincia.value = undefined
  studentRef.telefono.value = undefined
  studentRef.email.value = undefined
  selectedUserId.value = undefined
  formSubmitted.value = false;
}

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

//OBTENER USUARIO PARA MOSTRAR
const selectedUserId: Ref<number | undefined> = ref(undefined)
const user: Ref<{
  id: number;
  username: string;
  email: string;
  permiso: number;
} | undefined> = ref(undefined);

const permisoString: Ref<string> = ref("")

const getUser = async () => {
  console.log("obteniendo usuario")
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

watch(selectedUserId, () => {
  if (selectedUserId.value != undefined) {
    getUser()
  }
})

// VALIDAR DATOS DEL FORMULARIO
const patronTel = /^\d{9}$/
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// FETCH PARA ENVIAR DATOS DEL ALUMNO A LA BD:

const foto: Ref<File | null> = ref(null);

const handleFileChange = (event: any) => {
  foto.value = event.files[0]
  console.log(foto.value)
};

const crearAlumno = async () => {
  formSubmitted.value = true;
  let isValid = true

  if (studentRef.telefono.value && !patronTel.test(studentRef.telefono.value)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'El número de teléfono debe tener 9 dígitos numéricos', life: 3000 });
    isValid = false
  }
  if (studentRef.email.value && !patronEmail.test(studentRef.email.value)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (!studentRef.nombre.value || !studentRef.apellidos.value || !studentRef.dni.value || !studentRef.direccion.value || !studentRef.telefono.value || !studentRef.email.value) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (!user.value) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Debe seleccionar un usuario', life: 3000 });
    isValid = false
  }
  if (isValid) {
    try {
      // const response = await fetch('http://localhost:3000/student', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     nombre: studentRef.nombre.value,
      //     apellidos: studentRef.apellidos.value,
      //     dni: studentRef.dni.value,
      //     direccion: studentRef.direccion.value,
      //     telefono: Number(studentRef.telefono.value),
      //     email: studentRef.email.value,
      //     userId: user.value?.id
      //   }),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   credentials: 'include'
      // })

      const formData = new FormData();
      formData.append('nombre', `${studentRef.nombre.value}`);
      formData.append('apellidos', `${studentRef.apellidos.value}`);
      formData.append('dni', `${studentRef.dni.value}`);
      formData.append('direccion', `${studentRef.direccion.value}`);
      formData.append('telefono', `${studentRef.telefono.value}`); // Ojo que se pasa como string. Se transforma como number en el DTO
      formData.append('email', `${studentRef.email.value}`);
      formData.append('userId', `${user.value?.id}`); // Ojo que se pasa como string. Se transforma como number en el DTO
      if (foto.value) {
        formData.append('foto', foto.value);
      }

      const response = await fetch('http://localhost:3000/student', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Creado', detail: 'Alumno creado', life: 3000 });
        // Imprimo los datos que he introducido
        const datosAlumno = [
          studentRef.nombre.value,
          studentRef.apellidos.value,
          studentRef.dni.value,
          studentRef.direccion.value,
          studentRef.telefono.value,
          studentRef.email.value,
          // studentRef.foto.value = foto.value,
        ]
        console.table(datosAlumno)
        borrarDatosForm()
        formSubmitted.value = false;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
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
    <form id="altaAlumno" @submit.prevent="crearAlumno()">
      <h2>Nuevo Alumno</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Nombre</label>
          <InputText class="" id="nombreInput" v-model="studentRef.nombre.value" />
          <InlineMessage v-if="!studentRef.nombre.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El nombre es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Apellidos</label>
          <InputText class="" id="apellidosInput" v-model="studentRef.apellidos.value" />
          <InlineMessage v-if="!studentRef.apellidos.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El apellido es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Dni</label>
          <InputText class="" id="dniInput" v-model="studentRef.dni.value" />
          <InlineMessage v-if="!studentRef.dni.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El DNI es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Teléfono</label>
          <!-- <InputNumber class="" id="telefonoInput" :useGrouping="false" required v-model="studentRef.telefono.value" /> -->
          <InputMask class="" id="telefonoInput" mask="999999999" slotChar="" v-model="studentRef.telefono.value" />
          <InlineMessage v-if="!studentRef.telefono.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El teléfono es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Email</label>
          <InputText class="" id="emailInput" v-model="studentRef.email.value" />
          <InlineMessage v-if="!studentRef.email.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El email es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-12 md:col-12 sm:col-12">
          <label class="">Dirección</label>
          <InputText class="" id="direcciónInput" v-model="studentRef.direccion.value" />
          <InlineMessage v-if="!studentRef.direccion.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La dirección es obligatoria</InlineMessage>
        </div>
        <!-- <div class="field col-12 lg:col-3 md:col-12 sm:col-12">
          <label class="">Código Postal</label>
          <InputMask class="" id="CPInput" mask="99999" slotChar="" v-model="studentRef.codigoPostal.value" />
          <InlineMessage v-if="!studentRef.codigoPostal.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El CP es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-5 md:col-12 sm:col-12">
          <label class="">Ciudad</label>
          <InputText class="" id="ciudadInput" v-model="studentRef.ciudad.value" />
          <InlineMessage v-if="!studentRef.ciudad.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La ciudad es obligatoria</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12">
          <label class="">Provincia</label>
          <Dropdown class="" :options="provincias" optionLabel="label" optionValue="label" checkmark :highlightOnSelect="false" showClear id="provinciaInput" placeholder="Selecciona una provincia"
            v-model="studentRef.provincia.value" />
          <InlineMessage v-if="!studentRef.provincia.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La provincia es obligatoria</InlineMessage>
        </div> -->
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12 ">
          <label class="w-auto">Seleccionar usuario</label>
          <Dropdown class="w-auto" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput"
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
  }"></Toast>
</template>

<style scoped></style>
