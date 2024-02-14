<script setup lang="ts">
import * as Vue from 'vue';
import { useRoute } from "vue-router";
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';

const $this = Vue.getCurrentInstance()!.appContext.config.globalProperties as any;


interface IProps {
    layoutMode: string;
}

const props = defineProps<IProps>();
const $emit = defineEmits(['layout-change'])

const active = Vue.ref(false);
const d_layoutMode = Vue.ref(props.layoutMode);
const scale = Vue.ref(12);
const scales = Vue.ref([10, 11, 12, 13, 14, 15, 16]);
const rootDiv = Vue.ref<HTMLDivElement>();

type MouseEventHandler = (event: MouseEvent) => void;
let outsideClickListener: MouseEventHandler | null = null;

const toggleConfigurator = (event: Event) => {
    active.value = !active.value;
    event.preventDefault();

    if (active.value)
        bindOutsideClickListener();
    else
        unbindOutsideClickListener();
}

const hideConfigurator = (event: Event) => {
    active.value = false;
    unbindOutsideClickListener();
    event.preventDefault();
}

const changeInputStyle = (value: any) => {
    $this.$primevue.config.inputStyle = value;
}

const changeRipple = (value: any) => {
    $this.$primevue.config.ripple = value;
}

const changeLayout = (event: Event, layoutMode: string) => {
    $emit('layout-change', layoutMode);
    event.preventDefault();
}

const bindOutsideClickListener = () => {
    if (!outsideClickListener) {
        outsideClickListener = (event: MouseEvent) => {
            if (active.value && isOutsideClicked(event)) {
                active.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener);
    }
}
const unbindOutsideClickListener = () => {
    if (outsideClickListener) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener = null;
    }
}
const isOutsideClicked = (event: MouseEvent) => {
    return !(rootDiv.value!.isSameNode(event.target as HTMLElement) || rootDiv.value!.contains(event.target as HTMLElement));
}
const decrementScale = () => {
    applyScale(scale.value - 1);
}
const incrementScale = () => {
    applyScale(scale.value + 1);
}
const applyScale = (val: number) => {
    scale.value = val;
    document.documentElement.style.fontSize = val + 'px';
}
const changeTheme = (event: Event, theme: any, dark: any) => {
    let themeElement = document.getElementById('theme-link')!;
    themeElement.setAttribute('href', themeElement.getAttribute('href')!.replace($this.$appState.theme, theme));
    $this.$appState.theme = theme;
    $this.$appState.darkTheme = dark;

    if (theme.startsWith('md')) {
        $this.$primevue.config.ripple = true;
    }
}


Vue.watch(() => props.layoutMode, (newVal, oldVal) => {
    d_layoutMode.value = newVal;
})

const containerClass = Vue.computed(() => {
    return ['layout-config', { 'layout-config-active': active.value }];
});

const rippleActive = Vue.computed(() => {
    return $this.$primevue.config.ripple;
});

const inputStyle = Vue.computed(() => {
    return $this.$appState.inputStyle;
});

const $route = useRoute();
Vue.watch(() => $route, (newVal, oldVal) => {
    if (active.value) {
        active.value = false;
        unbindOutsideClickListener();
    }
});

defineExpose({ toggleConfigurator });

</script>

<template>
    <div id="layout-config" :class="containerClass" ref="rootDiv">
        <!--
        <a href="#" class="layout-config-button" id="layout-config-button" @click="toggleConfigurator">
            <i class="pi pi-cog"></i>
        </a>
       -->
        <Button class="p-button-danger layout-config-close p-button-rounded p-button-text" icon="pi pi-times" @click="hideConfigurator" :style="{ 'z-index': 1 }"></Button>

        <div class="layout-config-content">
            <h5 class="mt-0">Component Scale</h5>
            <div class="config-scale">
                <Button icon="pi pi-minus" @click="decrementScale()" class="p-button-text" :disabled="scale === scales[0]" />
                <i class="pi pi-circle-on clickable" v-for="s of scales" :class="{ 'scale-active': s === scale }" :key="s" @click="applyScale(s)" />
                <Button icon="pi pi-plus" @click="incrementScale()" class="p-button-text" :disabled="scale === scales[scales.length - 1]" />
            </div>

            <h5>Input Style</h5>
            <div class="p-formgroup-inline">
                <div class="field-radiobutton">
                    <RadioButton id="input_outlined" name="inputstyle" value="outlined" :modelValue="$primevue.config.inputStyle" @change="changeInputStyle('outlined')" />
                    <label for="input_outlined">Outlined</label>
                </div>
                <div class="field-radiobutton">
                    <RadioButton id="input_filled" name="inputstyle" value="filled" :modelValue="$primevue.config.inputStyle" @change="changeInputStyle('filled')" />
                    <label for="input_filled">Filled</label>
                </div>
            </div>

            <h5>Ripple Effect</h5>
            <InputSwitch :modelValue="rippleActive" @update:modelValue="changeRipple" />

            <h5>Menu Type</h5>
            <div class="p-formgroup-inline">
                <div class="field-radiobutton">
                    <RadioButton id="static" name="layoutMode" value="static" v-model="d_layoutMode" @change="changeLayout($event, 'static')" />
                    <label for="static">Static</label>
                </div>
                <div class="field-radiobutton">
                    <RadioButton id="overlay" name="layoutMode" value="overlay" v-model="d_layoutMode" @change="changeLayout($event, 'overlay')" />
                    <label for="overlay">Overlay</label>
                </div>
            </div>

            <h5>Themes</h5>
            <h6 class="mt-0">Bootstrap</h6>
            <div class="grid free-themes">
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'bootstrap4-light-blue', false)">
                        <img class="block" src="images/themes/bootstrap4-light-blue.svg" alt="Bootstrap Light Blue" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'bootstrap4-light-purple', false)">
                        <img class="block" src="images/themes/bootstrap4-light-purple.svg" alt="Bootstrap Light Blue" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'bootstrap4-dark-blue', true)">
                        <img class="block" src="images/themes/bootstrap4-dark-blue.svg" alt="Bootstrap Dark Blue" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'bootstrap4-dark-purple', true)">
                        <img class="block" src="images/themes/bootstrap4-dark-purple.svg" alt="Bootstrap Dark Blue" />
                    </button>
                </div>
            </div>

            <h6>Material Design</h6>
            <div class="grid free-themes">
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'md-light-indigo', false)">
                        <img class="block" src="images/themes/md-light-indigo.svg" alt="Material Light Indigo" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'md-light-deeppurple', false)">
                        <img class="block" src="images/themes/md-light-deeppurple.svg" alt="Material Light Deep Purple" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'md-dark-indigo', true)">
                        <img class="block" src="images/themes/md-dark-indigo.svg" alt="Material Dark Indigo" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'md-dark-deeppurple', true)">
                        <img class="block" src="images/themes/md-dark-deeppurple.svg" alt="Material Dark Deep Purple" />
                    </button>
                </div>
            </div>

            <h6>Material Design Compact</h6>
            <div class="grid free-themes">
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'mdc-light-indigo', false)">
                        <img class="block" src="images/themes/md-light-indigo.svg" alt="Material Compact Light Indigo" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'mdc-light-deeppurple', false)">
                        <img class="block" src="images/themes/md-light-deeppurple.svg" alt="Material Compact Deep Purple" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'mdc-dark-indigo', true)">
                        <img class="block" src="images/themes/md-dark-indigo.svg" alt="Material Compact Dark Indigo" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'mdc-dark-deeppurple', true)">
                        <img class="block" src="images/themes/md-dark-deeppurple.svg" alt="Material Compact Dark Deep Purple" />
                    </button>
                </div>
            </div>

            <h6>Tailwind</h6>
            <div class="grid free-themes">
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'tailwind-light', false)">
                        <img class="block" src="images/themes/tailwind-light.png" alt="Tailwind Light" />
                    </button>
                </div>
            </div>

            <h6>Fluent UI</h6>
            <div class="grid free-themes">
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'fluent-light', false)">
                        <img class="block" src="images/themes/fluent-light.png" alt="Fluent Light" />
                    </button>
                </div>
            </div>

            <h6>PrimeOne Design - 2022</h6>
            <div class="grid free-themes">
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'lara-light-indigo', false)">
                        <img class="block" src="images/themes/lara-light-indigo.png" alt="Lara Light Indigo" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'lara-light-blue', false)">
                        <img class="block" src="images/themes/lara-light-blue.png" alt="Lara Light Blue" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'lara-light-purple', false)">
                        <img class="block" src="images/themes/lara-light-purple.png" alt="Lara Light Purple" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'lara-light-teal', false)">
                        <img class="block" src="images/themes/lara-light-teal.png" alt="Lara Light Teal" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'lara-dark-indigo', true)">
                        <img class="block" src="images/themes/lara-dark-indigo.png" alt="Lara Dark Indigo" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'lara-dark-blue', true)">
                        <img class="block" src="images/themes/lara-dark-blue.png" alt="Lara Dark Blue" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'lara-dark-purple', true)">
                        <img class="block" src="images/themes/lara-dark-purple.png" alt="Lara Dark Purple" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'lara-dark-teal', true)">
                        <img class="block" src="images/themes/lara-dark-teal.png" alt="Lara Dark Teal" />
                    </button>
                </div>
            </div>

            <h6>PrimeOne Design - 2021</h6>
            <div class="grid free-themes">
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'saga-blue', false)">
                        <img class="block" src="images/themes/saga-blue.png" alt="Saga Blue" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'saga-green', false)">
                        <img class="block" src="images/themes/saga-green.png" alt="Saga Green" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'saga-orange', false)">
                        <img class="block" src="images/themes/saga-orange.png" alt="Saga Orange" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'saga-purple', false)">
                        <img class="block" src="images/themes/saga-purple.png" alt="Saga Purple" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'vela-blue', true)">
                        <img class="block" src="images/themes/vela-blue.png" alt="Vela Blue" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'vela-green', true)">
                        <img class="block" src="images/themes/vela-green.png" alt="Vela Green" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'vela-orange', true)">
                        <img class="block" src="images/themes/vela-orange.png" alt="Vela Orange" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'vela-purple', true)">
                        <img class="block" src="images/themes/vela-purple.png" alt="Vela Purple" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'arya-blue', true)">
                        <img class="block" src="images/themes/arya-blue.png" alt="Arya Blue" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'arya-green', true)">
                        <img class="block" src="images/themes/arya-green.png" alt="Arya Green" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'arya-orange', true)">
                        <img class="block" src="images/themes/arya-orange.png" alt="Arya Orange" />
                    </button>
                </div>
                <div class="col-3 text-center">
                    <button class="p-link" type="button" @click="changeTheme($event, 'arya-purple', true)">
                        <img class="block" src="images/themes/arya-purple.png" alt="Arya Purple" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

