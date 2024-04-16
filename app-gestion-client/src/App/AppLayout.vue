<script setup lang="ts">
// import * as Vue from 'vue';
import { G } from "@/G";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import AppTopBar from '@/App/AppTopbar.vue';
import AppMenu from '@/App/AppMenu.vue';
import Sidebar from '@/components/Sidebar.vue';
import AppConfig from '@/App/AppConfig.vue';
import AppFooter from '@/App/AppFooter.vue';
import { RouterView } from 'vue-router';
import router from '@/router';
import { computed, inject, onMounted, ref, type Ref } from 'vue';
import type { VueCookies } from 'vue-cookies';
import { useLoggedStore } from '@/stores/isLogged';
import Button from 'primevue/button';



// const layoutMode = Vue.ref('static');
// const appConfig = Vue.ref<typeof AppConfig>();

const staticMenuInactive: Ref<boolean> = ref(false);
const overlayMenuActive: Ref<boolean> = ref(false);
const mobileMenuActive: Ref<boolean> = ref(false);
const menuClick: Ref<boolean> = ref(false);
// const menuActive = Vue.ref(false);



// const $this = Vue.getCurrentInstance()!.appContext.config.globalProperties as any;

// let isLoggedIn = G.isUserLoggedin;

const onWrapperClick = () => {
    if (!menuClick.value) {
        overlayMenuActive.value = false;
        mobileMenuActive.value = false;
    }

    menuClick.value = false;
}
const onMenuToggle = (event: Event) => {
    menuClick.value = true;

    if (isDesktop()) {
        // if (layoutMode.value === 'overlay') {
        //     if (mobileMenuActive.value === true) {
        //         overlayMenuActive.value = true;
        //     }

        //     overlayMenuActive.value = !overlayMenuActive.value;
        //     mobileMenuActive.value = false;
        // }
        // else if (layoutMode.value === 'static') {
        staticMenuInactive.value = !staticMenuInactive.value;
        // }
    }
    else {
        mobileMenuActive.value = !mobileMenuActive.value;
    }

    event.preventDefault();
}

// const onSidebarClick = () => {
//     menuClick.value = true;
// }
// const onMenuItemClick = (event: any) => {
//     if (event.item && !event.item.items) {
//         overlayMenuActive.value = false;
//         mobileMenuActive.value = false;
//     }
//     switch (event.item.label) {
//         case 'Settings':
//             appConfig.value!.toggleConfigurator(event.originalEvent);
//             break;
//         case 'Cerrar Sesión':
//             logout();
//             break;
//     }

// }
// const onLayoutChange = (l: string) => {
//     layoutMode.value = l;
// }
// const addClass = (element: HTMLElement, className: string) => {
//     if (element.classList)
//         element.classList.add(className);
//     else
//         element.className += ' ' + className;
// }
// const removeClass = (element: HTMLElement, className: string) => {
//     if (element.classList)
//         element.classList.remove(className);
//     else
//         element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
// }
const isDesktop = () => {
    return window.innerWidth >= 992;
}
// const isSidebarVisible = () => {
//     if (isDesktop()) {
//         if (layoutMode.value === 'static')
//             return !staticMenuInactive.value;
//         else if (layoutMode.value === 'overlay')
//             return overlayMenuActive.value;
//     }

//     return true;
// }

// const logout = async () => {
//     //await G.doAjaxAsync('/public/logout', null);
//     window.location.href = "/";
// }

const sidebarClass: Ref<{
    layoutMode: string
    showLeftSide: boolean
}> = ref({
    layoutMode: 'static',
    showLeftSide: true
})

const containerClass = computed(() => {
    return ['layout-wrapper', {
        // 'layout-overlay': G.userSettings.value.layoutMode === 'overlay',
        'layout-static': sidebarClass.value.layoutMode === 'static',
        'layout-static-sidebar-inactive': !sidebarClass.value.showLeftSide || (staticMenuInactive.value && sidebarClass.value.layoutMode === 'static'),
        'layout-overlay-sidebar-active': sidebarClass.value.showLeftSide && overlayMenuActive.value && sidebarClass.value.layoutMode === 'overlay',
        'layout-mobile-sidebar-active': sidebarClass.value.showLeftSide && mobileMenuActive.value,
        // 'p-input-filled': G.userSettings.value.inputStyle === 'filled',
        // 'p-ripple-disabled': G.userSettings.value.rippleEffect === false,
        // 'layout-theme-light': G.userSettings.value.theme.startsWith('saga')

        // // 'layout-overlay': G.userSettings.value.layoutMode === 'overlay',
        // 'layout-static': G.userSettings.value.layoutMode === 'static',
        // 'layout-static-sidebar-inactive': !G.showLeftSide.value || (staticMenuInactive.value && G.userSettings.value.layoutMode === 'static'),
        // 'layout-overlay-sidebar-active': G.showLeftSide.value && overlayMenuActive.value && G.userSettings.value.layoutMode === 'overlay',
        // 'layout-mobile-sidebar-active': G.showLeftSide.value && mobileMenuActive.value,
        // // 'p-input-filled': G.userSettings.value.inputStyle === 'filled',
        // // 'p-ripple-disabled': G.userSettings.value.rippleEffect === false,
        // // 'layout-theme-light': G.userSettings.value.theme.startsWith('saga')
    }];
});

// Vue.onBeforeUpdate(() => {
//     if (mobileMenuActive.value)
//         addClass(document.body, 'body-overflow-hidden');
//     else
//         removeClass(document.body, 'body-overflow-hidden');
// });

// const $route = useRoute();
// const $toast = useToast();
// Vue.watch(() => $route, (newVal, oldVal) => {
//     menuActive.value = false;
//     $toast.removeAllGroups();
// });



//Obtener valor de la cookie
const loggedStore = useLoggedStore()

const $cookies = inject<VueCookies>('$cookies');
const user: Ref<{
    email: string | undefined,
    username: string | undefined,
    isValid: string | undefined,
    permiso: string | undefined,
    id: string | undefined
}> = ref({
    email: undefined,
    username: undefined,
    isValid: undefined,
    permiso: undefined,
    id: undefined,
})

const isLogged: Ref<boolean> = ref(false)

onMounted(() => {
    isLogged.value = loggedStore.isLogged
    user.value = $cookies?.get('user')
    if (user.value) {
        console.log('Cookie value:', user);
        isLogged.value = loggedStore.isLoggedTrue()
        isLogged.value = true
    } else {
        router.push('/login')
        console.log('Cookie "user" no encontrada');
    }
})

</script>


<template>
    <div :class="containerClass" @click="onWrapperClick">
        <AppTopBar @menu-toggle="onMenuToggle" />
        <!-- <AppTopBar :showIcon="!staticMenuInactive && (G.userSettings.value.layoutMode === 'static')" @menu-toggle="onMenuToggle" /> -->
        <!-- <div class="layout-sidebar" @click="onSidebarClick"> -->
        <div>
            <!-- <AppMenu @menuitem-click="onMenuItemClick" v-if="G.showLeftSide" /> -->
            <sidebar class="layout-sidebar"></sidebar>
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>

            <div>
                <AppFooter />
            </div>
        </div>

        <!-- <AppConfig ref="appConfig" :layoutMode="layoutMode" @layout-change="onLayoutChange" /> -->
        <!-- <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition> -->
    </div>
</template>


<style lang="scss">
@import './App';
</style>
