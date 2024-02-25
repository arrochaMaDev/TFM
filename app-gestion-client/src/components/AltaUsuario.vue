<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

//Referencias del formulario
const userRef = {
  username: ref<string>(''),
  email: ref<string>(''),
  pass: ref<string>(''),
  passRepeated: ref<string>(''),
  permisoSelected: ref<string | null>(null),
  permiso: ref<number | null>(null)
}


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



watch(selectedPermisoRef, () => {
  if (selectedPermisoRef.value === 'Alumno') userPermisoRef.value = 0
  else if (selectedPermisoRef.value === 'Profesor') userPermisoRef.value = 1
  else if (selectedPermisoRef.value === 'Administrador') userPermisoRef.value = 9
  else userPermisoRef.value = null
})
console.log(userPermisoRef.value)

// para resetear los datos del formulario y poner cada ref a vacío
function resetearDatosForm() {
  userUsernameRef.value = ''
  userEmailRef.value = ''
  userPassRef.value = ''
  userPassRefConfirmed.value = ''
  selectedPermisoRef.value = ''
}

//mostrar o ocultar contraseña
let verPass: Ref<boolean> = ref(false)
const ToggleVerPass = () => {
  verPass.value = !verPass.value
}
</script>



<template>
  <div class="card col-12 lg:col-9 md:col-12 sm:col-12">
    <form @submit.prevent="crearUsuario()">
      <h2>Nuevo <Ul></Ul>suario</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Nombre</label>
          <InputText class="" id="username" v-model="studentRef.nombre.value" />
          <InlineMessage v-if="!studentRef.nombre.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El nombre es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Email</label>
          <InputText class="" id="emailInput" v-model="studentRef.email.value" />
          <InlineMessage v-if="!studentRef.email.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El email es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Contraseña</label>
          <InputText class="" id="email" v-model="studentRef.apellidos.value" />
          <InlineMessage v-if="!studentRef.apellidos.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El apellido es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Repetir contraseña</label>
          <InputText class="" id="dniInput" v-model="studentRef.dni.value" />
          <InlineMessage v-if="!studentRef.dni.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El DNI es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-12 sm:col-12">
          <label class="">Permiso</label>
          <Dropdown class="" :options="provincias" optionLabel="label" checkmark :highlightOnSelect="false" showClear id="provinciaInput" placeholder="Selecciona una provincia"
            v-model="studentRef.provincia.value" />
          <InlineMessage v-if="!studentRef.provincia.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La provincia es obligatoria</InlineMessage>
        </div>
        <div class="field col-12 mt-2 pl-1 mb-0">
          <Button class="justify-content-center w-auto h-auto" icon="pi pi-send" iconPos="left" type="submit" label="Enviar"></Button>
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
  }"></Toast>
</template>

<style scoped></style>
