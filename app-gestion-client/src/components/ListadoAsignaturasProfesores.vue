<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from 'primevue/api';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';

const confirm = useConfirm();
const toast = useToast();

const router = useRouter() // router para ir al alumno cuando se clique en él

// OBTENER DATOS DE TODOS LOS PROFESORES
let teachersRefFromServer: Ref<
  {
    id: number
    nombre: string
    apellidos: string
    email: string
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
      const data = (await response.json()) as {
        id: number
        usuario_id: string
        nombre: string
        apellidos: string
        email: string
      }[]
      teachersRefFromServer.value = data
      console.log(data)
      console.log(teachersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

// OBTENER DATOS DE TODAS LAS ASIGNACIONES
let subjectsTeachersRefFromServer: Ref<
  {
    id: number
    teacher: {
      id: number
      nombre: string
      apellidos: string
      email: string
    }
    subject: {
      id: number
      nombre: string
    }
  }[]
> = ref([])

const getSubjectsTeachersData = async () => {
  try {
    const response = await fetch('http://localhost:3000/asignaturas_profesores', {
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
      subjectsTeachersRefFromServer.value = data
      console.log(data)
      console.table(subjectsTeachersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

// OBTENER ASIGNATURAS POR TEACHER ID
const subjectsByTeacherIdRef: Ref<{
  teacher: {
    id: number
    nombre: string
    apellidos: string
    email: string
  }
  asignaciones: {
    id: number
    subject: {
      id: number
      nombre: string
    }
  }[]
} | null> = ref(null)

const getSubjectsByTeacherIdData = async (teacher: typeof teachersRefFromServer.value[0]) => {
  // console.log(teacher)
  try {
    const response = await fetch(`http://localhost:3000/asignaturas_profesores/teacher/${teacher.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (response.status === 404) {
      console.warn(`El profesor con id ${teacher.id} no tiene asignaciones`);
      return null;
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }
    else {
      const data = await response.json()
      console.log(data);
      // Verificar si el array de asignaciones está vacío
      if (data && data.asignaciones && data.asignaciones.length > 0) {
        subjectsByTeacherIdRef.value = data;
        // console.table(subjectsByTeacherIdRef.value)
        return data;
      }
    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)

    if (error.message.includes('404')) {
      return null;
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al obtener los datos de este profesor', life: 3000 });
    }
  }
}

// OBTENER TODOS LOS PROFESORES CON SUS RESPECTIVAS ASIGNACIONES
const teachersWithSubjectsRef: Ref<{
  teacher: {
    id: number
    nombre: string
    apellidos: string
    email: string
  }
  asignaciones: {
    id: number
    subject: {
      id: number
      nombre: string
    }
  }[]
}[]> = ref([])

const getAllTeachersWithSubjects = async () => {
  teachersWithSubjectsRef.value = [] // reinicio la variable para permitir que se me actualice la vista en la tabla
  try {
    for (const teacher of teachersRefFromServer.value) {
      const data = await getSubjectsByTeacherIdData(teacher)
      if (data != undefined)
        teachersWithSubjectsRef.value.push(data)
    }
  } catch (error) {
    console.error('Error en la obtención de asignaturas:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
  console.table(teachersWithSubjectsRef.value)
}

const fetchData = async () => {
  try {
    await getTeachersData(); // Espera a que se complete la obtención de profesores
    await getSubjectsTeachersData(); // Espera a que se complete la obtención de todo el listado asignaturas
    getAllTeachersWithSubjects();
  } catch (error) {
    console.error('Error al obtener datos:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo los datos', life: 3000 });
  }
};


// //FILTRAR DATOS OBTENIDOS POR EL ID DEL PROFESOR PARA LA TABLA
// const filterSubjectsByTeacherId = (teacher: typeof teachersRefFromServer.value[0]) => {
//   return subjectsTeachersRefFromServer.value.filter(subject => subject.teacher.id === teacher.id);
// };

// LÓGICA BORRAR ASIGNACIÓN
const confirmDelete = (asignacion: typeof subjectsTeachersRefFromServer.value[0]) => { // al ser un array, le indico el valor de la casilla 0
  confirm.require({
    message: '¿Seguro que quiere borrar esta asignación?',
    header: 'Borrar Asignación',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarSubjectTeacher(asignacion)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};


const borrarSubjectTeacher = async (asignacion: typeof subjectsTeachersRefFromServer.value[0]) => {
  console.table(asignacion)
  // const idAsignacion = asignacion.id
  try {
    const response = await fetch(
      `http://localhost:3000/asignatura_profesor/${asignacion.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.ok) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Asignación borrada', life: 3000 });
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  } finally {
    fetchData()
  }
}


// LÓGICA EDITAR MATRICULA
const visibleDialog: Ref<boolean> = ref(false);

// const editingStore = useEditingStore() // store del componente editar Alumno

// let popUpState: Ref<boolean> = ref(editingStore.editarFalse()) // variable del estado del popUp
// console.log(popUpState.value)

// let subjectTeacherEditar: Ref<
//   | {
//     id: number
//     subject: {
//       id: number
//       nombre: string
//     }
//     teacher: {
//       id: number
//       nombre: string
//       apellidos: string
//     }
//   }
//   | undefined
// > = ref(undefined)

// const editarSubjectTeacher = (subjectTeacher: any) => {
//   // popUpState.value = true
//   editingStore.editarTrue()
//   subjectTeacherEditar.value = subjectTeacher
//   // fetch para obtener los datos del alumno
//   fetch(`http://localhost:3000/asignatura_profesor/${subjectTeacherEditar.value?.id}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     credentials: 'include'
//   }).then(async (response) => {
//     const data = (await response.json()) as {
//       id: number
//       subject: {
//         id: number
//         nombre: string
//       }
//       teacher: {
//         id: number
//         nombre: string
//         apellidos: string
//       }
//     }
//     subjectTeacherEditar.value = data
//     console.table(data)
//   })
//   getSubjectsTeachersData()
// }

// const mostrarSubjectTeacher = () => {
//   // popUpState.value = true
//   popUpState.value = editingStore.editarTrue()
//   console.log(popUpState.value)
// }

// const resetearPopUpState = () => {
//   // popUpState.value = false
//   popUpState.value = editingStore.editarFalse()
//   console.log(popUpState.value)
// }


// Ir a la página idividual del profesor
const goToTeacher = (id: number) => {
  router.push({
    path: `/profesor/${id}`
  })
}

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

// Expandir la tabla
const expandedRows = ref<{ [key: number]: boolean }>({});

const expandAll = () => {
  expandedRows.value = teachersWithSubjectsRef.value.reduce<{ [key: number]: boolean }>((acc, p) => {
    acc[p.teacher.id] = true;
    return acc;
  }, {});
};

const collapseAll = () => {
  expandedRows.value = [];
};

onMounted(() => {
  fetchData();
})

</script>

<template>
  <div class="flex justify-content-start pt-2">
    <div class="card flex justify-content-center">
      <DataTable v-model:expandedRows="expandedRows" v-model:filters="filters" class="" stripedRows :value="teachersWithSubjectsRef" dataKey="teacher.id" sortField="teacher.id" :sortOrder="1"
        :paginator="true" :rows="10" tableStyle="width: 60rem" :pt="{
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
        <template #header>
          <div class="flex flex-wrap justify-content-end h-1rem align-content-center">
            <Button class="w-auto" severity="secondary" text icon="pi pi-plus" label="Expand All" @click="expandAll"></Button>
            <Button class="w-auto" severity="secondary" text icon="pi pi-minus" label="Collapse All" @click="collapseAll"></Button>
          </div>
        </template>

        <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Listado Asignaciones</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button rounded icon="pi pi-filter-slash" label="" outlined @click="clearFilter()"></Button>
          </span>
        </div>
        <Column expander style="width: 1rem"></Column>
        <Column field="teacher.nombre" header="Nombre" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1"></Column>
        <Column field="teacher.apellidos" header="Apellidos" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1"></Column>
        <Column field="teacher.email" header="Email" headerStyle="width:40%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1"></Column>
        <Column headerStyle="width:5%; min-width:8rem">

          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" @click="goToTeacher(slotProps.data.teacher.id)"></Button>
          </template>
        </Column>

        <template #expansion="slotProps">
          <DataTable :value="slotProps.data.asignaciones" selection-mode="single" tableStyle="width: 10rem" :pt="{
        table: {
          class: 'mt-0 ml-7',
          style: {
            'border': 'none', 'background-color': 'transparent'
          }
        }
      }
        ">
            <Column field="subject.nombre" header="Asignatura" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1"> </Column>
            <Column headerStyle="" bodyClass="flex p-1 pl-1">
              <template #body="slotProps">
                <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)"></Button>
              </template>
            </Column>
          </DataTable>
        </template>
      </DataTable>
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

  <Dialog v-model:visible="visibleDialog" modal header="Editar Alumno" class="w-4" :pt="{
        header: { class: 'flex align-items-baseline h-5rem' },
        title: { class: '' },
        closeButtonIcon: { class: '' }
      }
        "></Dialog>
</template>

<style scoped></style>
