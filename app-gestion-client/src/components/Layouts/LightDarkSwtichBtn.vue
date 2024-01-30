<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("dark", isDarkMode.value.toString());
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

