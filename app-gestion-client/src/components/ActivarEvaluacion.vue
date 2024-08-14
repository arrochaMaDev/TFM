<script setup lang="ts">
import { inject, onMounted, ref, type Ref } from 'vue'
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import router from '@/router';
import { useAdminStore } from '@/stores/isAdmin';
import type { VueCookies } from 'vue-cookies';
import InputSwitch from 'primevue/inputswitch';


// VERIFICAR SI SE ES ADMINISTRADOR
const adminStore = useAdminStore()
const $cookies = inject<VueCookies>('$cookies')
const isAdmin = ref(adminStore.isAdmin)
const toast = useToast();


onMounted(async () => {
  const userCookie = $cookies?.get('user') // si no existe, userCookie es null
  // console.log(userCookie)
  if (userCookie?.permiso == '9') {
    adminStore.isAdminTrue()
  }
  else if (!isAdmin.value || userCookie?.permiso == null || userCookie?.permiso != '9') {
    adminStore.isAdminFalse()
    toast.add({ severity: 'info', summary: 'No tienes permiso', detail: 'No tienes permiso de administrador para ver esta página', group: 'tc', life: 3000, });

    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  await getEvaluacionActiva()
})

//Variables del formulario
const matriculaActivaDb: Ref<{
  activeEval1: number
  activeEval2: number
  activeEval3: number
}> = ref({
  activeEval1: 0,
  activeEval2: 0,
  activeEval3: 0
})

const matriculaActiva: Ref<{
  activeEval1: boolean
  activeEval2: boolean
  activeEval3: boolean
}> = ref({
  activeEval1: false,
  activeEval2: false,
  activeEval3: false
})

//OBTENER EL ESTADO DE LA EVALUACION
const getEvaluacionActiva = async () => {
  try {
    const response = await fetch('http://localhost:3000/activeEvaluacion/0', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      const data = await response.json()

      matriculaActivaDb.value = data
      console.log(matriculaActivaDb.value)

      if (matriculaActivaDb.value.activeEval1 == 1) {
        matriculaActiva.value.activeEval1 = true
      } else {
        matriculaActiva.value.activeEval1 = false
      }
      if (matriculaActivaDb.value.activeEval2 == 1) {
        matriculaActiva.value.activeEval2 = true
      } else {
        matriculaActiva.value.activeEval2 = false
      }
      if (matriculaActivaDb.value.activeEval3 == 1) {
        matriculaActiva.value.activeEval3 = true
      } else {
        matriculaActiva.value.activeEval3 = false
      }
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  }
}


// CAMBIAR EL ESTADO DE LA EVALUACION
const editarActivarEvaluacion = async (NumeroEvaluacion: number) => {

  switch (NumeroEvaluacion) {
    case 1:
      matriculaActivaDb.value.activeEval1 = matriculaActiva.value.activeEval1 ? 1 : 0
      toast.add({
        // severity: matriculaActiva.value.activeEval1 ? 'success' : 'error',
        severity: 'info',
        summary: matriculaActiva.value.activeEval1 ? 'Activada' : 'Desactivada',
        detail: matriculaActiva.value.activeEval1 ? 'Primera evaluación activada' : 'Primera evaluación desactivada',
        life: 3000
      });
      break

    case 2:
      matriculaActivaDb.value.activeEval2 = matriculaActiva.value.activeEval2 ? 1 : 0
      toast.add({
        severity: 'info',
        summary: matriculaActiva.value.activeEval2 ? 'Activada' : 'Desactivada',
        detail: matriculaActiva.value.activeEval2 ? 'Segunda Evaluación activada' : 'Segunda Evaluación desactivada',
        life: 3000
      });
      break

    case 3:
      matriculaActivaDb.value.activeEval3 = matriculaActiva.value.activeEval3 ? 1 : 0
      toast.add({
        severity: 'info',
        summary: matriculaActiva.value.activeEval3 ? 'Activada' : 'Desactivada',
        detail: matriculaActiva.value.activeEval3 ? 'Tercera Evaluación activada' : 'Tercera Evaluación desactivada',
        life: 3000
      });
      break
  }

  try {
    const response = await fetch('http://localhost:3000/activeEvaluacion/0', {
      method: 'PUT',
      body: JSON.stringify({
        activeEval1: matriculaActivaDb.value.activeEval1,
        activeEval2: matriculaActivaDb.value.activeEval2,
        activeEval3: matriculaActivaDb.value.activeEval3
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    }
    // else {
    // }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    toast.add({ severity: 'warn', summary: 'Error', detail: 'Ha ocurrido un error', life: 3000 });
  } finally {
    await getEvaluacionActiva()
  }
}
</script>
<template>
  <Toast position="top-center" group="tc" :pt="{
    container: {
      class: 'align-items-center m-8 w-max',
    },
    closeButton: {
      class: 'border-1'
    }
  }
    "></Toast>
  <div class="card w-max" v-if="isAdmin">
    <h2>Activar evaluaciones</h2>
    <div class="mt-3 w-max">
      <div class=" col-12 flex align-items-center justify-content-between">
        <label class="text-xl">1ª Evaluación</label>
        <InputSwitch class="ml-2" v-model="matriculaActiva.activeEval1" @change="editarActivarEvaluacion(1)" />
      </div>
      <div class=" col-12 flex align-items-center justify-content-between">
        <label class="text-xl">2ª Evaluación</label>
        <InputSwitch class="ml-2" v-model="matriculaActiva.activeEval2" @change="editarActivarEvaluacion(2)" />
      </div>
      <div class=" col-12 flex align-items-center justify-content-between">
        <label class="text-xl">3ª Evaluación</label>
        <InputSwitch class="ml-2" v-model="matriculaActiva.activeEval3" @change="editarActivarEvaluacion(3)" />
      </div>
    </div>
  </div>
  <Toast></Toast>
</template>
<style></style>