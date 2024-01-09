<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup lang="ts">
import { computed, inject, onMounted, ref, type Ref } from 'vue'
import type { VueCookies } from 'vue-cookies'

// FETCH PARA ENVIAR DATOS DEL USUARIO A LA BD:
function crearUsuario() {
  if (userPassRef.value !== userPassRefConfirmed.value) {
    alert('las contraseñas no coinciden')
  } else {
    fetch('http://localhost:3000/user', {
      method: 'POST',
      body: JSON.stringify({
        username: userUsernameRef.value,
        email: userEmailRef.value,
        pass: userPassRef.value,
        permiso: userPermisoRef.value
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
          alert('Usuario Creado')
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error)
        alert('Ha ocurrido un error')
      })

    // Imprimo los datos que he enviado a la base de datos
    const datosUsuario = [
      userUsernameRef.value,
      userEmailRef.value,
      userPassRef.value,
      userPermisoRef.value
    ]
    console.log(datosUsuario)
  }
}

//Referencias del formulario
let userUsernameRef: Ref<string> = ref('')
let userEmailRef: Ref<string> = ref('')
let userPassRef: Ref<string> = ref('')
let userPassRefConfirmed: Ref<string> = ref('')
let selectedPermisoRef: Ref<string> = ref('')
let userPermisoRef: Ref<number | undefined> = ref(
  computed(() => {
    if (selectedPermisoRef.value === 'Alumno') return (userPermisoRef.value = 0)
    if (selectedPermisoRef.value === 'Profesor') return (userPermisoRef.value = 1)
    if (selectedPermisoRef.value === 'Administrador') return (userPermisoRef.value = 9)
    return userPermisoRef.value
  })
)

console.log(userPermisoRef.value)

// para resetear los datos del formulario y poner cada ref a vacío
function resetearDatosForm() {
  userUsernameRef.value = ''
  userEmailRef.value = ''
  userPassRef.value = ''
  userPassRefConfirmed.value = ''
  selectedPermisoRef.value = ''
  userPermisoRef.value = undefined // lo pongo undefined para que no me aparezca ningún dato en el formulario
}

//mostrar o ocultar contraseña
let verPass: Ref<boolean> = ref(false)
const ToggleVerPass = () => {
  verPass.value = !verPass.value
}
</script>

<template>
  <div class="centradoVertical">
    <div class="form">
      <h1 class="green">Alta Usuario</h1>
      <form @submit.prevent="crearUsuario()">
        <label class="green">Username</label>
        <input type="text" name="" id="usernameInput" required v-model="userUsernameRef" />
        <label class="green">Email</label>
        <input type="email" name="" id="emailInput" required v-model="userEmailRef" />
        <label class="green">Pass</label>
        <input
          :type="verPass ? 'text' : 'password'"
          name=""
          id="passInput"
          required
          v-model="userPassRef"
        />
        <label class="green">Repeat Pass</label>
        <input
          :type="verPass ? 'text' : 'password'"
          id="passInput"
          v-model="userPassRefConfirmed"
          required
        />
        <label class="green">Permisos</label>
        <select name="" id="permisoInput" required v-model="selectedPermisoRef">
          <option selected disabled>Seleccione el permiso</option>
          <option value="Alumno">Alumno</option>
          <option value="profesor">Profesor</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button type="button" id="buttonVerPass" @click="ToggleVerPass()">
          <span v-if="verPass">Ocultar Pass</span>
          <span v-else>Mostrar Pass</span>
        </button>
        <button type="reset" @click="resetearDatosForm()">Resetear</button>
        <button type="submit">Enviar</button>
      </form>
    </div>
    <div class="vistaPrevia">
      <h2>Vista previa del usuario:</h2>
      <p>Nombre: {{ userUsernameRef }}</p>
      <p>Email: {{ userEmailRef }}</p>
      <p>Pass: {{ userPassRef }}</p>
      <p>Permisos: {{ selectedPermisoRef }}</p>
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
    cursor: pointer;
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
</style>
