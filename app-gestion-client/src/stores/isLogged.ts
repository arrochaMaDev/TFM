import { defineStore } from 'pinia'

export const useLoggedStore = defineStore('isLogged', {
  state: () => ({
    isLogged: false
  }),
  actions: {
    isLoggedTrue() {
      this.isLogged = true
      return true
    },
    isLoggedFalse() {
      this.isLogged = false
      return false
    }
  }
})
