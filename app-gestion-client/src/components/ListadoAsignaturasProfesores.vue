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
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';

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
      // console.log(data)
      console.log(teachersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

// OBTENER DATOS DE TODAS LAS ASIGNACIONES
const subjectsTeachersRefFromServer: Ref<
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
      // console.log(data)
      console.log(subjectsTeachersRefFromServer.value)
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

const getSubjectsByTeacherId = async (teacher: typeof teachersRefFromServer.value[0]) => {
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

      if (visibleDialog.value) {
        teacherWithSubjectsEditar.value = data
      }
      // Verificar si el array de asignaciones está vacío
      if (data && data.asignaciones && data.asignaciones.length > 0 && !visibleDialog.value) {
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
      const data = await getSubjectsByTeacherId(teacher)
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

onMounted(() => {
  fetchData();
})

// LÓGICA BORRAR ASIGNACIÓN
const confirmDelete = (asignacion: typeof subjectsTeachersRefFromServer.value[0]) => { // al ser un array, le indico el valor de la casilla 0
  console.log(asignacion)
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

const selectedSubject: Ref<
  {
    id: number
    nombre: string
  } | undefined
> = ref(undefined)

const asignacionEditar: Ref<
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
  } | undefined
> = ref(undefined)

const asignacionOnlySubject: Ref<
  {
    id: number
    subject: {
      id: number
      nombre: string
    }
  }
> = ref({
  id: 0,
  subject: {
    id: 0,
    nombre: '',
  },
})

const teacherWithSubjectsEditar: Ref<typeof teachersWithSubjectsRef.value[0] | undefined> = ref(undefined)

// Obtener datos de todas las asignaturas
const subjectsRefFromServer: Ref<
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
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = (await response.json()) as {
        id: number
        nombre: string
      }[]
      subjectsRefFromServer.value = data
      console.log(data)
      console.log(subjectsRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

// Obtener datos totales de la asignacion para rescatar los datos del profesor y ver los datos de la asignacion a editar
const getAsignacionData = async (asignacionId: number) => {
  console.log(asignacionId)
  try {
    const response = await fetch(`http://localhost:3000/asignatura_profesor/${asignacionId}`, {
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
      asignacionEditar.value = data
      console.table(asignacionEditar.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}
// mostrar el dialog de editar
const mostrarDialog = (asignacion: typeof asignacionOnlySubject.value) => {
  visibleDialog.value = true
  getSubjectsData()
  getAsignacionData(asignacion.id)
}

// logica de editar y verificar
const editarSubjectTeacher = async () => {
  let isValid = true;
  try {
    if (!selectedSubject.value) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
      isValid = false;
    }

    if (isValid && asignacionEditar.value && selectedSubject.value) {
      await getSubjectsByTeacherId(asignacionEditar.value.teacher);
    }

    if (isValid && asignacionEditar.value && selectedSubject.value && !existenDuplicados()) {
      fetchEditarSubjectTeacher(asignacionEditar.value.id, selectedSubject.value)
    }
  } catch (error) {
    console.error('Error en la función editarSubjectTeacher:', error);
  }
}
const fetchEditarSubjectTeacher = async (asignacionId: number, subjectSelected: typeof selectedSubject.value) => {
  try {
    const response = await fetch(`http://localhost:3000/asignatura_profesor/${asignacionId}`, {
      method: 'PUT',
      body: JSON.stringify({
        newSubject: {
          id: subjectSelected?.id
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      toast.add({ severity: 'success', summary: 'Editado', detail: 'Asignación editada', life: 3000 });
      const asignacionActualizada = {
        id: asignacionEditar.value?.id,
        teacher: {
          id: asignacionEditar.value?.teacher.id,
          nombre: asignacionEditar.value?.teacher.nombre,
          apellidos: asignacionEditar.value?.teacher.apellidos,
          email: asignacionEditar.value?.teacher.email,
        },
        subject: {
          id: subjectSelected?.id,
          nombre: subjectSelected?.nombre
        }
      };
      console.table(asignacionActualizada)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  } finally {
    visibleDialog.value = false
    getAllTeachersWithSubjects()
  }
}


// Chequear si hay duplicados entre las asignaturas del array y las que estén en la BD
// modificacion de eliminarDuplicados del alta asignaciones pero retornando true o false
const existenDuplicados = () => {
  if (teacherWithSubjectsEditar.value && selectedSubject) {
    // recorro el array y extraigo todos los Ids de las asignaturas que haya
    const subjectsIdsOfTeacher = teacherWithSubjectsEditar.value.asignaciones.map(subjectTeacher => subjectTeacher.subject.id);
    const selectedSubjectId = selectedSubject.value?.id
    const duplicados = subjectsIdsOfTeacher.filter(subjectId => subjectId === selectedSubjectId); // filtro si esa asignacion ya se encuentra en las asignaciones del profesor

    if (duplicados.length > 0) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'La asignatura seleccionada ya se encuentra asignada al profesor', life: 3000 });
      return true
    }
    if (duplicados.length == 0) {
      return false
    }
  }
};


// Ir a la página idividual del profesor
const goToTeacher = (id: number) => {
  router.push({
    path: `/profesor/${id}`
  })
}

// Filtrar datos
const filters = ref() // variable filtro
const filters1 = ref() // variable filtro


const initFilters = () => { // componente filtro en global para que busque cualquier valor
  filters.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
  filters1.value = {
    'subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
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

</script>

<template>
  <div class="flex justify-content-start pt-2">
    <div class="card flex justify-content-center">
      <DataTable v-model:expandedRows="expandedRows" v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['teacher.nombre', 'teacher.apellidos', 'teacher.email', 'subject.nombre']"
        class="" removableSort removableSortstripedRows :value="teachersWithSubjectsRef" dataKey="teacher.id" sortField="teacher.id" :sortOrder="1" :paginator="true" :rows="10"
        tableStyle="width: fit-content" :pt="{
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
            <Button class="w-auto" severity="secondary" text icon="pi pi-plus" label="Expandir" v-tooltip.top="'Expandir todo'" @click="expandAll"></Button>
            <Button class="w-auto" severity="secondary" text icon="pi pi-minus" label="Colapsar" v-tooltip.top="'Colapsar todo'" @click="collapseAll"></Button>
          </div>
        </template>

        <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Listado Asignaciones</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button rounded icon="pi pi-filter-slash" label="" outlined v-tooltip.top="'Limpiar filtros'" @click=" clearFilter()"></Button>
          </span>
        </div>
        <Column expander style="width: 1rem"></Column>
        <Column field="teacher.nombre" header="Nombre" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="teacher.apellidos" header="Apellidos" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="teacher.email" header="Email" headerStyle="width:40%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false"> <template
            #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column headerStyle="width:5%; min-width:8rem">
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Profesor'" @click="goToTeacher(slotProps.data.teacher.id)"></Button>
          </template>
        </Column>

        <!-- Tabla asignaturas asignadas -->
        <template #expansion="slotProps">
          <DataTable :value="slotProps.data.asignaciones" v-model:filters="filters1" filterDisplay="menu" :globalFilterFields="['subject.nombre']" class="" removableSort selection-mode="single"
            tableStyle="width: 10rem" :pt="{
        table: {
          class: 'mt-0 ml-7',
          style: {
            'border': 'none', 'background-color': 'transparent'
          }
        }
      }
        ">
            <Column field="subject.nombre" header="Asignaturas" sortable headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column header="" headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="flex p-1 pl-1">
              <template #body="slotProps">
                <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Asignación'" @click="confirmDelete(slotProps.data)"></Button>
                <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Asignación'" @click="mostrarDialog(slotProps.data)"></Button>
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

  <!-- Dialog editar asignación -->
  <Dialog v-model:visible="visibleDialog" modal header="Editar Asignación" class="w-3" :pt="{
        header: { class: 'flex align-items-baseline h-5rem' },
        title: { class: '' },
        closeButtonIcon: { class: '' }
      }
        ">
    <span class="p-text-secondary flex mb-5">Cambiar asignatura</span>

    <label class="text-xl text-800 font-bold">Datos del profesor</label>
    <DataTable :value="[asignacionEditar?.teacher]" class="pt-1" tableStyle="width: 30rem" :pt="{
        table: {
          class: 'mt-0',
          style: { 'border': 'none' }
        }
      }
        ">
      <Column field="nombre" header="Nombre" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
      <Column field="apellidos" header="Apellidos" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
      <Column field="email" header="Email" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
    </DataTable>

    <div class="flex flex-column col-12 lg:col-12 md:col-12 sm:col-12 pt-4">
      <label class="text-xl text-800 font-bold">Asignatura a editar</label>
      <Tag class="ml-1 mt-1 w-max" :value="asignacionEditar?.subject.nombre" severity="secondary" />
    </div>

    <div class="flex flex-column col-12 lg:col-12 md:col-12 sm:col-12">
      <label class="text-xl text-800 font-bold pl-1">Selecciona nueva Asignatura</label>
      <Dropdown class="w-max mt-2" :options="subjectsRefFromServer" optionLabel="nombre" display="chip" filter placeholder="Selecciona..." v-model="selectedSubject">
      </Dropdown>
    </div>
    <div class="flex justify-content-center mb-3 pt-2">
      <Button type="button" rounded label="Cancelar" severity="secondary" @click="getAllTeachersWithSubjects(), visibleDialog = false"></Button>
      <Button type="button" rounded label="Actualizar" @click="editarSubjectTeacher()"></Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
