<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { ref, type Ref } from 'vue'
import { useToast } from "primevue/usetoast";
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import Toast from 'primevue/toast';


const toast = useToast(); // componente para mostrar mensajes de alerta

const showError = () => {
  toast.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
};
const showSuccess = () => {
  toast.add({ severity: 'success', summary: 'Success Message', detail: 'Usuario creado', life: 3000 });
};

//Referencias del formulario
let userUsernameRef: Ref<string> = ref('')
let userEmailRef: Ref<string> = ref('')
let userPassRef: Ref<string> = ref('')
let userPassRefConfirmed: Ref<string> = ref('')
let userPermisoRef: Ref<number | null> = ref(null)

const permiso = ref([
  { name: 'Alumno', code: 0 },
  { name: 'Profesor', code: 1 },
  { name: 'Administrador', code: 9 },
])

// FUNCION PARA VALIDAR DATOS
const usernameError: Ref<string | null> = ref(null);
const emailError: Ref<string | null> = ref(null);
const passError: Ref<string | null> = ref(null);
const permisoError: Ref<string | null> = ref(null);

const validarUsername = () => {
  if (userUsernameRef.value == '') {
    usernameError.value = 'Debe seleccionar un nombre de usuario';
  } else {
    usernameError.value = null;
  }
};

const validarEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (userEmailRef.value == '') {
    emailError.value = 'El correo electrónico es obligatorio';
  } else if (!emailRegex.test(userEmailRef.value)) {
    emailError.value = 'Ingrese un correo electrónico válido';
  } else {
    emailError.value = null;
  }
};

const validarPass = () => {
  if (!userPassRef.value || !userPassRefConfirmed.value) {
    passError.value = 'La contraseña es obligatoria';
  } else if (userPassRef.value !== userPassRefConfirmed.value) {
    passError.value = 'Las contraseñas no coinciden';
  } else {
    passError.value = null;
  }
};

const validarPermiso = () => {
  if (userPermisoRef.value == null) {
    permisoError.value = 'Debe seleccionar un permiso';
  } else {
    permisoError.value = null;
  }
};

// FETCH PARA ENVIAR DATOS DEL USUARIO A LA BD:
const crearUsuario = async () => {
  validarUsername()
  validarEmail()
  validarPass()
  validarPermiso()
  if (usernameError.value == null && passError.value == null && emailError.value == null && permisoError.value == null) {
    try {
      const response = await fetch('http://localhost:3000/user', {
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
      if (!response.ok) {
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        console.log('Datos recibidos:', response);
        showSuccess()
        // Imprimo los datos por consola
        // const datosUsuario = [
        //   userUsernameRef.value,
        //   userEmailRef.value,
        //   userPassRef.value,
        //   userPermisoRef.value
        // ]
        // console.log(datosUsuario)
      }
    } catch (error) {
      console.error('Error en la solicitud:', error)
      showError()
    }
  }
}


</script>

<template>
  <Toast class="caca" />
  <Button label="Sign In" icon="pi pi-user" class="w-full p-3 text-xl text-center" style="background-color: var(--primary-color); border:none" @click="showError()">Enviar</Button>
  <div class="w-7 surface-card py-8 px-5 sm:px-8 ">
    <div class="text-center mb-5">
      <div class="text-900 text-3xl font-medium mb-3">Nuevo Usuario</div>
    </div>

    <label for="username" class="block text-900 font-medium text-xl mb-2">Username</label>
    <InputText id="username" type="text" class="w-full mb-3" v-model="userUsernameRef" @input="validarUsername()">
      > </InputText>
    <InlineMessage v-if="usernameError" severity="error">{{ usernameError }}</InlineMessage>


    <label for="email" class="block text-900 font-medium text-xl mb-2">Email</label>
    <InputText id="email" type="email" class="w-full mb-3" v-model="userEmailRef" @input="validarEmail"> </InputText>
    <InlineMessage v-if="emailError" severity="error">{{ emailError }}</InlineMessage>

    <label for="password" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
    <Password id="password" required v-model="userPassRef" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"
      @input="validarPass()">
    </Password>
    <InlineMessage v-if="passError" severity="error">{{ passError }}</InlineMessage>

    <label for="password" class="block text-900 font-medium text-xl mb-2">Repetir contraseña</label>
    <Password id="password" v-model="userPassRefConfirmed" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"
      @input="validarPass()">
    </Password>
    <InlineMessage v-if="passError" severity="error">{{ passError }}</InlineMessage>

    <label for="permiso" class="block text-900 font-medium text-xl mb-2">Permiso</label>
    <Dropdown id="permiso" v-model="userPermisoRef" :options="permiso" optionLabel="name" optionValue="code" showClear class="mb-3" @input="validarPermiso()">
    </Dropdown>
    <InlineMessage v-if="permisoError" severity="error">{{ permisoError }}</InlineMessage>

    <Toast />
    <Button label="Sign In" icon="pi pi-user" class="w-full p-3 text-xl text-center" style="background-color: var(--primary-color); border:none" @click="crearUsuario()">Enviar</Button>
  </div>
</template>

<style scoped>
/* .form {
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
} */
</style>
