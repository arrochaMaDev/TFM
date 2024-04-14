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
