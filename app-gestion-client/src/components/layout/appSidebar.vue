<script setup lang="ts">

import Menu from 'primevue/menu';
import Button from 'primevue/button';


import { ref } from 'vue';
const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};


const items = ref([
  {
    label: 'Documents',
    items: [
      {
        label: 'New',
        icon: 'pi pi-plus'
      },
      {
        label: 'Search',
        icon: 'pi pi-search'
      }
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog'
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out'
      }
    ]
  }
]);
</script>

<template>
  <div class="relative">

    <!-- Menú -->
    <div class="bg-gray-800 h-screen fixed top-0 left-0 pt-20">

      <Menu :model="items" class="border-r-black" id="menu"></Menu>
    </div>
  </div>
</template>



<style scoped>
#menu {
  border-radius: 0;
  background-color: red;
}
</style>

<!-- <style scoped>
/* Estilos personalizados para el botón de hamburguesa */


/* Estilos para el menú */
.menu-item {
  color: white;
  padding: 10px 20px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.p-menu {
  width: 200px;
}

.sidebar {
  margin: 0;
  padding: 0;
  width: 200px;
  background-color: #f1f1f1;
  position: fixed;
  height: 100%;
  overflow: auto;
  transition: width 0.3s ease;
  /* Transición suave para el cambio de ancho */
}

.collapsed {
  width: 50px;
  /* Cuando está colapsado, establecemos el ancho a 0 */
}

.sidebar-text {
  display: inline-block;
  transition: with 0.3s ease;
}

.collapsed .sidebar-text {
  /* width: 0; */
  opacity: 0;
}

/* .sidebar-text {
  display: inline-block;
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.3s ease;
} */


/* Sidebar links */
.sidebar a {
  display: block;
  color: black;
  /* padding: 5px;
  text-decoration: none; */
}

/* Active/current link */
.sidebar a.active {
  background-color: #04AA6D;
  color: white;
}

/* Links on mouse-over */
.sidebar a:hover:not(.active) {
  background-color: #555;
  color: white;
}



/* Page content. The value of the margin-left property should match the value of the sidebar's width property */
div.content {
  margin-left: 200px;
  padding: 1px 16px;
  height: 1000px;
}

/* On screens that are less than 700px wide, make the sidebar into a topbar */
@media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .sidebar a {
    float: left;
  }

  div.content {
    margin-left: 0;
  }
}

/* On screens that are less than 400px, display the bar vertically, instead of horizontally */
@media screen and (max-width: 400px) {
  .sidebar a {
    text-align: center;
    float: none;
  }
}
</style> -->