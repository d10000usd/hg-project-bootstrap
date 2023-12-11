<template>
    <div class="c-custom-card">
      <img :src="image" class="custom-image" alt="Image" @load="detectEdges" />
    </div>
  </template>
  
  <script setup>
  import image from "@/assets/titl.png";
  
  function detectEdges() {
    // Ensure OpenCV is ready
    if (typeof cv !== 'undefined') {
      // Load the image
      let src = cv.imread('custom-image');
      
      // Convert the image to grayscale
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
  
      // Apply Canny edge detection
      let edges = new cv.Mat();
      cv.Canny(src, edges, 50, 150);
  
      // Display the result
      cv.imshow('custom-image', edges);
  
      // Release memory
      src.delete();
      edges.delete();
    }
  }
  
  function onOpenCvReady() {
    console.log('OpenCV.js is ready');
  }
  </script>
  
  <style scoped>
  .custom-image {
    max-width: 100%;
    height: auto;
  }
  </style>