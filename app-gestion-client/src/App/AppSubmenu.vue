<script lang="ts">
export default {
	name: 'appsubmenu'
}
</script>

<script setup lang="ts">
import * as Vue from 'vue';
import type { MenuItem } from 'primevue/menuitem';

const name = 'appsubmenu'

interface IProps {
	items: MenuItem[];
	root?: boolean;
}

let $props = withDefaults(defineProps<IProps>(), {
	items: () => [],
	root: false
});

let $emit = defineEmits(['menuitem-click']);

let activeIndex = Vue.ref(-1);

let onMenuItemClick = (event: UIEvent, item: any, index: number) => {
	if (item.disabled) {
		event.preventDefault();
		return;
	}

	if (!item.to && !item.url) {
		event.preventDefault();
	}

	//execute command
	if (item.command) {
		item.command({ originalEvent: event, item: item });
	}

	activeIndex.value = (index === activeIndex.value) ? -1 : index;

	$emit('menuitem-click', {
		originalEvent: event,
		item: item
	});
}


let visible = (item: any) => {
	return (typeof item.visible === 'function' ? item.visible() : item.visible !== false);
}
</script>


<template>
	<ul v-if="items">
		<template v-for="(item, i) of items">
			<li v-if="visible(item) && !item.separator" :key="i" :class="[{ 'layout-menuitem-category': root, 'active-menuitem': activeIndex === i && !item.to && !item.disabled }]" role="none">
				<template v-if="root">

					<div class="layout-menuitem-root-text">{{ item.label }}</div>
					<appsubmenu :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)"></appsubmenu>
					<!--
						<div class="p-component p-panelmenu-header p-highlight">
							<a class="p-panelmenu-header-link" tabindex="0" aria-expanded="true" id="pv_id_4_header" aria-controls="pv_id_4_content">
								<span class="p-panelmenu-icon pi pi-chevron-down"></span>
								<span class="p-menuitem-icon pi pi-fw pi-file"></span>
								<span class="p-menuitem-text">{{item.label}}</span>
							</a>
						</div>
						<div class="p-panelmenu-panel">
							<div class="p-toggleable-content">
								<appsubmenu :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)"></appsubmenu>
							</div>
						</div>
					-->

				</template>
				<template v-else>
					<router-link v-if="item.to" :to="item.to" :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]" :style="item.style" @click.prevent.stop="onMenuItemClick($event, item, i)"
						:target="item.target" role="menuitem" v-ripple>
						<i :class="item.icon"></i>
						<span>{{ item.label }}</span>
						<i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
						<span v-if="item.badge" class="menuitem-badge">{{ item.badge }}</span>
					</router-link>
					<a v-if="!item.to" :href="item.url || '#'" :style="item.style" :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]" @click.prevent.stop="onMenuItemClick($event, item, i)"
						:target="item.target" role="menuitem" v-ripple>
						<i :class="item.icon"></i>
						<span>{{ item.label }}</span>
						<i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
						<span v-if="item.badge" class="menuitem-badge">{{ item.badge }}</span>
					</a>
					<transition name="layout-submenu-wrapper">
						<appsubmenu v-show="activeIndex === i" :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)"></appsubmenu>
					</transition>
				</template>
			</li>
			<li class="p-menu-separator" :style="item.style" v-if="visible(item) && item.separator" :key="'separator' + i" role="separator"></li>
		</template>
	</ul>
</template>
