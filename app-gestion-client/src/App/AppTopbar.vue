<script setup lang="ts">
import * as Vue from 'vue';
import { G } from "@/G";
import { RouterLink } from 'vue-router';
import Button from 'primevue/button';

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



const isUserLoggedIn = G.isUserLoggedin;

</script>

<template>
    <div class="layout-topbar">
        <Button class="p-link layout-menu-button layout-topbar-button bg-transparent border-none pl-5" @click="onMenuToggle" tabindex="-1">
            <i class="pi pi-bars" tabindex="-1"></i>
        </Button>

        <!-- <button class="p-link layout-topbar-menu-button layout-topbar-button" tabindex="-1" v-styleclass="{
            selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein',
            leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true
        }">
            <i class="pi pi-ellipsis-v"></i>
        </button> -->


        <div class="flex w-full justify-content-between flex-wrap" style="order: 3;">
            <div id="toolbar" class="flex align-items-center justify-content-left bg-blue-600">div1</div>
            <div id="toolbar_right" class="flex align-items-center justify-content-right bg-red-500">profile</div>
        </div>

    </div>
</template>
