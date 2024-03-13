<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const toast = useToast();

// OBTENER DATOS DE TODAS LAS ASIGNATURAS
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

getSubjectsData()

// OBTENER DATOS DE TODOS LOS PROFESORES
let teachersRefFromServer: Ref<
  {
    id: number
    nombre: string
    apellidos: string
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
        nombre: string
        apellidos: string
      }[]
      teachersRefFromServer.value = data
      console.log(data)
      console.log(teachersRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    ('Ha ocurrido un error')
  }
}

getTeachersData()

// REFERENCIAS DEL FORMULARIO
const selectedSubjects: Ref<
  {
    id: number
    nombre: string
  }[]
> = ref([])

// const teacherSelected: Ref<{
//   id: number
//   nombre: string
//   apellidos: string
// } | null> = ref(null)

const teacherSelected: Ref<typeof teachersRefFromServer.value[0] | null> = ref(null)

watch(teacherSelected, () => {
  if (teacherSelected.value) {
    getSubjectsByTeacherId(teacherSelected.value)
  }
  if (!teacherSelected.value) {
    selectedSubjects.value = []; // Si teacherSelected es false false, selectedSubjects es array vacío
  }
});

const formSubmitted = ref(false); // variable para avisos con InlineText

// CREAR RELACIÓN ASIGNATURA-PROFESOR
const crearSubjectTeacher = async () => {
  formSubmitted.value = true;
  let isValid = true;

  try {
    if (!teacherSelected.value || selectedSubjects.value.length === 0) {
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
      isValid = false;
    }

    if (teacherSelected.value && isValid) {
      await getSubjectsByTeacherId(teacherSelected.value);
      eliminarDuplicados();
      console.log(selectedSubjects.value) // imprimo el array ya filtrado

      selectedSubjects.value.forEach((subject) => {
        if (teacherSelected.value) {
          fetchSubjectTeacher(subject.id, teacherSelected.value.id)
        }
      })
    }
  } catch (error) {
    console.error('Error en la función crearSubjectTeacher:', error);
  }
};

// COMPROBAR SI YA TIENE ESA ASIGNATURA ASIGNADA
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

let existenAsignaciones = ref(false)

const getSubjectsByTeacherId = async (teacher: typeof teachersRefFromServer.value[0]) => {
  try {
    const response = await fetch(`http://localhost:3000/asignaturas_profesores/teacher/${teacher.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      existenAsignaciones.value = false
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }
    else {
      const data = await response.json()
      console.log(data);



      if (data && data.asignaciones && data.asignaciones.length > 0) {
        subjectsByTeacherIdRef.value = data;
        existenAsignaciones.value = true
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
// Chequear si hay duplicados entre las asignaturas del array y las que estén en la BD
const eliminarDuplicados = () => {
  if (subjectsByTeacherIdRef.value && subjectsByTeacherIdRef.value.asignaciones) {
    // recorro el array y extraigo todos los Ids de las asignaciones que haya
    const subjectsIdsOfTeacher = subjectsByTeacherIdRef.value.asignaciones.map(subjectsTeacher => subjectsTeacher.subject.id);
    const selectedSubjectsIds = selectedSubjects.value.map(subjectSelected => subjectSelected.id);

    const repetido = subjectsIdsOfTeacher.some(id => selectedSubjectsIds.includes(id)); // verifico si alguna coincide, retorna true o false

    const duplicados = subjectsIdsOfTeacher.filter(id => selectedSubjectsIds.includes(id)); // filtro los que incluyan el mismo id

    if (duplicados.length > 0) {
      // modifico el array dejando solo las que NO tengan el mismo id, eliminando lo que coincida
      selectedSubjects.value = selectedSubjects.value.filter(subject => !duplicados.includes(subject.id));
    }
  }
};

const fetchSubjectTeacher = async (subjectId: number, teacherId: number) => {
  try {
    const response = await fetch('http://localhost:3000/asignatura_profesor', {
      method: 'POST',
      body: JSON.stringify({
        asignatura: subjectId,
        profesor: teacherId
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      toast.add({ severity: 'success', summary: 'Creado', detail: 'Asignación creada', life: 3000 });

      const subjectTeacher = {
        profesor: {
          nombre: teacherSelected.value?.nombre,
          apellidos: teacherSelected.value?.apellidos
        },
        asignaturas: selectedSubjects.value?.toString()
      }

      const data = (await response.json()) as typeof subjectTeacher

      console.table(data)

      // reiniciar todos los valores
      teacherSelected.value = null
      selectedSubjects.value = []
      formSubmitted.value = false;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}

// para resetear los datos del formulario y poner cada ref a vacío
function borrarDatosForm() {
  formSubmitted.value = false;
  selectedSubjects.value = []
  teacherSelected.value = null
}

watch(teacherSelected, (newValue) => {
  if (newValue) {
    getSubjectsByTeacherId(newValue);
  }
});

const getValueForDatatable = () => {
  return subjectsByTeacherIdRef.value?.asignaciones || [];
};
</script>

<template>
  <div class="card col-12 xl:col-9 lg:col-12 md:col-12 sm:col-12">
    <form @submit.prevent="crearSubjectTeacher()">
      <h2>Nueva Asignación</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12 ">
          <label class="">Seleccionar profesor</label>
          <Dropdown class="" :options="teachersRefFromServer" checkmark :highlightOnSelect="false" showClear placeholder="Selecciona un profesor" v-model="teacherSelected">
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
          <InlineMessage v-if="!teacherSelected && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El profesor es obligatorio</InlineMessage>
        </div>

        <div class="field col-12 lg:col-6 md:col-12 sm:col-12 ">
          <label class="">Seleccionar Asignaturas</label>
          <MultiSelect :disabled="!teacherSelected" class="" :options="subjectsRefFromServer" optionLabel="nombre" display="chip" filter placeholder="Selecciona asignaturas"
            v-model="selectedSubjects">

          </MultiSelect>
          <InlineMessage v-if="selectedSubjects.length == 0 && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">Las asignaturas son obligatorias</InlineMessage>
        </div>
        <div class="field col-12">
          <Button class="justify-content-center w-auto h-auto" icon="pi pi-send" iconPos="left" type="submit" label="Enviar"></Button>
          <Button class="justify-content-center w-auto h-auto" severity="secondary" icon="pi pi-trash" iconPos="left" label="Borrar" @click="borrarDatosForm()"></Button>
        </div>
        <!-- Tabla del profesor seleccionado -->
        <div v-if="teacherSelected" class="field col-5">
          <label class="text-xl text-800 font-bold pl-1">Datos del profesor</label>
          <DataTable :value="[teacherSelected]" class="pt-1" tableStyle="width: 30rem" :pt="{
      table: {
        class: 'mt-0 pl-1',
        style: { 'border': 'none' }
      }
    }
      ">
            <Column field="nombre" header="Nombre" Class="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
            <Column field="apellidos" header=" Apellidos" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
            <Column field="email" header="Email" headerClass="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"> </Column>
          </DataTable>
        </div>
        <div v-if="teacherSelected && existenAsignaciones" class="field col-5">
          <label class="text-xl text-800 font-bold pl-1">Asignaturas ya asignadas</label>
          <DataTable :value="getValueForDatatable()" class="pt-1" tableStyle="width: 30rem" :paginator="true" :rows="5" :pt="{
      paginator: {
        paginatorWrapper: { class: 'col-12 flex justify-content-center' },
        firstPageButton: { class: 'w-auto' },
        previousPageButton: { class: 'w-auto' },
        pageButton: { class: 'w-auto' },
        nextPageButton: { class: 'w-auto' },
        lastPageButton: { class: 'w-auto' },
      },
      table: {
        class: 'mt-0 pl-1',
        style: { 'border': 'none' }
      }
    }
      ">
            <Column field="subject.nombre" header="Asignaturas" Class="h-2rem pl-1" bodyClass="p-0 pl-1 h-3rem"></Column>
          </DataTable>
        </div>

        <div>
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
