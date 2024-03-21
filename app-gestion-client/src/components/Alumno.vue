<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown';
import { FilterMatchMode } from 'primevue/api';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';


const confirm = useConfirm();
const toast = useToast();
const router = useRouter()

const studentDataFromServer: Ref<{
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
} | undefined> = ref(undefined)

const studentId = Number(router.currentRoute.value.params.id) // Obtengo el id de la url
console.log(studentId)
console.log(router.currentRoute.value.params['id'])

// OBTENER DATOS DEL ESTUDIANTE
const getStudentData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/student/${studentId}`, {
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
      studentDataFromServer.value = data
      console.log(studentDataFromServer.value)
      // Para cambiar el permiso a string
      if (studentDataFromServer.value) {
        studentDataFromServer.value.userId.permiso = PermisoToString(Number(studentDataFromServer.value?.userId.permiso))
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

// OBTENER MATRICULAS DEL ALUMNO
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

const getMatriculasData = async (studentId: number) => {
  try {
    const response = await fetch(`http://localhost:3000/matriculas/student/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status == 404 && !matriculaFromServer.value?.matriculas) {
      toast.add({ severity: 'info', summary: 'Error', detail: 'EL alumno no tiene matrículas asignadas', life: 3000 });
      return
    }
    if (response.ok) {
      const data = await response.json()
      matriculaFromServer.value = data
      console.log(data)
      console.dir(matriculaFromServer.value)

      // para cuando estemos editando la matricula
      if (visibleDialogMatricula.value) {
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

getStudentData()
getMatriculasData(studentId)


// LÓGICA BORRAR ALUMNO
const confirmDeleteAlumno = () => {
  console.log("borrando alumno")
  confirm.require({
    message: '¿Seguro que quiere eliminar este alumno?',
    header: 'Borrar Alumno',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Borrar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      borrarAlumno()
    },
    reject: () => {
      toast.add({ severity: 'info', summary: 'Cancelado', detail: 'Se ha cancelado la operación', life: 3000 });
    }
  });
};

const borrarAlumno = async () => {
  try {
    const response = await fetch(`http://localhost:3000/student/${studentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (response.status === 204) {
      toast.add({ severity: 'success', summary: 'Borrado', detail: 'Alumno borrado', life: 3000 });
      toast.add({ severity: 'info', summary: 'Redirigiendo', detail: 'Redirigiendo al listado de alumnos...', life: 3000 });
      setTimeout(() => {
        router.push('/listado-alumnos')
      }, 2000)
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error: any) {
    console.error('Error en la solicitud:', error)

    if (error.message.includes('400')) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No se puede borrar el alumno porque tiene matrículas asignadas', life: 3000 });
    }
    else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al borrar al alumno', life: 3000 });
    }
  }
}

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
  console.log(matriculaId)
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
    getMatriculasData(studentId)
  }
}

// LÓGICA EDITAR ALUMNO
const visibleDialogAlumno: Ref<boolean> = ref(false);

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

const mostrarDialogEditarAlumno = async () => {
  await getUsersData()
  await getStudentData()
  visibleDialogAlumno.value = true
  if (studentDataFromServer.value) {
    alumnoEditar.value = { ...studentDataFromServer.value }
  }
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
  if (!alumnoEditar.value.nombre || !alumnoEditar.value.apellidos || !alumnoEditar.value.dni || !alumnoEditar.value.direccion || !alumnoEditar.value.telefono || !alumnoEditar.value.email || !alumnoEditar.value.userId.id) {
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
      visibleDialogAlumno.value = false
      getStudentData()
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
  if (alumnoEditar.value.userId.id != undefined) {
    try {
      const response = await fetch(`http://localhost:3000/usuario/${alumnoEditar.value.userId.id}`, {
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
        alumnoEditar.value.userId = data
        // console.table(user.value)

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

// LÓGICA EDITAR MATRICULA
const visibleDialogMatricula: Ref<boolean> = ref(false);

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
    email: string
  } | undefined
> = ref(undefined)

// watch(matriculaEditar, () => {
//   selectedSubject.value = matriculaEditar.value?.subject
//   selectedTeacher.value = matriculaEditar.value?.teacher
// });

const studentWithMatriculasEditar: Ref<typeof matriculaFromServer.value | undefined> = ref(undefined)


// mostrar el dialog de editar
const mostrarDialogEditarMatricula = async (matricula: typeof matriculaEditar.value) => {
  visibleDialogMatricula.value = true
  getSubjectsData()
  getTeachersBySubjectData()
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
      toast.add({ severity: 'info', summary: 'Error', detail: 'No hay profesores asignafos para esta signatura', life: 3000 });
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
      await getMatriculasData(matriculaEditar.value.student.id);
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
    visibleDialogMatricula.value = false
    getStudentData()
    getMatriculasData(studentId)
    resetearVariables()
  }
}

// Resetear variables
const resetearVariables = () => {
  selectedSubject.value = undefined
  selectedTeacher.value = undefined
}

// volver a la página anterior
const volver = () => {
  window.history.back()
}

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
    'subject.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.nombre': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.apellidos': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'teacher.email': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'year': { value: null, matchMode: FilterMatchMode.CONTAINS },
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
        <h2 class="m-0 text-4xl text-800 font-bold">Perfil del Alumno</h2>
        <Button class="w-auto" severity="secondary" @click="volver()">Volver</Button>
      </div>
      <div id="photo" class="card col-fixed flex align-items-center justify-content-center col-3 h-20rem w-20rem">
        <img src="../utils/img/user-profile-img.jpg" alt="Imagen de perfil" class="h-20rem w-20rem">
        <!--TODO Hay que añadir fotos a la base de datos -->
      </div>
      <div id="datos" class="card col ml-5">
        <div id="Datos-personales" class="mb-5">
          <h6 class="m-1 text-2xl text-800 font-bold"> {{ studentDataFromServer?.nombre }} {{ studentDataFromServer?.apellidos }}</h6>
          <h6 class="m-1 text-xl text-800 font-bold"> {{ studentDataFromServer?.dni }}</h6>

          <ul id="datos-contacto" class="list-none p-0">
            <li class="flex mb-3">
              <div class="bg-green-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-home text-green-500" style="font-size: 2rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Dirección</span>
                <span class="flex justify-content-start "> {{ studentDataFromServer?.direccion }}</span>
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-blue-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-phone text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Teléfono</span>
                <a :href="'tel:' + studentDataFromServer?.telefono" class="flex justify-content-start"> {{ studentDataFromServer?.telefono }}</a>
              </div>
            </li>
            <li class="flex mb-3">
              <div class="bg-pink-50 flex justify-content-center align-items-center border-circle w-4rem h-4rem mr-2">
                <i class="pi pi-envelope text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Email</span>
                <a :href="'mailto:' + studentDataFromServer?.email" class="flex justify-content-start"> {{ studentDataFromServer?.email }}</a>
              </div>
            </li>
          </ul>
        </div>
        <!-- TODO mostrar solo si es admin -->
        <div id="datosUsuario" class="">
          <h6 class="text-xl text-800 font-bold"> Usuario asignado</h6>
          <ul id="datos-contacto" class="list-none p-0 flex align-items-center">
            <li class="flex mb-3">
              <div class="flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3 ">
                <i class="pi pi-user text-green-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Username</span>
                <span class="flex justify-content-start "> {{ studentDataFromServer?.userId.username }}</span>
              </div>
            </li>
            <li class="flex mb-3">
              <div class=" flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3">
                <i class="pi pi-envelope text-pink-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Email</span>
                <a :href="'mailto:' + studentDataFromServer?.email" class="flex justify-content-start">{{ studentDataFromServer?.userId.email }}</a>
              </div>
            </li>
            <li class="flex mb-3">
              <div class=" flex justify-content-center align-items-center border-circle w-3rem h-3rem ml-3">
                <i class="pi pi-key text-blue-500" style="font-size: 1.5rem"></i>
              </div>
              <div class="flex-column align-self-center">
                <span class="flex justify-content-start align-self-center font-bold mb-1">Permiso</span>
                <span>{{ studentDataFromServer?.userId.permiso }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <!-- TODO mostrar solo si es admin -->
          <Button class="w-max w-3rem" icon="pi pi-trash" severity="danger" v-tooltip.top="'Borrar Alumno'" @click="confirmDeleteAlumno()"></Button>
          <Button class="w-max w-3rem" icon="pi pi-pencil" severity="secondary" v-tooltip.top="'Editar Alumno'" @click="mostrarDialogEditarAlumno()"></Button>
        </div>
      </div>
    </div>

    <div v-if="matriculaFromServer?.matriculas" class="card col-12">
      <DataTable :value="matriculaFromServer?.matriculas" dataKey="id" v-model:filters="filters" filterDisplay="menu"
        :globalFilterFields="['subject.nombre', 'teacher.nombre', 'teacher.apellidos', 'teacher.email', 'year']" class="" removableSort sortField="matricula.subject.nombre" :sortOrder="1"
        :paginator="true" :rows="5" stripedRows selection-mode="single" :pt="{
          paginator: {
            paginatorWrapper: { class: 'flex justify-content-center' },
            firstPageButton: { class: 'w-auto' },
            previousPageButton: { class: 'w-auto' },
            pageButton: { class: 'w-auto' },
            nextPageButton: { class: 'w-auto' },
            lastPageButton: { class: 'w-auto' },
          }, table: {
            class: 'mt-0 w-12',
            style: { 'border': 'none', 'background-color': 'transparent' }
          }
        }">

        <div id=" header" class="flex flex-column md:flex-row md:justify-content-between md:align-items-center h-6rem border-round-top" style="background-color:  #f8f9fa">
          <h5 class="m-0 text-3xl text-800 font-bold pl-1">Matrículas</h5>
          <span class=" mt-2 md:mt-0 p-input-icon-left flex align-items-center">
            <i class="pi pi-search"></i>
            <InputText class="h-3rem" v-model="filters['global'].value" placeholder="Buscar..." />
            <Button rounded icon="pi pi-filter-slash" label="" outlined v-tooltip.top="'Limpiar filtros'" @click=" clearFilter()"></Button>
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
            <Column header="Profesor" :colspan="3" headerClass="h-3rem pl-1 bg-transparent"></Column>
          </Row>
          <Row>
            <Column header="Nombre" sortable field="teacher.nombre" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>

            <Column header="Apellidos" sortable field="teacher.apellidos" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
            <Column header="Email" sortable field="teacher.email" headerClass="h-2rem pl-1 bg-transparent pr-2" bodyClass="p-0 pl-1" :show-filter-match-modes="false">
              <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Buscar..." />
              </template>
            </Column>
          </Row>
        </ColumnGroup>

        <Column field="year" bodyClass="p-0 pl-1">
          <template #body="slotProps">
            {{ slotProps.data.year }} / {{ slotProps.data.year + 1 }}
          </template>
        </Column>
        <Column field="subject.nombre" bodyClass="p-0 pl-1">
        </Column>
        <Column header="Nombre" sortable field="teacher.nombre" headerClass="h-2rem pl-1 bg-transparent">
        </Column>
        <Column header="Apellidos" field="teacher.apellidos" bodyClass="p-0 pl-1"></Column>
        <Column field="teacher.email" bodyClass="p-0 pl-1">
          <template #body="slotProps">
            <a :href="'mailto:' + slotProps.data.teacher.email" class="flex justify-content-start"> {{ slotProps.data.teacher.email }}</a>
          </template>
        </Column>
        <Column header="" headerStyle="" headerClass="h-2rem pl-1 bg-transparent" bodyClass="flex p-1 pl-1">
          <!-- TODO mostrar solo si es admin -->
          <template #body="slotProps">
            <Button class="m-0" icon="pi pi-eye" text rounded severity="primary" v-tooltip.top="'Ver Profesor'" @click="goToTeacher(slotProps.data.teacher.id)"></Button>
            <Button class="m-0" icon="pi pi-trash" text rounded severity="danger" v-tooltip.top="'Borrar Matrícula'" @click="confirmDeleteMatricula(slotProps.data.id)"></Button>
            <Button class="m-0" icon="pi pi-pencil" text rounded severity="secondary" v-tooltip.top="'Editar Matrícula'" @click="mostrarDialogEditarMatricula(slotProps.data)"></Button>
          </template>
        </Column>
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

  <!-- Dialog editar alumno -->
  <Dialog v-model:visible="visibleDialogAlumno" modal header="Editar Alumno" class="w-3" :pt="{
          header: { class: 'flex align-items-baseline h-5rem' },
          title: { class: '' },
          closeButtonIcon: { class: '' },
          mask: {
            style: 'backdrop-filter: blur(3px)'
          }
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
    <div class="flex align-items-center gap-3 mb-3">
      <label for="usuario" class="font-semibold w-6rem">Usuario</label>
      <Dropdown class="" :options="usersRefFromServer" optionLabel="username" optionValue="id" checkmark :highlightOnSelect="false" showClear id="provinciaInput" placeholder="Selecciona un usuario"
        v-model="alumnoEditar.userId.id" @change="getUser()" :class="{ 'p-invalid': alumnoEditar.userId.id == undefined }" />
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
        <Column field="permiso" header="Permiso" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem">
          <template #body="">
            {{ alumnoEditar.userId.permiso }}
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="flex justify-content-center mb-3 pt-2">
      <Button type="button" rounded label="Cancelar" severity="secondary" @click="getStudentData(), visibleDialogAlumno = false"></Button>
      <Button type="button" rounded label="Actualizar" @click="editarAlumno()"></Button>
    </div>
    <Toast></Toast>
  </Dialog>

  <!-- Dialog editar matricula -->
  <Dialog v-model:visible="visibleDialogMatricula" modal header="Editar Matrícula" class="w-auto" :pt="{
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
      <Button class="w-max" type="button" rounded label="Cancelar" severity="secondary" @click="getStudentData(), resetearVariables(), visibleDialogMatricula = false"></Button>
      <Button class="w-max" type="button" rounded label="Actualizar" @click="editarMatricula()"></Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
