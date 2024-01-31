<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';

const isDarkMode: Ref<boolean> = ref(false)

const emit = defineEmits(['toogleHamburgerColor']) // emit para cambiar el color el icono de la hamburguesa a negro en light mode

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("dark", isDarkMode.value.toString());
  emit('toogleHamburgerColor')
}

onMounted(() => {
  const storedDarkMode = localStorage.getItem("dark");
  if (storedDarkMode) {
    isDarkMode.value = storedDarkMode === "true";
    document.body.classList.toggle("dark", isDarkMode.value);
  }
})
</script>

<template>
  <div class="dark-swtich-btn">
    <button class="switch-toggle transition d-inline-block position-relative border-0 rounded-circle" id="switch-toggle" @click="toggleDarkMode">
      <i class="flaticon-moon"></i>
    </button>
  </div>
</template>

