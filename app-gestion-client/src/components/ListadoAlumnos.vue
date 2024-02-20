<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Popup from './Popup.vue'
import AltaAlumno from './AltaAlumno.vue'
import { useLoadingStore } from '@/stores/loading'
import { useEditingStore } from '@/stores/editar'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { FilterMatchMode } from 'primevue/api';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';



const confirm = useConfirm();
const toast = useToast();

const router = useRouter() // router para ir al alumno cuando se clique en él
const loadingStore = useLoadingStore() // store del Spinner

// OBTENER DATOS DE TODOS LOS ESTUDIANTES
let studentsRefFromServer: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
    email: string
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
      loadingStore.loadingTrue()
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      const data = (await response.json()) as {
        id: number
        usuario_id: string
        nombre: string
        apellidos: string
        dni: string
        direccion: string
        telefono: number
        email: string
      }[]
      studentsRefFromServer.value = data
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

// ORDENAR RESULTADOS POR VALOR QUE SE INDIQUE
// let arrayOrdenado: Ref<
//   {
//     id: number
//     usuario_id: string
//     nombre: string
//     apellidos: string
//     dni: string
//     direccion: string
//     telefono: string
//     email: string
//   }[]
// > = ref([]) // Nuevo array Ref para ordenar la lsta según se indique

let ordenarPor: Ref<'id' | 'nombre' | 'apellidos' | 'dni' | 'email'> = ref('id')

const ordenarArray = () => {
  // arrayOrdenado.value = [...studentsRefFromServer.value]
  const valor = ordenarPor.value

  studentsRefFromServer.value.sort((a, b) => {
    if (valor === 'id') {
      return a[valor] - b[valor]
    } else {
      const valorA = a[valor].toLowerCase()
      const valorB = b[valor].toLowerCase()
      if (valorA < valorB) {
        return -1
      }
      if (valorA > valorB) {
        return 1
      }
      return 0
    }
  })
}

onMounted(() => {
  ordenarArray()
  getStudentsData()
})

// LÓGICA BORRAR ALUMNO
// let popupVisible: Ref<boolean> = ref(false) // ref para ocultar o mostrar el popup
// let idAlumnoSeleccionado: Ref<number | null> = ref(null) // ref del id del alumno seleccionado para borrar

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
  const idAlumno = alumno.id
  try {
    const response = await fetch(`http://localhost:3000/student/${idAlumno}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Alumno borrado', life: 3000 });
      // popupVisible.value = false
      getStudentsData()
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
  // finally {
  //   loadingStore.loadingFalse()
  // }
}

// LÓGICA EDITAR ALUMNO
const editingStore = useEditingStore() // store del componente editar Alumno

const visibleDialog: Ref<boolean> = ref(false);


// let popUpState: Ref<boolean> = ref(editingStore.editarFalse()) // variable del estado del popUp
// console.log(popUpState.value)

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
  }> = ref({
    id: 0,
    usuario_id: '',
    nombre: '',
    apellidos: '',
    dni: '',
    direccion: '',
    telefono: 0,
    email: ''
  }); // lo inicializo para evitar problemas con null o undefined en v-model

const mostrarDialog = (student: typeof studentsRefFromServer.value[0]) => {
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
  if (!alumnoEditar.value.nombre || !alumnoEditar.value.apellidos || !alumnoEditar.value.dni || !alumnoEditar.value.direccion || !alumnoEditar.value.telefono || !alumnoEditar.value.email) {
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
          email: alumnoEditar.value?.email
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
        const alumnoActualizado = [
          alumnoEditar.value?.nombre,
          alumnoEditar.value?.apellidos,
          alumnoEditar.value?.dni,
          alumnoEditar.value?.direccion,
          alumnoEditar.value?.telefono,
          alumnoEditar.value?.email
        ]
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

// const editarAlumno = () => {
//   // popUpState.value = true
//   // editingStore.editarTrue()
//   // alumnoEditar.value = student
//   // fetch para obtener los datos del alumno
//   fetch(`http://localhost:3000/student/${alumnoEditar.value?.id}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     credentials: 'include'
//   }).then(async (response) => {
//     const data = (await response.json()) as {
//       id: number
//       usuario_id: string
//       nombre: string
//       apellidos: string
//       dni: string
//       direccion: string
//       telefono: number
//       email: string
//     }
//     alumnoEditar.value = data
//     console.table(data)
//   })
// }

// const mostrarAltaAlumno = () => {
//   // popUpState.value = true
//   popUpState.value = editingStore.editarTrue()
//   console.log(popUpState.value)
// }

// const resetearPopUpState = () => {
//   // popUpState.value = false
//   popUpState.value = editingStore.editarFalse()
//   console.log(popUpState.value)
// }

// Ir a la página idividual del alumno
const goToStudent = (id: number) => {
  router.push({
    path: `/alumno/${id}`
  })
}

// DATOS TABLA
const columns = [
  { field: 'id', header: 'id' },
  { field: 'nombre', header: 'Nombre' },
  { field: 'apellidos', header: 'Apellidos' },
  { field: 'dni', header: 'DNI' },
  { field: 'direccion', header: 'Dirección' },
  { field: 'telefono', header: 'Teléfono' },
  { field: 'email', header: 'Email' }
];

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

</script>
<template>
  <div class="col-12">
    <div class="card w-max">
      <DataTable v-model:filters="filters" class="" :value="studentsRefFromServer" dataKey="id" stripedRows sortField="nombre" :sortOrder="1" :paginator="true" :rows="10" tableStyle="width: 80rem" :pt="{
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
        },
        column: {
          class: 'bg-red-100'
        }
      }">

        <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Listado Alumnos</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button rounded icon="pi pi-filter-slash" label="" outlined @click="clearFilter()"></Button>
          </span>
        </div>

        <Column field="nombre" header="Nombre" sortable headerStyle="width:5%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="pl-1"> </Column>
        <Column field="apellidos" header="Apellidos" sortable headerStyle="width:5%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="pl-1"></Column>
        <Column field="dni" header="DNI" headerStyle="width:5%; min-width:8rem; height:1rem" headerClass="h-2rem pl-1" bodyClass="pl-1"></Column>
        <Column class="" field="direccion" header="Dirección" headerStyle="width:70%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="pl-1"></Column>
        <Column field="telefono" header="Teléfono" headerStyle="width:5%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="pl-1"></Column>
        <Column field="email" header="Email" headerStyle="width:5%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="pl-1"></Column>
        <!-- <Column v-for="col of columns" :key="col.field" class="" :field="col.field" :header="col.header" :pt="{
          root: { class: '' },
          headerContent: { class: 'text-center m-2 p-2 h-2rem text-xl font-semibold' }
        }">
        </Column> -->
        <!-- :pt="{ headerContent: { style: { 'background-color': 'red' } } }" -->
        <Column headerStyle="width:5%; min-width:8rem" bodyClass="flex p-0">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded severity="success" @click="mostrarDialog(slotProps.data)"></Button>
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDelete(slotProps.data)"></Button>
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

      <Dialog v-model:visible="visibleDialog" modal header="Editar Alumno" class="w-4" :pt="{
        header: { class: 'flex align-items-baseline h-5rem' },
        title: { class: '' },
        closeButtonIcon: { class: '' }
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
        <div class="flex justify-content-center mb-3 pt-2">
          <Button type="button" rounded label="Cancelar" severity="secondary" @click="visibleDialog = false"></Button>
          <Button type="button" rounded label="Actualizar" @click="editarAlumno()"></Button>
        </div>
        <Toast></Toast>
      </Dialog>

    </div>
  </div>
</template>

<style scoped>
/* #ordenarPor {
  margin: 0px;
}

table {
  margin-top: 0px;
  width: max-content;
  border: none;

  & th {
    background-color: rgb(79, 90, 86);
  }

  & td {
    width: fit-content;
    text-align: left;
    vertical-align: top;
    border: none;
    border-spacing: 0;
  }
}

table tr:hover td {
  transition: background-color 0.5s;
  background-color: rgb(106, 98, 53);
}

table tr:hover td:nth-last-child(-n + 3) {
  background-color: initial;
}

button {
  width: 50px;
  height: 25px;
  background-color: hsla(160, 100%, 37%, 1);
  color: white;
  border: 1px solid hsla(160, 100%, 37%, 1);
  border-radius: 5px;
  margin: 1px;
  cursor: pointer;
} */
</style>
