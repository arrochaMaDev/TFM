export default class DireccionService {
  static async getCCAAS(): Promise<any> {
    try {
      const response = await fetch('/src/utils/ccaas.json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('No se pudo obtener el archivo JSON')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener los datos del JSON:', error)
      throw error
    }
  }
  static async getProvincias(): Promise<any> {
    try {
      const response = await fetch('/src/utils/provincias.json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('No se pudo obtener el archivo JSON')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error al obtener los datos del JSON:', error)
      throw error
    }
  }
}
