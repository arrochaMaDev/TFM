import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('isDashboard', {
  state: () => ({
    isDashboard: false
  }),
  actions: {
    isDashboardTrue() {
      this.isDashboard = true
      return true
    },
    isDashboardFalse() {
      this.isDashboard = false
      return false
    }
  }
})
