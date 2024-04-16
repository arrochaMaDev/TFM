<script setup lang="ts">
import router from '@/router'
import { inject, onMounted, ref, type Ref } from 'vue'
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import type { VueCookies } from 'vue-cookies';
import { useLoggedStore } from '@/stores/isLogged';


const toast = useToast();

// Ver si está logeado
const loggedStore = useLoggedStore()
const $cookies = inject<VueCookies>('$cookies');
const user: Ref<{
  email: string | undefined,
  username: string | undefined,
  isValid: string | undefined,
  permiso: string | undefined,
  id: string | undefined
}> = ref({
  email: undefined,
  username: undefined,
  isValid: undefined,
  permiso: undefined,
  id: undefined,
})
const isLogged: Ref<boolean> = ref(false)

onMounted(() => {
  user.value = $cookies?.get('user')
  if (user.value) {
    console.log('Cookie value:', user);
    loggedStore.isLoggedTrue()
    isLogged.value = true
    router.push('/')
  } else {
    router.push('/login')
    console.log('Cookie "user" no encontrada');
  }
})

//Referencias del formulario
const userRef = {
  email: ref<string | undefined>(undefined),
  pass: ref<string | undefined>(undefined),
}

// VALIDAR DATOS DEL FORMULARIO
const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const formSubmitted = ref(false); // variable para avisos con InlineText

const loginUser = async () => {
  formSubmitted.value = true;
  let isValid = true

  if (userRef.email.value && !patronEmail.test(userRef.email.value)) {
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Introduzca un email válido', life: 3000 });
    isValid = false
  }

  if (isValid)
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify({
          email: userRef.email.value,
          pass: userRef.pass.value
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 403) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Usuario o contraseña incorrectos', life: 3000 });
        }
        throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
      } else {

        // if (userRef.email.value) {
        //   localStorage.setItem('email', userRef.email.value);
        // }
        loggedStore.isLoggedTrue()
        router.push({ path: '/' })
      }
    } catch (error) {
      console.log('Error en la solicitud:', error)
    }
}

const borrarDatosForm = () => {
  userRef.email.value = undefined
  userRef.pass.value = undefined
  formSubmitted.value = false
}
</script>

<template>
  <div id="container" class="w-full flex justify-content-center align-items-center h-screen">
    <div class="card w-auto grid p-8">
      <div id="header" class="col-6 col-offset-3 text-center ">
        <h2 class="text-900 text-4xl mb-8">Login</h2>
      </div>
      <div id="formulario" class="col-6">
        <form @submit.prevent="loginUser()">

          <label for="email" class="block text-900 text-xl font-medium mb-2">Email</label>
          <InputText id="email" type="text" placeholder="Email" class="w-full" style="padding: 1rem" v-model="userRef.email.value" />
          <InlineMessage v-if="!userRef.email.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">El email es obligatorio</InlineMessage>

          <label for="password" class="block text-900 font-medium text-xl mb-2 mt-6">Password</label>
          <Password id="password" v-model="userRef.pass.value" placeholder="Password" :toggleMask="true" :feedback="false" class="w-full" inputClass="w-full" :inputStyle="{ padding: '1rem' }">
          </Password>
          <InlineMessage v-if="!userRef.pass.value && formSubmitted" class="bg-transparent justify-content-start p-0 pt-1">La contraseña es obligatoria</InlineMessage>

          <div class="flex justify-content-end">
            <a class="font-medium no-underline text-right cursor-pointer pt-1" style="color: var(--primary-color)">Olvidé mi contraseña</a>
          </div>
          <div id="button" class=" flex justify-content-center">
            <Button type="submit" label="Login" severity="primary" class="w-12rem h-3rem mt-5"></Button>
          </div>
        </form>
      </div>
      <div id="logo" class="col-6 flex justify-content-center">
        <img src="../utils/img/loading.png" class="mb-5 w-30rem" />
      </div>
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

</template>

<style scoped>
#container {
  transform: translateX(-150px)
}
</style>
