import { defineStore } from 'pinia'

export const useAdminStore = defineStore('isAdmin', {
  state: () => ({
    isAdmin: false
  }),
  actions: {
    isAdminTrue() {
      this.isAdmin = true
      return true
    },
    isAdminFalse() {
      this.isAdmin = false
      return false
    }
  }
})

// const $cookies = inject<VueCookies>('$cookies')

// let isAdmin: Ref<boolean> = ref(false)
// onMounted(() => {
//   const userCookie = $cookies?.get('user')
//   if (userCookie.permiso === 9) {
//     isAdmin.value = true
//   }
//   console.log(isAdmin.value)
//   if (!isAdmin.value) {
//     alert('No tienes permiso para ver esta página')
//   }
// })
