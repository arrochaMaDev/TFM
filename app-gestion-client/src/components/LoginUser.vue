<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import router from '@/router';
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore() // store del Spinner

const loginUser = async () => {
  try {
    loadingStore.loadingTrue()

    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({
        email: userEmailRef.value,
        pass: userPassRef.value,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 403) {
        alert('Usuario o contraseña incorrectos')
      }
      throw new Error(`error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      localStorage.setItem('email', userEmailRef.value)
      // getUserData()
      router.push({
        path: '/about'
      })
      setTimeout(() => {
        location.reload()
      }, 100)
      await new Promise((resolve) => setTimeout(resolve, 4000))
    }
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la operación
    console.log('Error en la solicitud:', error)
    // alert('Ha ocurrido un error');
  } finally {
    loadingStore.loadingFalse()
  }
}


//Referencias del formulario
let userEmailRef: Ref<string> = ref('')
let userPassRef: Ref<string> = ref('')
let checked: Ref<boolean> = ref(false);


const logoUrl = computed(() => {
  // return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
  return `../utils/img/AlcaravanLOGO.svg`;
});


</script>

<template>
  <div>
    <div class="flex flex-column align-items-center justify-content-center">
      <img :src="logoUrl" alt="Alcaraván logo" class="mb-5 w-6rem flex-shrink-0" />
      <div style="border-radius: 56px; padding: 0.2rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Bienvenido/a!</div>
            <span class="text-600 font-medium">Inicia sesión para continuar</span>
          </div>
          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
            <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="userEmailRef" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
            <Password id="password1" v-model="userPassRef" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }">
            </Password>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <Checkbox id="rememberme1" binary class="mr-2" v-model="checked"></Checkbox>
                <label for="rememberme1">Remember me</label>
              </div>
              <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
            </div>
            <Button label="Sign In" class="w-full p-3 text-xl" style="background-color: var(--primary-color); border:none" @click="loginUser()">
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}

button {
  /* background-color: var(--primary-color); */
  /* border: none; */
}
</style>
