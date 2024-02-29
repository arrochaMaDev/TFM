<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';

const toast = useToast();


//Referencias del formulario
const asignaturaRef: Ref<string | undefined> = ref(undefined)
const formSubmitted = ref(false); // variable para avisos con InlineText

// OBTENER LA LISTA DE ASIGNATURAS DEL SERVIDOR:
let asignaturasRefFromServer: Ref<
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
getAsignaturasData()

// FETCH PARA ENVIAR DATOS DE LA ASIGNATURA A LA BD:
const buscarAsignatura = (): boolean => {
  for (const asignatura of asignaturasRefFromServer.value) {
    if (asignatura.nombre.toLowerCase() === asignaturaRef.value?.toLowerCase()) {
      return true // Si se encuentra la asignatura, devuelve true
    }
  }
  return false // Si no se encuentra la asignatura, devuelve false
}

const crearAsignatura = async () => {
  formSubmitted.value = true;
  let isValid = true
  let repetido: boolean = buscarAsignatura()

  if (repetido) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'La asignatura ya está en la base de datos', life: 3000 });
    isValid = false
  }
  if (!asignaturaRef.value || asignaturaRef.value === '') {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }

  if (!repetido && isValid) {
    try {
      const response = await fetch('http://localhost:3000/asignaturas', {
        method: 'POST',
        body: JSON.stringify({
          nombre: asignaturaRef.value
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Creado', detail: 'Asignatura creada', life: 3000 });

        const asignatura = asignaturaRef.value
        console.log(asignatura)
        borrarDatosForm()
        formSubmitted.value = false;
        getAsignaturasData()
      }
    }
    catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    }
  }
}

// para resetear los datos del formulario y poner cada ref a vacío
function borrarDatosForm() {
  formSubmitted.value = false;
  asignaturaRef.value = ''
}


</script>

<template>
  <div class="card col-12 xl:col-6 lg:col-12 md:col-12 sm:col-12">
    <form @submit.prevent="crearAsignatura()">
      <h2>Nueva Asignatura</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-9 md:col-9 sm:col-9">
          <label class="">Nombre</label>
          <InputText class="" id="nombreInput" v-model="asignaturaRef" />
          <InlineMessage v-if="!asignaturaRef && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La asignatura es obligatoria</InlineMessage>
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
