<script setup lang="ts">
import { inject, onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext'
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

const teacherDataFromServer: Ref<{
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
} | undefined> = ref(undefined)


const teacherId = Number(router.currentRoute.value.params.id)
console.log(teacherId)
console.log(router.currentRoute.value.params['id'])

// OBTENER DATOS DEL PROFESOR
const getTeacherData = async (teacherId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/teacher/${teacherId}`, {
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
      teacherDataFromServer.value = data
      console.log(teacherDataFromServer.value)
      // Para cambiar el permiso a string
      if (teacherDataFromServer.value) {
        teacherDataFromServer.value.userId.permiso = PermisoToString(Number(teacherDataFromServer.value?.userId.permiso))
      }
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error obteniendo los datos del profesor', life: 3000 });
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

// OBTENER ASIGNATURAS DEL PROFESOR
const subjectsByTeacherIdFromServer: Ref<{
  teacher: {
    id: number
    nombre: string
    apellidos: string
    asignaturas: string
  }
  asignaciones: {
    id: number
    subject: {
      id: number
      nombre: string
    }
  }[]
} | null> = ref(null)

const getSubjectsByTeacherData = async (teacherId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/asignaturas_profesores/teacher/${teacherId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.status == 404) {
      toast.add({ severity: 'info', summary: 'Error', detail: 'El profesor no tiene asignaturas asignadas', life: 1000 });
      return
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      // loadingStore.loadingTrue()
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      const data = await response.json()
      subjectsByTeacherIdFromServer.value = data
      console.log(data)
      console.log(subjectsByTeacherIdFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo las asignaturas asignadas', life: 3000 });
  }
  // finally {
  //   loadingStore.loadingFalse()
  // }
}

// OBTENER ALUMNOS MATRICULADOS CON EL PROFESOR
const matriculasRefFromServer: Ref<{
  teacher: {
    id: number
    nombre: string
    apellidos: string
    asignaturas: string
  }
  matriculas: {
    id: number
    student: {
      id: number
      nombre: string
      apellidos: string
      dni: string
      direccion: string
      telefono: string
      email: string
    }
    subject: {
      id: number
      nombre: string
    }
    year: number
  }[]
} | null> = ref(null)

const getMatriculasByTeacherData = async (teacherId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/matriculas/teacher/${teacherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status == 404) {
      toast.add({ severity: 'info', summary: 'Error', detail: 'El profesor no tiene a ningún alumno matriculado', life: 1000 });
      return
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      // loadingStore.loadingTrue()
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      const data = await response.json()
      matriculasRefFromServer.value = data
      console.log(data)
      console.log(matriculasRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo a los alumnos matriculados', life: 3000 });
  }
  // finally {
  //   loadingStore.loadingFalse()
  // }
}
getMatriculasByTeacherData(teacherId)
getSubjectsByTeacherData(teacherId)
getTeacherData(teacherId)

// LÓGICA BORRAR PROFESOR
const confirmDeleteProfesor = () => {
  console.log("borrando profesor")
  confirm.require({
    message: '¿Seguro que quiere eliminar este profesor?',
    header: 'Borrar Profesor',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarProfesor()
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

const borrarProfesor = async () => {
  try {
    const response = await fetch(`http://localhost:3000/teacher/${teacherId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Profesor borrado', life: 3000 });
      toast.add({ severity: 'info', summary: 'Redirigiendo', detail: 'Redirigiendo al listado de profesores...', life: 3000 });
      setTimeout(() => {
        router.push('/listado-profesores')
      }, 2000)
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)

    if (error.message.includes('400')) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se puede borrar el profesor porque tiene asignaturas o matrículas asignadas', life: 3000 });
    }
    else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al borrar al alumno', life: 3000 });
    }
  }
}

// LÓGICA EDITAR PROFESOR
const visibleDialogProfesor: Ref<boolean> = ref(false);

const profesorEditar: Ref<
  | {
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

const mostrarDialogEditarProfesor = async () => {
  await getUsersData()
  await getTeacherData(teacherId)

  visibleDialogProfesor.value = true
  if (teacherDataFromServer.value) {
    profesorEditar.value = { ...teacherDataFromServer.value }
  }
  console.table(profesorEditar.value)
}

// validar datos del dialog
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const editarProfesor = async () => {
  console.log(profesorEditar.value.userId.id)
  let isValid = true
  if (!patronEmail.test(profesorEditar.value.email)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (!profesorEditar.value.nombre || !profesorEditar.value.apellidos || !profesorEditar.value.email || isNaN(profesorEditar.value.userId.id)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
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
      visibleDialogProfesor.value = false
      getTeacherData(teacherId)
    }
  }
}

//OBTENER USUARIOS PARA EDITAR ASIGNACION
const usersRefFromServer: Ref<{
  id: number,
  username: string,
  email: string,
  permiso: number | string
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

//OBTENER USUARIO PARA MOSTRAR EN LA TABLA AL EDITAR
const getUser = async () => {
  if (profesorEditar.value.userId.id != undefined) {
    try {
      const response = await fetch(`http://localhost:3000/usuario/${profesorEditar.value.userId.id}`, {
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
        }
      }
    }
    catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    }
  }
}

// LÓGICA BORRAR ASIGNACIÓN
const confirmDeleteAsignacion = (asignacionId: number) => { // al ser un array, le indico el valor de la casilla 0
  console.log(asignacionId)
  confirm.require({
    message: '¿Seguro que quiere borrar esta asignación?',
    header: 'Borrar Asignación',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarSubjectTeacher(asignacionId)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};


const borrarSubjectTeacher = async (asignacionId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/asignatura_profesor/${asignacionId}`,
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
    getSubjectsByTeacherData(teacherId)
  }
}


// LÓGICA EDITAR ASIGNACION
const visibleDialogEditarAsignacion: Ref<boolean> = ref(false);

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

// mostrar el dialog de editar
const mostrarDialogEditarAsignacion = (asignacion: typeof asignacionOnlySubject.value) => {
  visibleDialogEditarAsignacion.value = true
  getSubjectsData()
  getAsignacionData(asignacion.id)
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


// logica de editar y verificar
const editarSubjectTeacher = async () => {
  let isValid = true;
  try {
    if (!selectedSubject.value) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
      isValid = false;
    }

    if (isValid && asignacionEditar.value && selectedSubject.value) {
      await getSubjectsByTeacherData(asignacionEditar.value.teacher.id);
    }

    if (isValid && asignacionEditar.value && selectedSubject.value && !existenDuplicadosAsignacion()) {
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
    visibleDialogEditarAsignacion.value = false
    getSubjectsByTeacherData(teacherId)
  }
}

// Chequear si hay duplicados entre las asignaturas del array y las que estén en la BD
// modificacion de eliminarDuplicados del alta asignaciones pero retornando true o false
const existenDuplicadosAsignacion = () => {
  if (subjectsByTeacherIdFromServer.value?.asignaciones && selectedSubject.value) {
    // recorro el array y extraigo todos los Ids de las asignaturas que haya
    const subjectsIdsOfTeacher = subjectsByTeacherIdFromServer.value.asignaciones.map(subjectTeacher => subjectTeacher.subject.id);
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


// LÓGICA BORRAR MATRICULA
const confirmDeleteMatricula = (matriculaId: number) => { // al ser un array, le indico el valor de la casilla 0
  console.log(matriculaId)
  confirm.require({
    message: '¿Seguro que quiere borrar esta matrícula?',
    header: 'Borrar Matrícula',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarMatricula(matriculaId)
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};


const borrarMatricula = async (matriculaId: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/matricula/${matriculaId}`,
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
    getMatriculasByTeacherData(teacherId)
  }
}

// LÓGICA EDITAR MATRICULA
const visibleDialogEditarMatricula: Ref<boolean> = ref(false);

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
      email: string
    }
    year: number
  } | undefined
> = ref(undefined)

// const selectedSubject: Ref<
//   {
//     id: number
//     nombre: string
//   } | undefined
// > = ref(undefined)
// Se repite la variable de editar Asignacion

const selectedTeacher: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    email: string
  } | undefined
> = ref(undefined)

const studentWithMatriculasEditar: Ref<{
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
      email: string
    }
    year: number
  }[]
} | undefined> = ref(undefined)


// Resetear variables
const resetearVariables = () => {
  selectedSubject.value = undefined
  selectedTeacher.value = undefined
}

// mostrar el dialog de editar
const mostrarDialogEditarMatricula = async (matricula: typeof matriculaEditar.value) => {
  visibleDialogEditarMatricula.value = true
  await getTeachersBySubjectData()
  await getSubjectsData()
  await getMatriculasByStudentData
  if (matricula) {
    await getMatriculaData(matricula.id)
  }
}

// Obtener matriculas del alumno a editar
const matriculaFromServer: Ref<{
  student: {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: string
    email: string
  }
  matriculas: {
    id: number
    subject: {
      id: number
      nombre: string
    }
    teacher: {
      id: number
      nombre: string
      apellidos: string
      email: string
    }
    year: number
  }[]
} | null> = ref(null)

const getMatriculasByStudentData = async (studentId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/matriculas/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status == 404 && !matriculaFromServer.value?.matriculas) {
      toast.add({ severity: 'info', summary: 'Error', detail: 'El alumno no tiene matrículas asignadas', life: 3000 });
      return
    }
    if (response.ok) {
      const data = await response.json()
      matriculaFromServer.value = data
      console.log(data)
      console.dir(matriculaFromServer.value)

      // para cuando estemos editando la matricula
      if (visibleDialogEditarMatricula.value) {
        studentWithMatriculasEditar.value = data
      }
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
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
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error obteniendo los datos de la matrícula', life: 3000 });
  }
}

// Obtener array de profesores que imparten cada asignatura
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
      email: string
    }
  }[]
} | null> = ref(null)

// array para solo almacenar los profesores
const onlyTeachersArray: Ref<{
  id: number
  nombre: string
  apellidos: string
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

// logica de editar y verificar
const editarMatricula = async () => {
  let isValid = true;

  try {
    if (!selectedSubject.value && !selectedTeacher.value) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene alguno de los campos', life: 3000 });
      isValid = false;
    }
    if (selectedSubject.value && onlyTeachersArray.value.length > 0 && !selectedTeacher.value) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, si modifica la asignatura, debe seleccionar a un profesor', life: 3000 });

      isValid = false
    }
    if (isValid && matriculaEditar.value) {
      await getMatriculasByStudentData(matriculaEditar.value.student.id);
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
    console.log('entrando en duplicados')

    // recorro el array y extraigo todos los Ids de las asignaturas que haya
    const subjectsIdsOfMatriculasOfStudent = studentWithMatriculasEditar.value.matriculas.map(matricula => matricula.subject.id);
    const selectedSubjectId = selectedSubject.value?.id
    const duplicados = subjectsIdsOfMatriculasOfStudent.filter(subjectId => subjectId === selectedSubjectId); // filtro si esa asignatura ya se encuentra en las matriculas del alumno
    console.log(`existen duplicados ${duplicados}`)
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
      toast.add({ severity: 'success', summary: 'Editado', detail: 'Matrícula editada', life: 3000 });
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
          }
        }
      }
      console.table(matriculaActualizada)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al actualizar la matrícula', life: 3000 });
  } finally {
    visibleDialogEditarMatricula.value = false
    getTeacherData(teacherId)
    getMatriculasByTeacherData(teacherId)
    resetearVariables()
  }
}

// volver a la página anterior
const volver = () => {
  window.history.back()
}

// Ir a la página idividual del profesor
const goToStudent = (id: number) => {
  router.push({
    path: `/alumno/${id}`,
  });
  window.scrollTo({ top: 0 }); // para ir al inicio de la pagina
}

// Filtrar datos
const filters = ref() // variable filtro
const filters1 = ref() // variable filtro

const initFilters = () => { // componente filtro en global para que busque cualquier valor
  filters.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
  filters1.value =
  {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.dni': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.direccion': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.telefono': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'student.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}
initFilters()

const clearFilter = () => { // para borrar los filtros, reinicio la función y el value = null
  initFilters()
}
</script>

<template>
  <div class="col-10">
    <div class="grid">
      <div id="header" class="flex col-12 justify-content-between h-auto mb-2">
        <h2 class="m-0 text-4xl text-800 font-bold">Perfil del Profesor</h2>
        <Button class="w-auto" severity="secondary" @click="volver()">Volver</Button>
      </div>
      <div id="photo" class="card col-fixed flex align-items-center justify-content-center col-3 h-20rem w-20rem">
        <img src="../utils/img/user-profile-img.jpg" alt="" class="h-20rem w-20rem">
        <!--TODO Hay que añadir fotos a la base de datos -->
      </div>
      <div id="datos" class="card col ml-5">
        <div id="Datos-personales" class="mb-5">
          <h6 class="m-1 text-2xl text-800 font-bold"> {{ teacherDataFromServer?.nombre }} {{ teacherDataFromServer?.apellidos }}</h6>
          HAY QUE AÑADIR DNI A LA BASE DE DATOS
          <!-- <h6 class="m-1 text-xl text-800 font-bold"> {{ teacherDataFromServer?.dni }}</h6> -->

          <ul id="datos-contacto" class="list-none p-0">
            <li class="flex mb-3">
              <div class="bg-green-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-home text-green-500" style="font-size: 2rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Dirección</span>
                HAY QUE AÑADIR DIRECCION A LA BASE DE DATOS
                <!-- <span class="flex justify-content-start "> {{ teacherDataFromServer?.direccion }}</span> -->
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-blue-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-phone text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Teléfono</span>
                HAY QUE AÑADIR TELEFONO A LA BASE DE DATOS

                <!-- <a :href="'tel:' + teacherDataFromServer?.telefono" class="flex justify-content-start"> {{ teacherDataFromServer?.telefono }}</a> -->
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-pink-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-envelope text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Email</span>
                <a :href="'mailto:' + teacherDataFromServer?.email" class="flex justify-content-start"> {{ teacherDataFromServer?.email }}</a>
              </div>
            </li>
          </ul>
        </div>
        <!-- mostrar solo si es admin -->
        <div id="datosUsuario" class="" v-if="isAdmin">
          <h6 class="text-xl text-800 font-bold"> Usuario asignado</h6>
          <ul id="datos-contacto" class="list-none p-0 flex align-items-center">
            <li class="flex mb-3">
              <div class="flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3 ">
                <i class="pi pi-user text-green-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Username</span>
                <span class="flex justify-content-start "> {{ teacherDataFromServer?.userId.username }}</span>
              </div>
            </li>
            <li class="flex mb-3">
              <div class=" flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3">
                <i class="pi pi-envelope text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Email</span>
                <a :href="'mailto:' + teacherDataFromServer?.email" class="flex justify-content-start">{{ teacherDataFromServer?.userId.email }}</a>
              </div>
            </li>
            <li class="flex mb-3">
              <div class=" flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3">
                <i class="pi pi-key text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Permiso</span>
                <span>{{ teacherDataFromServer?.userId.permiso }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="ml-2" v-if="isAdmin">
          <!-- mostrar solo si es admin -->
          <Button class="w-max w-3rem mr-2" icon="pi pi-trash" severity="danger" v-tooltip.top="'Borrar Profesor'" @click="confirmDeleteProfesor()"></Button>
          <Button class="w-max w-3rem" icon="pi pi-pencil" severity="secondary" v-tooltip.top="'Editar Profesor'" @click="mostrarDialogEditarProfesor()"></Button>
        </div>
      </div>
    </div>

    <div id="tablas" class="xl:flex mt-5 md:block">
      <!-- Tabla de asignaturas asignadas -->
      <div v-if="subjectsByTeacherIdFromServer?.asignaciones" class="card w-max mr-5 h-max">
        <DataTable :value="subjectsByTeacherIdFromServer.asignaciones" dataKey="id" v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['subject.nombre']" class="" removableSort
          sortField="subject.nombre" :sortOrder="1" :paginator="true" :rows="5" stripedRows :showGridlines="false" selection-mode="single" :pt="{
          paginator: {
            paginatorWrapper: { class: 'flex justify-content-center' },
            firstPageButton: { class: 'w-auto m-0' },
            previousPageButton: { class: 'w-auto m-0' },
            pageButton: { class: 'w-auto m-0' },
            nextPageButton: { class: 'w-auto m-0' },
            lastPageButton: { class: 'w-auto m-0' },
          }, table: {
            class: 'mt-0 w-12',
            style: { 'border': 'none', 'background-color': 'transparent' }
          }
        }">

          <div id="header" class="h-6rem border-round-top" style="background-color:  #f8f9fa">
            <h5 class="m-0 text-3xl text-800 font-bold pl-1">Asignaciones</h5>
            <span class="p-input-icon-left flex align-items-center mt-2">
              <i class="pi pi-search"></i>
              <InputText class="h-auto mr-2" v-model="filters['global'].value" placeholder="Buscar..." />
              <Button class="mr-2" rounded icon="pi pi-filter-slash" label="" outlined v-tooltip.top="'Limpiar filtros'" @click=" clearFilter()"></Button>
            </span>
          </div>
          <Column field="subject.nombre" header="Asignatura" sortable headerStyle="" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
          <Column header="" headerStyle="" headerClass="h-2rem pl-1" bodyClass="flex p-1 pl-8 h-3rem">
            <template #body="slotProps" v-if="isAdmin">
              <Button class=" m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Asignación'" @click="confirmDeleteAsignacion(slotProps.data.id)"></Button>
              <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Asignación'" @click="mostrarDialogEditarAsignacion(slotProps.data)"></Button>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Tabla de alumnos matriculados -->
      <div v-if="matriculasRefFromServer?.matriculas" class="card w-max">
        <DataTable :value="matriculasRefFromServer.matriculas" dataKey="id" v-model:filters="filters1" filterDisplay="menu"
          :globalFilterFields="['student.nombre', 'student.apellidos', 'student.dni', 'student.direccion', 'student.telefono', 'student.email', 'subject.nombre']" class="" removableSort
          sortField="subject.nombre" :sortOrder="1" :paginator="true" :rows="10" stripedRows :showGridlines="false" selection-mode="single" :pt="{
          paginator: {
            paginatorWrapper: { class: 'flex justify-content-center' },
            firstPageButton: { class: 'w-auto m-0' },
            previousPageButton: { class: 'w-auto m-0' },
            pageButton: { class: 'w-auto m-0' },
            nextPageButton: { class: 'w-auto m-0' },
            lastPageButton: { class: 'w-auto m-0' },
          }, table: {
            class: 'mt-0 w-12',
            style: { 'border': 'none', 'background-color': 'transparent' }
          }
        }
          ">

          <div id=" header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
            <h5 class="m-0 text-3xl text-800 font-bold pl-1">Matrículas</h5>
            <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
              <i class="pi pi-search"></i>
              <InputText class="h-3rem mr-2" v-model="filters['global'].value" placeholder="Buscar..." />
              <Button class="mr-2" rounded icon="pi pi-filter-slash" label="" outlined v-tooltip.top="'Limpiar filtros'" @click=" clearFilter()"></Button>
            </span>
          </div>

          <ColumnGroup type="header">
            <Row>
              <Column header="Curso escolar" field="year" :rowspan="2" headerClass="h-3rem pl-1 bg-transparent pr-3 " :show-filter-match-modes="false">
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
                </template>
              </Column>
              <Column header="Asignatura" field="subject.nombre" :rowspan="2" sortable headerClass="h-2rem pl-1 bg-transparent" :show-filter-match-modes="false">
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
                </template>
              </Column>
              <Column header="Alumno" :colspan="4" headerClass="h-3rem pl-1 bg-transparent"></Column>
            </Row>
            <Row>
              <Column header="Nombre" sortable field="student.nombre" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
                </template>
              </Column>

              <Column header="Apellidos" sortable field="student.apellidos" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
                </template>
              </Column>
              <Column header="DNI" sortable field="student.dni" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
                </template>
              </Column>
              <Column header="" headerClass="h-2rem pl-1 bg-transparent pr-2"></Column>
            </Row>
          </ColumnGroup>

          <Column field="year" bodyClass="p-0 pl-1">
            <template #body="slotProps">
              {{ slotProps.data.year }} / {{ slotProps.data.year + 1 }}
            </template>
          </Column>
          <Column field="subject.nombre" bodyClass="p-0 pl-1"></Column>
          <Column field="student.nombre" bodyClass="p-0 pl-1"></Column>
          <Column field="student.apellidos" bodyClass="p-0 pl-1"></Column>
          <Column field="student.dni" bodyClass="p-0 pl-1"></Column>
          <Column header="" headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="flex p-1 pl-1 h-3rem">
            <!-- mostrar solo si es admin -->
            <template #body="slotProps" v-if="isAdmin">
              <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Alumno'" @click="goToStudent(slotProps.data.student.id)"></Button>
              <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Matrícula'" @click="confirmDeleteMatricula(slotProps.data.id)"></Button>
              <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Matrícula'" @click="mostrarDialogEditarMatricula(slotProps.data)"></Button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Dialog editar Profesor-->
    <Dialog v-model:visible="visibleDialogProfesor" modal header="Editar Profesor" class="w-3" :pt="{
          header: { class: 'flex align-items-baseline h-5rem' },
          title: { class: '' },
          closeButtonIcon: { class: '' },
          mask: {
            style: 'backdrop-filter: blur(3px)'
          }
        }
          ">

      <span class="p-text-secondary flex mb-5">Actualizar información</span>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="nombre" class="font-semibold w-6rem">Nombre</label>
        <InputText id="nombre" class="w-7" v-model="profesorEditar.nombre" :class="{ 'p-invalid': !profesorEditar.nombre }" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="apellidos" class="font-semibold w-6rem">Apellidos</label>
        <InputText id="apellidos" class="w-7" v-model="profesorEditar.apellidos" :class="{ 'p-invalid': !profesorEditar.apellidos }" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="email" class="font-semibold w-6rem">Email</label>
        <InputText id="email" class="w-7" v-model="profesorEditar.email" :class="{ 'p-invalid': !profesorEditar.email }" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="usuario" class="font-semibold w-6rem">Usuario</label>
        <Dropdown class="" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput" placeholder="Selecciona un usuario"
          v-model="profesorEditar.userId.id" @change="getUser()" :class="{ 'p-invalid': profesorEditar.userId.id == undefined }" />
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
          <Column field="permiso" header="Permiso" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem">
            <template #body="">
              {{ profesorEditar.userId.permiso }}
            </template>
          </Column>
        </DataTable>
      </div>
      <div class="flex justify-content-center mb-3 pt-2">
        <Button class="mr-2" type="button" rounded label="Cancelar" severity="secondary" @click=" getTeacherData(teacherId), visibleDialogProfesor = false"></Button>
        <Button type="button" rounded label="Actualizar" @click="editarProfesor()"></Button>
      </div>
      <Toast></Toast>
    </Dialog>

    <!-- Dialog editar asignación -->
    <Dialog v-model:visible="visibleDialogEditarAsignacion" modal header="Editar Asignación" class="w-3" :pt="{
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
        <Button class="mr-2" type="button" rounded label="Cancelar" severity="secondary" @click="visibleDialogEditarAsignacion = false"></Button>
        <Button type="button" rounded label="Actualizar" @click="editarSubjectTeacher()"></Button>
      </div>
    </Dialog>

    <!-- Dialog editar matricula -->
    <Dialog v-model:visible="visibleDialogEditarMatricula" modal header="Editar Matrícula" class="w-auto" :pt="{
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
        <Button class="mr-2" type="button" rounded label="Cancelar" severity="secondary" @click="getTeacherData(teacherId), resetearVariables(), visibleDialogEditarMatricula = false"></Button>
        <Button type="button" rounded label="Actualizar" @click="editarMatricula()"></Button>
      </div>
    </Dialog>

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
</template>

<style scoped></style>
