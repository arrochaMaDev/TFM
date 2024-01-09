<script setup lang="ts">
const emit = defineEmits(['confirmar', 'cancelar']) // creo los emits para que se ejecuten en el padre el borrado o no
</script>

<template>
  <div class="componente-popup">
    <div class="popup-content">
      <p>¿Estás seguro?</p>
      <button @click="emit('confirmar')">Sí</button>
      <button @click="emit('cancelar')">No</button>
      <!-- al hacer click se emiten al padre los emits de confirmar o cancelar -->
    </div>
  </div>
</template>

<style scoped>
.componente-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.popup-content {
  background: #000000;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid white;

  & button {
    cursor: pointer;
  }
}
</style>
