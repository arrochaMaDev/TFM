<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';



</script>

<template>
  <Toolbar style="margin: 2rem 2rem 2rem 2rem; padding: 1rem 1rem 1rem 1.5rem">
    <template #start>
      <div class="flex align-items-center gap-12 w-full bg-slate-600">
        <Button label="Files"></Button>
        <Button label="Edit" text plain></Button>
        <Button label="View" text plain></Button>
      </div>
    </template>

    <template #end>
      <div class="flex align-items-center gap-3">
        <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" style="width: 32px; height: 32px" />
      </div>
    </template>
  </Toolbar>
</template>

<style scoped></style>