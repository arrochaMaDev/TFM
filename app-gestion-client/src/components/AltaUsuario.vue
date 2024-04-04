<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';


/* TODO GENERAR USERNAME */
const generarUsername = (nombre: string, apellido1: string, apellido2: string) => {

  // Obtener las dos primeras letras de cada variable y convertirlas a minúsculas
  const inicialesNombre: string = nombre.slice(0, 2).toLowerCase();
  const inicialesApellido1: string = apellido1.slice(0, 2).toLowerCase();
  const inicialesApellido2: string = apellido2.slice(0, 2).toLowerCase();

  // Concatenar las iniciales
  const username: string = inicialesNombre + inicialesApellido1 + inicialesApellido2;

  return username;
}

const nombre: string = "Laura";
const apellido1: string = "Pérez";
const apellido2: string = "Pérez";

const iniciales: string = generarUsername(nombre, apellido1, apellido2);
console.log("Iniciales:", iniciales); // Salida esperada: "lapepe"

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


const toast = useToast();

// REFERENCIAS DEL FORMULARIO
const userRef = {
  username: ref<string | undefined>(undefined),
  email: ref<string | undefined>(undefined),
  pass: ref<string | undefined>(undefined),
  permiso: ref<number | undefined>(undefined)
}
const userPassRefConfirmed: Ref<string | undefined> = ref(undefined)
const formSubmitted = ref(false); // variable para avisos con InlineText

// VALIDAR DATOS DEL FORMULARIO
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// FETCH PARA ENVIAR DATOS DEL USUARIO A LA BD:
const crearUsuario = async () => {
  console.log(userRef.permiso.value)
  formSubmitted.value = true;
  let isValid = true

  if (userRef.pass.value !== userPassRefConfirmed.value) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Las contraseñas no coinciden', life: 3000 });
    isValid = false
  }
  if (userRef.email.value && !patronEmail.test(userRef.email.value)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }
  if (!userRef.username.value || !userRef.email.value || !userRef.pass.value || userRef.permiso.value == undefined) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Por favor, rellene todos los campos', life: 3000 });
    isValid = false
  }
  if (isValid) {
    try {
      const response = await fetch('http://localhost:3000/user', {
        method: 'POST',
        body: JSON.stringify({
          username: userRef.username.value,
          email: userRef.email.value,
          pass: userRef.pass.value,
          permiso: Number(userRef.permiso.value)
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        toast.add({ severity: 'success', summary: 'Creado', detail: 'Usuario creado', life: 3000 });

        const datosUsuario = [
          userRef.username.value,
          userRef.email.value,
          userRef.pass.value,
          userRef.permiso.value
        ]
        console.table(datosUsuario)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
    }
  }
}

// Verificar contraseñas coinciden
const passValid = ref(true)

watch(userPassRefConfirmed, () => {
  if (userPassRefConfirmed.value !== userRef.pass.value) {
    passValid.value = false
  }
  else {
    passValid.value = true
  }
})


// Dropdown permisos 
const permisos = ref([
  { name: 'Alumno', code: 0 },
  { name: 'Profesor', code: 1 },
  { name: 'Administrador', code: 9 },
]);

// borrar datos del form y valores por defecto
const borrarDatosForm = () => {
  userRef.username.value = undefined
  userRef.email.value = undefined
  userRef.pass.value = undefined
  userRef.permiso.value = undefined
  userPassRefConfirmed.value = undefined
  formSubmitted.value = false
}

</script>

<template>
  <div class="card col-12 xl:col-9 lg:col-12 md:col-12 sm:col-12">
    <form @submit.prevent="crearUsuario()">
      <h2>Nuevo Usuario</h2>
      <div class="p-fluid formgrid grid">
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Username</label>
          <InputText class="" id="username" v-model="userRef.username.value" />
          <InlineMessage v-if="!userRef.username.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El username es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-6 md:col-12 sm:col-12">
          <label class="">Email</label>
          <InputText class="" id="email" v-model="userRef.email.value" />
          <InlineMessage v-if="!userRef.email.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El email es obligatorio</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Contraseña</label>
          <Password id="pass" toggleMask :feedback="false" v-model="userRef.pass.value" />
          <InlineMessage v-if="!userRef.pass.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La contraseña es obligatoria</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12">
          <label class="">Repeat Pass</label>
          <Password class="" id="passConfirmed" toggleMask :feedback="false" v-model="userPassRefConfirmed" />
          <InlineMessage v-if="!userPassRefConfirmed && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">Debe repetir la contraseña</InlineMessage>
          <InlineMessage v-if="!passValid" class="bg-transparent justify-content-start p-0 pt-1">Las contraseñas no coindiden</InlineMessage>
        </div>
        <div class="field col-12 lg:col-4 md:col-4 sm:col-12 ">
          <label class="">Seleccionar permiso</label>
          <Dropdown class="" id="permisos" :options="permisos" optionLabel="name" optionValue="code" checkmark :highlightOnSelect="false" showClear placeholder="Selecciona un permiso"
            v-model="userRef.permiso.value" />
          <InlineMessage v-if="userRef.permiso.value == undefined && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El permiso es obligatorio</InlineMessage>
        </div>
        <div class="field col-12">
          <Button class="justify-content-center w-auto h-auto mr-2" icon="pi pi-send" iconPos="left" type="submit" label="Enviar"></Button>
          <Button class="justify-content-center w-auto h-auto" severity="secondary" icon="pi pi-trash" iconPos="left" label="Borrar" @click="borrarDatosForm()"></Button>
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
