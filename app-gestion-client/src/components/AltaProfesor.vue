<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import InlineMessage from 'primevue/inlinemessage';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';

const toast = useToast();

// Referencias del formulario
const teacherRef = {
  nombre: ref<string | undefined>(undefined),
  apellidos: ref<string | undefined>(undefined),
  email: ref<string | undefined>(undefined),
  asignaturas: ref<string[]>([])
}
const formSubmitted = ref(false); // variable para avisos con InlineText

// para resetear los datos del formulario y poner cada ref a vacío
const borrarDatosForm = () => {
  teacherRef.nombre.value = undefined
  teacherRef.apellidos.value = undefined
  teacherRef.email.value = undefined
  teacherRef.asignaturas.value = []
  selectedUserId.value = undefined
  formSubmitted.value = false;
}

// OBTENER ASIGNATURAS DE LA BD
let asignaturas: Ref<
  {
    id: number
    nombre: string
  }[]
> = ref([])

const getSubjectsData = async () => {
  try {
    const response = await fetch('http://localhost:3000/asignaturas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = (await response.json()) as {
        id: number
        nombre: string
      }[]
      asignaturas.value = data
      console.log(data)
    }
  } catch (error) {
    alert('Hay un error' + error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo las asignaturas', life: 3000 });
  }
}
getSubjectsData()

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
  if (selectedUserId.value) {
    getUser()
  }
})

// VALIDAR DATOS DEL FORMULARIO
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// FETCH PARA ENVIAR DATOS DEL PROFESOR A LA BD:
const crearProfesor = async () => {
  formSubmitted.value = true;
  let isValid = true
  if (teacherRef.email.value && !patronEmail.test(teacherRef.email.value)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (!teacherRef.nombre.value || !teacherRef.apellidos.value || !teacherRef.email.value || teacherRef.asignaturas.value.length == 0) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (isValid) {
    try {
      const response = await fetch('http://localhost:3000/teacher', {
        method: 'POST',
        body: JSON.stringify({
          nombre: teacherRef.nombre.value,
          apellidos: teacherRef.apellidos.value,
          email: teacherRef.email.value,
          asignaturas: teacherRef.asignaturas.value.toString(),
          userId: user.value?.id
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Creado', detail: 'Profesor creado', life: 3000 });

        const datosProfesor = [
          teacherRef.nombre.value,
          teacherRef.apellidos.value,
          teacherRef.email.value,
          teacherRef.asignaturas.value
        ]
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

</script>

<template>
  <div class="card col-12 xl:col-6 lg:col-12 md:col-12 sm:col-12">
    <form @submit.prevent="crearProfesor()">
      <h2>Nuevo Profesor</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12">
          <label class="">Nombre</label>
          <InputText class="" id="nombreInput" v-model="teacherRef.nombre.value" />
          <InlineMessage v-if="!teacherRef.nombre.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El nombre es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12">
          <label class="">Apellidos</label>
          <InputText class="" id="apellidosInput" v-model="teacherRef.apellidos.value" />
          <InlineMessage v-if="!teacherRef.apellidos.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El apellido es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12">
          <label class="">Email</label>
          <InputText class="" id="emailInput" v-model="teacherRef.email.value" />
          <InlineMessage v-if="!teacherRef.email.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El email es obligatorio</InlineMessage>
        </div>
        <div class="field col-12">
          <label class="">Seleccionar asignaturas</label>

          <MultiSelect id="asignaturas" class="w-max" :style="{ 'max-width': '100%' }" :options="asignaturas" display="chip" filter optionLabel="nombre" placeholder="Seleccionar asignaturas"
            v-model="teacherRef.asignaturas.value">
          </MultiSelect>
          <InlineMessage v-if="teacherRef.asignaturas.value.length == 0 && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">Las asignaturas son obligatorias</InlineMessage>
        </div>
        <div class="field col-12 mt-2 pl-0 mb-0 ">
          <div class="field col-12 lg:col-4 md:col-12 sm:col-12 ">
            <label class="">Seleccionar usuario</label>
            <Dropdown class="" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput"
              placeholder="Selecciona un usuario" v-model="selectedUserId" />
            <InlineMessage v-if="!user && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El usuario es obligatorio</InlineMessage>
          </div>
          <div v-if="selectedUserId" class="ml-1">
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
        </div>
        <div class="field col-12">
          <Button class="justify-content-center w-auto h-auto" icon="pi pi-send" iconPos="left" type="submit" label="Enviar"></Button>
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