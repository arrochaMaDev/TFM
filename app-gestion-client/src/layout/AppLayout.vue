<script setup lang="ts">


import { computed, watch, ref, onBeforeMount, inject } from 'vue';
import { useLayout } from './composable/layout';
import AppTopbar from './AppTopbar.vue'
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import type { VueCookies } from 'vue-cookies'
import router from '@/router';



const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener: any = ref(null);

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});
const $cookies = inject<VueCookies>('$cookies')

onBeforeMount(() => {

  const userCookieExists = $cookies?.isKey('user')
  if (!userCookieExists) {
    router.push('/login')
  }

})
const containerClass = computed(() => {
  return {
    // 'layout-theme-light': layoutConfig.darkTheme.value === 'light',
    // 'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
    'layout-overlay': layoutConfig.menuMode.value === 'overlay',
    'layout-static': layoutConfig.menuMode.value === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive.value,
    'layout-mobile-active': layoutState.staticMenuMobileActive.value,
    'p-input-filled': layoutConfig.inputStyle.value === 'filled',
    'p-ripple-disabled': !layoutConfig.ripple.value
  };
});
const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event: any) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive.value = false;
        layoutState.staticMenuMobileActive.value = false;
        layoutState.menuHoverActive.value = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event: any) => {
  const sidebarEl: any = document.querySelector('.layout-sidebar');
  const topbarEl: any = document.querySelector('.layout-menu-button');

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <app-topbar></app-topbar>
    <div class="layout-sidebar">
      <app-sidebar></app-sidebar>
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
    </div>
    <app-config></app-config>
    <div class="layout-mask"></div>
  </div>
</template>

<style lang="scss" scoped></style>
