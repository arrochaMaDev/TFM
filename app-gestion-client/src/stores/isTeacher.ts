import { defineStore } from 'pinia'

export const useTeacherStore = defineStore('isTeacher', {
  state: () => ({
    isTeacher: false
  }),
  actions: {
    isTeacherTrue() {
      this.isTeacher = true
      return true
    },
    isTeacherFalse() {
      this.isTeacher = false
      return false
    }
  }
})
