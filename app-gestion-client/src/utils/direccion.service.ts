export default class DireccionService {
  static async getCCAA(): Promise<any> {
    try {
      const response = await fetch('/utils/ccaa.json')
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
  static async getProvincia(): Promise<any> {
    try {
      const response = await fetch('/utils/provincias.json')
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
