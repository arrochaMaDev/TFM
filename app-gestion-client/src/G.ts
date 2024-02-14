import * as Vue from 'vue'

export function createElement(html: string): HTMLElement {
  const newDiv = (window as any).document.createElement('div') as HTMLElement
  newDiv.innerHTML = html
  return newDiv
}

interface IUserSettings {
  scale: number
  inputStyle: string
  layoutMode: string
  rippleEffect: boolean
  theme: string
  dark: boolean
}
class Global {
  public isUserLoggedin: Vue.Ref<boolean>
  public showLeftSide: Vue.Ref<boolean>
  public userSettings: Vue.Ref<IUserSettings>

  public constructor() {
    this.isUserLoggedin = Vue.ref(true)
    this.showLeftSide = Vue.ref(true)
    this.userSettings = Vue.ref({
      scale: 12,
      inputStyle: 'outlined',
      layoutMode: 'static',
      rippleEffect: true,
      theme: 'lara-light-indigo',
      dark: false
    })
  }

  setSettings() {
    document.documentElement.style.fontSize = this.userSettings.value.scale + 'px'

    let themeElement = document.getElementById('theme-link')!
    let themeUrl = process.env.BASE_URL + 'themes/' + this.userSettings.value.theme + '/theme.css'
    themeElement.setAttribute('href', themeUrl)
  }
}

let G: Global
G = new Global()

export { G }
