<script setup lang="ts"></script>
<template>
  <div class="spinner-content">
    <!-- <div class="spinner"></div> -->
    <img src="../utils/img/loading.png" alt="Loading" class="spinner" />
  </div>
</template>

<style scoped>
.spinner-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* .loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
} */

.spinner {
  animation: pulse 2s infinite;
  width: 40vw;
  max-width: 80vw;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
  }
  40% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
}

/* .spinner {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  padding: 1.1px;
  background: conic-gradient(#0000 10%, #c3c1b6) content-box;
  -webkit-mask: repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
    radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 9px));
  -webkit-mask-composite: destination-in;
  mask-composite: intersect;
  animation: spinner-d55elj 1s infinite steps(10);
}

@keyframes spinner-d55elj {
  to {
    transform: rotate(1turn);
  }
} */
</style>
