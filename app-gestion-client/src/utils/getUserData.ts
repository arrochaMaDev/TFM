import userEmail from '../App.vue'

export const getUserData: object | undefined = () => {
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')

    if (name === 'email') {
      userEmail.value = value
      break
    }
  }
}
