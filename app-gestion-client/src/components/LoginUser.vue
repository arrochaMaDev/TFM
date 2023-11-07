<script setup lang="ts">
import { ref, type Ref } from 'vue'

//FETCH POST LOGIN A LA BASE DE DATOS
const loginUser = () => {
  fetch('http://localhost:3000/login', {
    method: 'POST',
    body: JSON.stringify({
      email: userEmailRef.value,
      pass: userPassRef.value
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 403) {
          alert('Usuario o contraseña incorrectos')
        }
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {
        alert(`Bienvenido ${userEmailRef.value}`)
      }
    })
    .catch((error) => {
      // console.error('Error en la solicitud:', error)
      console.log('Error en la solicitud:', error)
      // alert('Ha ocurrido un error')
    })
}

//Referencias del formulario
let userEmailRef: Ref<string> = ref('')
let userPassRef: Ref<string> = ref('')

// para resetear los datos del formulario y poner cada ref a vacío
function resetearDatosForm() {
  userEmailRef.value = ''
  userPassRef.value = ''
}

//mostrar o ocultar contraseña
let verPass: Ref<boolean> = ref(false)
const ToggleVerPass = () => {
  verPass.value = !verPass.value
}
</script>

<template>
  <div class="centradoVertical">
    <div class="formLoginUser">
      <h1 class="green">Login</h1>
      <form @submit.prevent="loginUser">
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
        <!-- si verPass es true, entonces type=text. Si es false, entonces type=password-->
        <button type="button" id="buttonVerPass" @click="ToggleVerPass()">
          <span v-if="verPass">Ocultar Pass</span>
          <span v-else>Mostrar Pass</span>
        </button>
        <button type="reset" @click="resetearDatosForm()">Resetear</button>
        <button type="submit">Enviar</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.formLoginUser {
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

#buttonVerPass {
  cursor: pointer;
}

.class1 {
  background-color: red;
}
.class2 {
  background-color: blue;
}
</style>
