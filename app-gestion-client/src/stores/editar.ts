import { defineStore } from 'pinia'

export const useEditingStore = defineStore('editar', {
  state: () => ({
    state: false
  }),
  actions: {
    editarTrue() {
      this.state = true
      return true
    },
    editarFalse() {
      this.state = false
      return false
    }
  }
})
