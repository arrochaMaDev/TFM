<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { ref, type Ref } from 'vue'
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import { useToast } from "vue-toastification";
import SelectButton from 'primevue/selectbutton';



// COMPONENTE PARA USAR MENSAJES DE ALERTA
const toast = useToast();

const showError = () => {
  toast.error("Ha ocurrido un error", {
    timeout: 3000
  });
}
const showSuccess = () => {
  toast.success("Usuario creado", {
    timeout: 3000
  });
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
  <!-- <div class="container d-flex align-items-center"> -->
  <div class="card mb-25 border-0 rounded-0 bg-white letter-spacing w-5">
    <div class="card-body p-15 p-sm-20 p-md-25 p-lg-30">

      <div class="text-center mb-5">
        <div class="card-title fw-bold text-3xl mb-15 mb-md-20 mb-lg-25">Nuevo Usuario</div>
      </div>

      <label for="username" class="d-flex form-label fw-semibold text-xl">Username</label>
      <InputText id="username" type="text" class="form-control shadow-none text-black fs-md-15 fs-lg-16" v-model="userUsernameRef" @input="validarUsername()">
        > </InputText>
      <InlineMessage v-if="usernameError" severity="error" class="bg-transparent">{{ usernameError }}</InlineMessage>

      <label for="email" class="d-flex form-label fw-semibold text-xl">Email</label>
      <InputText id="email" type="email" class="form-control shadow-none text-black fs-md-15 fs-lg-16" v-model="userEmailRef" @input="validarEmail"> </InputText>
      <InlineMessage v-if="emailError" severity="error" class="bg-transparent">{{ emailError }}</InlineMessage>

      <label for="password" class="d-flex form-label fw-semibold text-xl">Contraseña</label>
      <Password id="password" required v-model="userPassRef" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full mb-3" input-class="form-control w-full"
        :inputStyle="{ padding: '1rem' }" @input="validarPass()">
      </Password>
      <InlineMessage v-if="passError" severity="error" class="bg-transparent">{{ passError }}</InlineMessage>

      <label for="password" class="d-flex form-label fw-semibold text-xl">Repetir contraseña</label>
      <Password id="password" v-model="userPassRefConfirmed" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full mb-3" input-class="form-control w-full"
        :inputStyle="{ padding: '1rem' }" @input="validarPass()">
      </Password>
      <InlineMessage v-if="passError" severity="error" class="bg-transparent">{{ passError }}</InlineMessage>

      <label for="permiso" class="d-flex form-label fw-semibold text-xl">Permiso</label>
      <Dropdown id="permiso" v-model="userPermisoRef" :options="permiso" optionLabel="name" optionValue="code" showClear @input="validarPermiso()" class="form-control">
        <!-- input-class="form-control" :input-style="{ 'width': '500px' }" -->

      </Dropdown>
      <InlineMessage v -if=" permisoError" severity="error" class="bg-transparent">{{ permisoError }}</InlineMessage>

      <Toast />
      <Button label="Sign In" icon="pi pi-user" class="btn btn-primary d-flex justify-content-center text-md p-3" style="background-color: var(--primary-color); border:none"
        @click="crearUsuario()">Enviar</Button>
    </div>
  </div>
  <!-- </div> -->
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
