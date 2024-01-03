import { useLoadingStore } from '@/stores/loading'
import { type Ref, ref } from 'vue'

const loadingStore = useLoadingStore()

//· OBTENER LISTADO DE ALUMNOS:
const studentsRefFromServer: Ref<
  {
    id: number
    usuario_id: string
    nombre: string
    apellidos: string
    dni: string
    direccion: string
    telefono: string
    email: string
  }[]
> = ref([])

const getStudentsData = async () => {
  try {
    const response = await fetch('http://localhost:3000/students', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`)
    } else {
      loadingStore.loadingTrue()
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const data = (await response.json()) as {
        id: number
        usuario_id: string
        nombre: string
        apellidos: string
        dni: string
        direccion: string
        telefono: string
        email: string
      }[]
      studentsRefFromServer.value = data
      console.log(data)
      console.log(studentsRefFromServer.value)
    }
  } catch (error) {
    console.error('Error en la solicitud:', error)
    alert('Ha ocurrido un error')
  } finally {
    loadingStore.loadingFalse()
  }
}

export { getStudentsData }
