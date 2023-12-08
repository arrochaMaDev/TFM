import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false
  }),
  actions: {
    loadingTrue() {
      this.isLoading = true
    },
    loadingFalse() {
      this.isLoading = false
    }
  }
})
