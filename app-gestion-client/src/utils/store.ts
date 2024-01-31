import { reactive } from 'vue'

interface StateStore {
  open: boolean
  onChange: () => void
}

const stateStore: StateStore = reactive({
  open: false,
  onChange() {
    stateStore.open = !stateStore.open
  }
})

export default stateStore

// import { defineStore } from 'pinia'

// export const useStateStore = defineStore('stateStore', {
//   state: () => ({
//     isOpen: false
//   }),
//   actions: {
//     stateStoreTrue() {
//       this.isOpen = true
//     },
//     stateStoreFalse() {
//       this.isOpen = false
//     }
//   }
// })
