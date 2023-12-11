<template>
  <div class="c-custom-card">
    <img :src="image" class="custom-image" alt="Image" />
  </div>
  </template>
  
  <script setup>
  import image from "@/assets/titl.png";
  
  </script>


<style scoped>
.custom-image {
  max-width: 100%;  /* Set the maximum width to 100% of the container */
  height: auto;     /* Maintain the aspect ratio */
  /* You can add additional styling here, such as max-height or specific width */
}
</style>