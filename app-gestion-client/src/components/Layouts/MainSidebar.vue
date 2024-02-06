<script setup lang="ts">
import stateStore from "../../utils/store";
import { RouterLink } from 'vue-router'


const stateStoreInstance = stateStore;

</script>
<template>
  <div :class="[
    'sidebar-area position-fixed start-0 top-0 bg-black h-100vh transition',
    { active: stateStoreInstance.open },
  ]" id="sidebar-area">
    <div class="logo position-absolute start-0 end-0 top-0 bg-black">
      <RouterLink to="/" class="d-flex align-items-center text-white text-decoration-none">
        <img src="../../assets/images/favicon.png" alt="logo-icon" />
        <span class="fw-bold ms-10">Adlash</span>
      </RouterLink>
      <div class="border-bottom"></div>
      <button class="sidebar-burger-menu position-absolute lh-1 bg-transparent p-0 border-0" @click="stateStoreInstance.onChange">
        <i class="ph-duotone ph-caret-double-right"></i>
      </button>
    </div>
    <div class="sidebar-menu">

      <ul class="sidebar-navbar-nav ps-0 mb-0 list-unstyled accordion" id="sidebarNavAccordion">
        <!--  -->
        <li class="sidebar-nav-item accordion-item bg-transparent border-0 rounded-0">
          <button class="accordion-button rounded-0 shadow-none bg-transparent d-block" data-bs-toggle="collapse" data-bs-target="#sidebarCollapseOne" aria-expanded="true"
            aria-controls="sidebarCollapsOne">
            <i class="pi pi-plus"></i>
            <span class="title">Registrar</span>
          </button>
          <div id="sidebarCollapseOne" class="accordion-collapse collapse show" data-bs-parent="#sidebarNavAccordion">
            <div class="accordion-body">
              <ul class="sidebar-sub-menu ps-0 mb-0 list-unstyled">
                <li class="sidebar-sub-menu-item">
                  <RouterLink to="/alta-usuario" class="sidebar-sub-menu-link">
                    Nuevo Usuario
                  </RouterLink>
                </li>
                <li class="sidebar-sub-menu-item">
                  <RouterLink to="/alta-alumno" class="sidebar-sub-menu-link">
                    Nuevo Alumno
                  </RouterLink>
                </li>
                <li class="sidebar-sub-menu-item">
                  <RouterLink to="/alta-profesor" class="sidebar-sub-menu-link">
                    Nuevo Profesor
                  </RouterLink>
                </li>
                <li class="sidebar-sub-menu-item">
                  <RouterLink to="/alta-usuario" class="sidebar-sub-menu-link">
                    Nueva Asignatura
                  </RouterLink>
                </li>
                <li class="sidebar-sub-menu-item">
                  <RouterLink to="/alta-asignatura-profesor" class="sidebar-sub-menu-link">
                    Nueva Asignación
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

