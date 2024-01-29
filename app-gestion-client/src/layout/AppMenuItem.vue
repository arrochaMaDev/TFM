<script setup lang="ts">

import { useRoute } from 'vue-router';
import { useLayout } from './composable/layout'
import { ref, onBeforeMount, watch, type Ref } from 'vue';

const route = useRoute();
const { layoutConfig, layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  root: {
    type: Boolean,
    default: true
  },
  parentItemKey: {
    type: String,
    default: null
  }
});

const isActiveMenu: Ref<boolean> = ref(false);
const itemKey: any = ref(null);

onBeforeMount(() => {
  itemKey.value = props.parentItemKey ? props.parentItemKey + '-' + props.index : String(props.index);

  const activeItem: Ref<any> = ref(layoutState.activeMenuItem)

  isActiveMenu.value = activeItem.value === itemKey.value || activeItem ? activeItem.value.startsWith(itemKey.value + '-') : false;
});

watch(
  () => layoutConfig.activeMenuItem.value,
  (newVal) => {
    isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
  }
);
const itemClick = (event: any, item: any, index: number) => {
  if (item.disabled) {
    event.preventDefault();
    return;
  }

  const { overlayMenuActive, staticMenuMobileActive } = layoutState;

  if ((item.to || item.url) && (staticMenuMobileActive.value || overlayMenuActive.value)) {
    onMenuToggle();
  }

  if (item.command) {
    item.command({ originalEvent: event, item: item });
  }

  const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value;

  setActiveMenuItem(foundItemKey);
};

const checkActiveRoute = (item: any) => {
  return route.path === item.to;
};
</script>

<template>
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ item.label }}</div>
    <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url" @click="itemClick($event, item, index)" :class="item.class" :target="item.target" tabindex="0">
      <i :class="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
    </a>
    <router-link v-if="item.to && !item.items && item.visible !== false" @click="itemClick($event, item, index)" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0"
      :to="item.to">
      <i :class="item.icon" class="layout-menuitem-icon"></i>
      <span class="layout-menuitem-text">{{ item.label }}</span>
      <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
    </router-link>
    <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
      <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
        <app-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :parentItemKey="itemKey" :root="false"></app-menu-item>
      </ul>
    </Transition>
  </li>
</template>

<style lang="scss" scoped>
a.active-route {
  font-weight: 700;
  color: var(--primary-color);
}
</style>
