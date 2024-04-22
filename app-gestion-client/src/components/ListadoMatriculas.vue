<script setup lang="ts">
import { type Ref, ref, onMounted, inject } from 'vue'
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
import { useAdminStore } from '@/stores/isAdmin';
import type { VueCookies } from 'vue-cookies';

const confirm = useConfirm();
const toast = useToast();

const router = useRouter() // router para ir al alumno cuando se clique en él

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

// OBTENER DATOS DE TODAS LAS MATRICULAS
const matriculasRefFromServer: Ref<
  {
    id: number
    student: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
    year: number
  }[]
> = ref([])

const getMatriculasData = async () => {
  try {
    const response = await fetch('http://localhost:3000/matriculas', {
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
      matriculasRefFromServer.value = data
      // console.log(data)
      console.table(matriculasRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

// OBTENER DATOS DE TODOS LOS ESTUDIANTES
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
      const data = await response.json()

      studentsRefFromServer.value = data
      // console.log(data)
      console.log(studentsRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

// OBTENER MATRÍCULAS POR ESTUDIANTE
const matriculasByStudentId: Ref<{
  student: {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
    email: string
  },
  matriculas: {
    id: number,
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
    year: number
  }[]
} | undefined> = ref(undefined)

const getMatriculasByStudentId = async (studentId: number) => {
  // console.log(teacher)
  try {
    const response = await fetch(`http://localhost:3000/matriculas/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (response.status === 404) {
      console.warn(`El estudiante con id ${studentId} no tiene matrículas`);
      return null;
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }
    else {
      const data = await response.json()
      console.log(data);

      // para cuando estemos editando la matricula
      if (visibleDialog.value) {
        studentWithMatriculasEditar.value = data
      }

      // Verificar si el array de asignaciones está vacío
      if (data && data.matriculas && data.matriculas.length > 0 && !visibleDialog.value) {
        matriculasByStudentId.value = data;
        console.table(matriculasByStudentId.value)
        return data;
      }

    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)

    if (error.message.includes('404')) {
      return null;
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al obtener los datos de este estudiante', life: 3000 });
    }
  }
}

// OBTENER TODOS LOS ESTUDIANTES CON SUS RESPECTIVAS MATRICULAS
const allStudentsWithMatriculasRef: Ref<{
  student: {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
    email: string
  },
  matriculas: {
    id: number,
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
    year: number
  }[]
}[]> = ref([])

const getAllStudentsWithMatriculas = async () => {
  allStudentsWithMatriculasRef.value = [] // reinicio la variable para permitir que se me actualice la vista en la tabla
  try {
    for (const student of studentsRefFromServer.value) {
      const data = await getMatriculasByStudentId(student.id)
      if (data != undefined)
        allStudentsWithMatriculasRef.value.push(data)
    }
  } catch (error) {
    console.error('Error en la obtención de matriculas:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
  console.table(allStudentsWithMatriculasRef.value)
}

const fetchData = async () => {
  try {
    await getStudentsData(); // Espera a que se complete la obtención de estudiantes
    getAllStudentsWithMatriculas();
  } catch (error) {
    console.error('Error al obtener datos:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo los datos', life: 3000 });
  }
};

onMounted(() => {
  fetchData();
  getMatriculasData() // obtener datos de todas las matriculas
})


// LÓGICA BORRAR MATRICULA
const confirmDelete = (matricula: typeof matriculasRefFromServer.value[0]) => { // al ser un array, le indico el valor de la casilla 0
  console.log(matricula)
  confirm.require({
    message: '¿Seguro que quiere borrar esta matrícula?',
    header: 'Borrar Matrícula',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarMatricula(matricula)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};


const borrarMatricula = async (matricula: typeof matriculasRefFromServer.value[0]) => {
  console.table(matricula)
  try {
    const response = await fetch(
      `http://localhost:3000/matricula/${matricula.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.ok) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Matrícula borrada', life: 3000 });
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

const matriculaEditar: Ref<
  {
    id: number
    student: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      usuario_id: string
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
    year: number
  } | undefined
> = ref(undefined)

const selectedSubject: Ref<
  {
    id: number
    nombre: string
  } | undefined
> = ref(undefined)

const selectedTeacher: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
    email: string
  } | undefined
> = ref(undefined)

const studentWithMatriculasEditar: Ref<typeof allStudentsWithMatriculasRef.value[0] | undefined> = ref(undefined)


// mostrar el dialog de editar
const mostrarDialog = async (matricula: typeof matriculaEditar.value) => {
  visibleDialog.value = true
  getSubjectsData()
  getTeachersData()
  if (matricula) {
    await getMatriculaData(matricula.id)
  }
}



// Obtener datos totales de la matricula para rescatar los datos del estudiante y ver los datos totales de la matricula a editar
const getMatriculaData = async (matriculaId: number) => {
  console.log(matriculaId)
  try {
    const response = await fetch(`http://localhost:3000/matricula/${matriculaId}`, {
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
      matriculaEditar.value = data
      console.table(matriculaEditar.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

// obtener datos de los profesores que pueden impartir la nueva asignatura
const teachersBySubjectIdRefFromServer: Ref<{
  asignatura: {
    id: number
    nombre: string
  }
  teachers: {
    id: number
    teacher: {
      id: number
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: number
      email: string
    }
  }[]
} | null> = ref(null)

// array para solo almacenar los profesores
const onlyTeachersArray: Ref<{
  id: number
  nombre: string
  apellidos: string
  dni: string
  direccion: string
  telefono: number
  email: string
}[]> = ref([])

const getTeachersBySubjectData = async () => {
  try {
    if (!selectedSubject.value) {
      // Manejar el caso en el que no haya una asignatura seleccionada
      console.warn('No hay una asignatura seleccionada.')
      return
    }

    const response = await fetch(
      `http://localhost:3000/asignaturas_profesores/subject/${selectedSubject.value.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.status == 404) {
      toast.add({ severity: 'info', summary: 'Error', detail: 'No hay profesores asignados para esta asignatura', life: 3000 });
      resetearVariables()
      return
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = (await response.json()) as {
        asignatura: {
          id: number
          nombre: string
        }
        teachers: {
          id: number
          teacher: {
            id: number
            nombre: string
            apellidos: string
            dni: string
            direccion: string
            telefono: number
            email: string
          }
        }[]
      }
      teachersBySubjectIdRefFromServer.value = data
      console.log(teachersBySubjectIdRefFromServer.value)

      // mapeo los datos para solo almacenar los profesores
      onlyTeachersArray.value = teachersBySubjectIdRefFromServer.value.teachers.map(teacher => teacher.teacher)

      console.table(onlyTeachersArray.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    teachersBySubjectIdRefFromServer.value = null
  }
}

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

// Obtener datos de todos los profesores
const teachersRefFromServer: Ref<
  {
    id: number
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: number
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
        dni: string
        direccion: string
        telefono: number
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

// logica de editar y verificar
const editarMatricula = async () => {
  let isValid = true;

  try {
    if (!selectedSubject.value && !selectedTeacher.value) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene alguno de los campos', life: 3000 });
      isValid = false;
    }

    if (isValid && matriculaEditar.value) {
      await getMatriculasByStudentId(matriculaEditar.value.student.id);
    }
    if (isValid && matriculaEditar.value && !existenDuplicados()) {
      fetchEditarMatricula(matriculaEditar.value.id, selectedSubject.value, selectedTeacher.value)
    }
  } catch (error) {
    console.error('Error en la función editarMatricula:', error);
  }
}
// Chequear si hay duplicados entre las matriculas del array y las que estén en la BD del alumno
// modificacion de eliminarDuplicados del alta asignaciones pero retornando true o false
const existenDuplicados = () => {
  if (studentWithMatriculasEditar.value && selectedSubject) {
    // recorro el array y extraigo todos los Ids de las asignaturas que haya
    const subjectsIdsOfMatriculasOfStudent = studentWithMatriculasEditar.value.matriculas.map(matricula => matricula.subject.id);
    const selectedSubjectId = selectedSubject.value?.id
    const duplicados = subjectsIdsOfMatriculasOfStudent.filter(subjectId => subjectId === selectedSubjectId); // filtro si esa asignatura ya se encuentra en las matriculas del alumno

    if (duplicados.length > 0) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'El alumno ya está matriculado en esa asignatura', life: 3000 });
      return true
    }
    if (duplicados.length == 0) {
      return false
    }
  }
};

const fetchEditarMatricula = async (matriculaId: number, subjectSelected: typeof selectedSubject.value, teacherSelected: typeof selectedTeacher.value,) => {
  if (subjectSelected == undefined) {
    subjectSelected = matriculaEditar.value?.subject
  }
  if (teacherSelected == undefined) {
    teacherSelected = matriculaEditar.value?.teacher
  }
  try {
    const response = await fetch(`http://localhost:3000/matricula/${matriculaId}`, {
      method: 'PUT',
      body: JSON.stringify({
        newSubject: {
          id: subjectSelected?.id
        },
        newTeacher: {
          id: teacherSelected?.id
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
      const matriculaActualizada = {
        id: matriculaEditar.value?.id,
        student: {
          id: matriculaEditar.value?.student.id,
          nombre: matriculaEditar.value?.student.nombre,
          apellidos: matriculaEditar.value?.student.apellidos,
        },
        subject: {
          id: subjectSelected?.id,
          nombre: subjectSelected?.nombre,
          teacher: {
            id: teacherSelected?.id,
            nombre: teacherSelected?.nombre,
            apellidos: teacherSelected?.apellidos,
            dni: teacherSelected?.dni,
            direccion: teacherSelected?.direccion,
            telefono: teacherSelected?.telefono,
            email: teacherSelected?.email
          }
        }
      }
      console.table(matriculaActualizada)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al actualizar la matrícula', life: 3000 });
  } finally {
    visibleDialog.value = false
    getAllStudentsWithMatriculas()
    resetearVariables()
  }
}

// Resetear variables
const resetearVariables = () => {
  selectedSubject.value = undefined
  selectedTeacher.value = undefined
}

// Ir a la página idividual del alumno
const goToStudent = (id: number) => {
  router.push({
    path: `/alumno/${id}`
  })
}

// Filtrar datos
const filters = ref() // variable filtro
const filters1 = ref() // variable filtro


const initFilters = () => { // componente filtro en global para que busque cualquier valor
  filters.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.dni': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.direccion': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.telefono': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'matriculas.subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'matriculas.teacher.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'matriculas.teacher.apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'matriculas.teacher.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
  filters1.value = {
    'subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.dni': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.direccion': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.telefono': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}
initFilters()

const clearFilter = () => { // para borrar los filtros, reinicio la función y el value = null
  initFilters()
}

// Expandir la tabla
const expandedRows = ref<{ [key: number]: boolean }>({});

const expandAll = () => {
  expandedRows.value = allStudentsWithMatriculasRef.value.reduce<{ [key: number]: boolean }>((acc, p) => {
    acc[p.student.id] = true;
    return acc;
  }, {});
};

const collapseAll = () => {
  expandedRows.value = [];
};


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
  <div class="flex justify-content-start pt-2" v-if="isAdmin">
    <div class="card flex justify-content-center">
      <DataTable v-model:expandedRows="expandedRows" v-model:filters="filters" filterDisplay="menu"
        :globalFilterFields="['student.nombre', 'student.apellidos', 'student.dni', 'student.direccion', 'student.telefono', 'student.email', 'matriculas.subject.nombre', 'matriculas.teacher.nombre', 'matriculas.teacher.apellidos', 'matriculas.teacher.dni', 'matriculas.teacher.direccion', 'matriculas.teacher.telefono', 'matriculas.teacher.email']"
        class="" removableSort removableSortstripedRows :value="allStudentsWithMatriculasRef" dataKey="student.id" sortField="student.id" :sortOrder="1" :paginator="true" :rows="10"
        tableStyle="width: 100%" :pt="{
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
          <div class="flex flex-wrap justify-content-end h-max align-content-center">
            <Button class="w-auto mr-2 h-1rem" severity="secondary" text icon="pi pi-plus" label="Expandir" v-tooltip.top="'Expandir todo'" @click="expandAll"></Button>
            <Button class="w-auto h-1rem" severity="secondary" text icon="pi pi-minus" label="Colapsar" v-tooltip.top="'Colapsar todo'" @click="collapseAll"></Button>
          </div>
        </template>
        <div id="header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Listado Matrículas</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem mr-2" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button class="mr-2" rounded icon="pi pi-filter-slash" label="" outlined v-tooltip.top="'Limpiar filtros'" @click=" clearFilter()"></Button>
          </span>
        </div>
        <Column expander style="width: 1rem"></Column>
        <Column field="student.nombre" header="Nombre" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="student.apellidos" header="Apellidos" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="student.dni" header="DNI" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false"> <template
            #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template> </Column>
        <Column field="student.direccion" header="Dirección" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="student.telefono" header="Telléfono" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template>
        </Column>
        <Column field="student.email" header="Email" sortable headerStyle="width:20%; min-width:8rem" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1" :show-filter-match-modes="false"> <template
            #filter="{ filterModel }">
            <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
          </template> </Column>
        <Column headerStyle="width:5%; min-width:8rem">
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Alumno'" @click="goToStudent(slotProps.data.student.id)"></Button>
          </template>
        </Column>

        <template #expansion="slotProps">

          <DataTable :value="slotProps.data.matriculas" v-model:filters="filters1" filterDisplay="menu" :globalFilterFields="['subject.nombre', 'teacher.nombre', 'teacher.apellidos', 'teacher.email']"
            class="" removableSort selection-mode="single" tableStyle="width: 10rem" :pt="{
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
            <Column field="teacher.nombre" header="Nombre" sortable headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column field="teacher.apellidos" header="Apellidos" sortable headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column field="teacher.dni" header="DNI" sortable headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column field="teacher.email" header="Email" sortable headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column header="" headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="flex p-1 pl-1">
              <template #body="slotProps">
                <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Matrícula'" @click="confirmDelete(slotProps.data)"></Button>
                <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Matrícula'" @click="mostrarDialog(slotProps.data)"></Button>
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

  <!-- Dialog editar matricula -->
  <Dialog v-model:visible="visibleDialog" modal header="Editar Matrícula" class="w-auto" :pt="{
    header: { class: 'flex align-items-baseline h-5rem' },
    title: { class: '' },
    closeButtonIcon: { class: '' },
    mask: {
      style: 'backdrop-filter: blur(3px)'
    }
  }
    ">
    <span class="p-text-secondary flex mb-5">Cambiar matrícula</span>

    <label class="text-xl text-800 font-bold">Datos del estudiante</label>

    <DataTable :value="[matriculaEditar]" class="pt-1" tableStyle="width: auto" :pt="{
    table: {
      class: 'mt-0',
      style: { 'border': 'none' }
    }
  }
    ">

      <Column field="student.nombre" header="Nombre" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
      <Column field="student.apellidos" header="Apellidos" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
      <Column field="student.dni" header="DNI" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
      <Column field="student.direccion" header="Dirección" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
      <Column field="student.telefono" header="Teléfono" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
      <Column field="student.email" header="Email" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
    </DataTable>

    <div class="flex flex-column col-12 lg:col-12 md:col-12 sm:col-12 pt-4">
      <label class="text-xl text-800 font-bold">Asignatura a editar</label>
      <Tag class="ml-1 mt-1 w-max" :value="matriculaEditar?.subject.nombre" severity="secondary" />
    </div>
    <div class="flex flex-column col-12 lg:col-12 md:col-12 sm:col-12">
      <label class="text-xl text-800 font-bold pl-1">Selecciona nueva Asignatura</label>
      <Dropdown class="w-max mt-2" :options="subjectsRefFromServer" optionLabel="nombre" display="chip" filter placeholder="Selecciona..." v-model="selectedSubject"
        @change="getTeachersBySubjectData()">
      </Dropdown>
    </div>
    <div class="flex flex-column col-12 lg:col-12 md:col-12 sm:col-12 pt-4">
      <label class="text-xl text-800 font-bold">Profesor a editar</label>
      <DataTable :value="[matriculaEditar]" class="pt-1" tableStyle="width: auto" :pt="{
    table: {
      class: 'mt-0',
      style: { 'border': 'none' }
    }
  }
    ">
        <Column field="teacher.nombre" header="Nombre" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
        <Column field="teacher.apellidos" header="Apellidos" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
        <Column field="teacher.email" header="Email" class="pl-3 pr-3" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
      </DataTable>
    </div>
    <div class="flex flex-column col-12 lg:col-12 md:col-12 sm:col-12">
      <label class="text-xl text-800 font-bold pl-1">Selecciona nuevo profesor</label>
      <Dropdown class="w-max mt-2" :options="onlyTeachersArray" optionLabel="nombre" display="chip" filter placeholder="Selecciona..." v-model="selectedTeacher">
        <template #option="slotProps">
          <div>
            {{ slotProps.option.nombre }}
            {{ slotProps.option.apellidos }} |
            {{ slotProps.option.email }}
          </div>
        </template>

        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{ slotProps.value.nombre }}
            {{ slotProps.value.apellidos }} |
            {{ slotProps.value.email }}
          </div>
        </template>
      </Dropdown>
    </div>
    <div class="flex justify-content-center mb-3 pt-2">
      <Button class="mr-2 " type="button" rounded label="Cancelar" severity="secondary" @click="getAllStudentsWithMatriculas(), resetearVariables(), visibleDialog = false"></Button>
      <Button type="button" rounded label="Actualizar" @click="editarMatricula()"></Button>
    </div>
  </Dialog>
</template>
<style scoped></style>
