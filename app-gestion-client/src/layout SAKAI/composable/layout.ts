import { toRefs, reactive, computed } from 'vue'

interface LayoutConfig {
  ripple: boolean
  darkTheme: boolean
  inputStyle: string
  menuMode: string
  theme: string
  scale: number
  activeMenuItem: any
}

interface LayoutState {
  staticMenuDesktopInactive: boolean
  overlayMenuActive: boolean
  profileSidebarVisible: boolean
  configSidebarVisible: boolean
  staticMenuMobileActive: boolean
  menuHoverActive: boolean
  activeMenuItem: string
}

const layoutConfig: LayoutConfig = reactive({
  ripple: false,
  darkTheme: false,
  inputStyle: 'outlined',
  menuMode: 'static',
  theme: 'lara-light-indigo',
  scale: 14,
  activeMenuItem: null
})

const layoutState: LayoutState = reactive({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  activeMenuItem: ''
})

export function useLayout() {
  const changeThemeSettings = (theme: string, darkTheme: boolean) => {
    layoutConfig.darkTheme = darkTheme
    layoutConfig.theme = theme
  }

  const setScale = (scale: number) => {
    layoutConfig.scale = scale
  }

  const setActiveMenuItem = (item: { value?: any } | any) => {
    layoutConfig.activeMenuItem = item.value || item
  }

  const onMenuToggle = () => {
    if (layoutConfig.menuMode === 'overlay') {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive
    }
    if (window.innerWidth > 991) {
      layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive
    }
  }

  const isSidebarActive = computed(
    () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
  )
  const isDarkTheme = computed(() => layoutConfig.darkTheme)

  return {
    layoutConfig: toRefs(layoutConfig),
    layoutState: toRefs(layoutState),
    changeThemeSettings,
    setScale,
    onMenuToggle,
    isSidebarActive,
    isDarkTheme,
    setActiveMenuItem
  }
}
