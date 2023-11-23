import { defineStore } from 'pinia'

export const useEditingStore = defineStore('editar', {
  state: () => ({
    isEditing: false
  }),
  actions: {
    editarTrue() {
      this.isEditing = true
      return true
    },
    editarFalse() {
      this.isEditing = false
      return false
    }
  }
})
