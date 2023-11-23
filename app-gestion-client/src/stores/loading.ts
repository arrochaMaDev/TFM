import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false
  }),
  actions: {
    Loadingtrue() {
      this.isLoading = true
    },
    LoadingFalse() {
      this.isLoading = false
    }
  }
})
