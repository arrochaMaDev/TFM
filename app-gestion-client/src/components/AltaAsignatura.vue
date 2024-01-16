<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import Popup from './Popup.vue'

// FETCH PARA ENVIAR DATOS DE LA ASIGNATURA A LA BD:

const buscarAsignatura = (): boolean => {
  for (const asignatura of asignaturasRefFromServer.value) {
    if (asignatura.nombre.toLowerCase() === asignaturaRef.value.toLowerCase()) {
      return true // Si se encuentra la asignatura, devuelve true
    }
  }
  return false // Si no se encuentra la asignatura, devuelve false
}

function crearAsignatura() {
  // Buscar si ya está en el array
  let repetido: boolean = buscarAsignatura()
  if (!repetido) {
    fetch('http://localhost:3000/asignaturas', {
      method: 'POST',
      body: JSON.stringify({
        nombre: asignaturaRef.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
        } else {
          alert('Asignatura creada')
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error)
        alert('Ha ocurrido un error')
      })
  } else {
    alert('La asignatura ya existe')
  }

  // Imprimo los datos que he enviado a la base de datos
  const asignatura = asignaturaRef.value
  console.log(asignatura)
  resetearDatosForm()
}

//Referencias del formulario
let asignaturaRef: Ref<string> = ref('')

console.log(asignaturaRef.value)

// para resetear los datos del formulario y poner cada ref a vacío
function resetearDatosForm() {
  asignaturaRef.value = ''
}

// OBTENER LA LISTA DE ASIGNATURAS DEL SERVIDOR:
let asignaturasRefFromServer: Ref<
  {
    id: number
    nombre: string
  }[]
> = ref([])

function getAsignaturasData() {
  fetch('http://localhost:3000/asignaturas', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        //   loadingStore.loadingTrue()
        //   await new Promise((resolve) => setTimeout(resolve, 2000))
        const data = (await response.json()) as {
          id: number
          nombre: string
        }[]
        asignaturasRefFromServer.value = data
        console.log(data)
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud:', error)
      alert('Ha ocurrido un error')
    })
}
getAsignaturasData()

// BORRAR ASIGNATURA
let popupVisible: Ref<boolean> = ref(false) // ref para ocultar o mostrar el popup
let idAsingaturaSeleccionada: Ref<number | null> = ref(null)

const borrarAsignatura = async () => {
  // funcion con async/await y try/catch en vez de fetch con .then y .catch
  try {
    const response = await fetch(
      `http://localhost:3000/asignaturas/${idAsingaturaSeleccionada.value}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
    if (response.status === 204) {
      alert('Asignatura borrada con éxito')
      popupVisible.value = false
      getAsignaturasData()
    } else {
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
    popupVisible.value = false
  }
}

const cancelarBorrar = () => {
  // si se da click en no se cancela el borrado
  popupVisible.value = false
  idAsingaturaSeleccionada.value = null
}

// Confirmación borrar asignatura
const mostrarPopup = (id: number) => {
  // si se da click en si, se muestra el popup y recibe el id del alumno a borrar
  idAsingaturaSeleccionada.value = id
  popupVisible.value = true
}
let modoEditar: Ref<boolean> = ref(false)
let asignaturaEditarId: Ref<number | null> = ref(null)

const editando = (asignatura: any) => {
  asignaturaRef.value = asignatura.nombre
  modoEditar.value = true
  console.log(asignatura.id)
  asignaturaEditarId.value = asignatura.id
}

const editarAsignatura = async () => {
  const repetido: boolean = buscarAsignatura()
  if (!repetido) {
    try {
      const response = await fetch(`http://localhost:3000/asignatura/${asignaturaEditarId.value}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre: asignaturaRef.value
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (response.ok) {
        alert('Asignatura Editada')
      } else {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      alert('Ha ocurrido un error')
    }
  }
  if (repetido) {
    alert('Ya existe una asignatura con ese nombre')
  }
  modoEditar.value = false
  resetearDatosForm()
  getAsignaturasData()
}

// ORDENAR EL ARRAY DE ASIGNATURAS PARA MOSTRARLAS POR NOMBRE
// FUNCION ELIMINAR TILDES
function eliminarTildes(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
const asignaturasRefFromServerOrdenadas = computed(() =>
  asignaturasRefFromServer.value.slice().sort((a, b) => {
    const nombreA = eliminarTildes(a.nombre.toLowerCase())
    const nombreB = eliminarTildes(b.nombre.toLowerCase())
    if (nombreA < nombreB) {
      return -1
    }
    if (nombreA > nombreB) {
      return 1
    }
    return 0
  })
)
</script>

<template>
  <div class="centradoVertical">
    <div class="form">
      <h1 class="green">Alta Asignatura</h1>
      <form @submit.prevent="crearAsignatura(), getAsignaturasData()">
        <label class="green">Asignatura</label>
        <input type="text" name="" id="AsignaturaInput" required v-model="asignaturaRef" />
        <button type="reset" @click="resetearDatosForm()">Resetear</button>
        <button type="submit" v-if="!modoEditar">Enviar</button>
        <button type="button" v-if="modoEditar" @click="editarAsignatura()">Actualizar</button>
      </form>
    </div>
    <div>
      <table>
        <tr>
          <th colspan="3">LISTADO DE ASIGNATURAS</th>
        </tr>
        <tr
          id="asignatura"
          v-for="asignatura in asignaturasRefFromServerOrdenadas"
          :key="asignatura.id"
        >
          {{
            asignatura.nombre
          }}
          <td>
            <button type="button" @click="editando(asignatura)">Editar</button>
          </td>
          <td><button type="button" @click="mostrarPopup(asignatura.id)">Borrar</button></td>
        </tr>
      </table>
      <Popup v-if="popupVisible" @confirmar="borrarAsignatura" @cancelar="cancelarBorrar"></Popup>
    </div>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  width: 300px;

  & Form {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  & input {
    height: 25px;
    border-radius: 5px;
  }

  & button {
    margin-top: 10px;
    width: 100px;
    height: 25px;
    background-color: hsla(160, 100%, 37%, 1);
    color: white;
    border: 1px solid hsla(160, 100%, 37%, 1);
    border-radius: 5px;
  }
}

.vistaPrevia {
  display: flex;
  flex-direction: column;
  width: 1000px;
}

table {
  width: 1000px;
  border: 1px solid #ffffff;

  & th {
    background-color: rgb(79, 90, 86);
  }

  & td {
    width: fit-content;
    text-align: left;
    vertical-align: top;
    border: 1px solid #ffffff;
    border-spacing: 0;
  }
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
}
</style>
