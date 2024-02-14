<script setup lang="ts">
import * as Vue from 'vue';
import { G } from "@/G";
import { RouterLink } from 'vue-router';

interface IProps {
    showIcon: boolean;
}

const props = defineProps<IProps>();

const $this = Vue.getCurrentInstance()!.appContext.config.globalProperties as any;
const $emit = defineEmits(['topbar-menu-toggle', 'menu-toggle'])

const onMenuToggle = (event: any) => {
    $emit('menu-toggle', event);
}

const onTopbarMenuToggle = (event: any) => {
    $emit('topbar-menu-toggle', event);
}

// eslint-disable-next-line vue/return-in-computed-property
const darkTheme = Vue.computed(() => {
    $this.$appState.darkTheme;
})

const isUserLoggedIn = G.isUserLoggedin;

</script>

<template>
    <div class="layout-topbar">
        <button class="p-link layout-menu-button layout-topbar-button bg-transparent border-none pl-5" @click="onMenuToggle" tabindex="-1">
            <i class="pi pi-bars" tabindex="-1"></i>
        </button>

        <!-- <button class="p-link layout-topbar-menu-button layout-topbar-button" tabindex="-1" v-styleclass="{
            selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein',
            leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true
        }">
            <i class="pi pi-ellipsis-v"></i>
        </button> -->

        <!-- <router-link to="/" class="layout-topbar-logo" v-if="showIcon">
            <img alt="Logo" src="images/logo.png" tabindex="-1" width="260" />
        </router-link> -->

        <div class="flex w-full justify-content-between flex-wrap" style="order: 3;">
            <div id="toolbar" class="flex align-items-center justify-content-left bg-blue-600">div1</div>
            <div id="toolbar_right" class="flex align-items-center justify-content-right bg-red-500">profile</div>
        </div>

    </div>
</template>

