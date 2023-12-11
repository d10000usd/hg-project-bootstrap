<template>
    <div class="custom-card"><div ref="utterancesContainer" ></div>

  <!-- content -->
</div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';

const scriptInitialized = ref(false);

onMounted(() => {
    if (!scriptInitialized.value) {
        const utterancesElement = document.createElement('script');
        utterancesElement.src = 'https://utteranc.es/client.js';
        utterancesElement.setAttribute('repo', 'd10000usd/tsComments');
        utterancesElement.setAttribute('issue-term', 'pathname');
        utterancesElement.setAttribute('label', 'comment');
        utterancesElement.setAttribute('theme', 'github-light');
        utterancesElement.setAttribute('crossorigin', 'anonymous');
        utterancesElement.async = true;

        const utterancesContainer = ref(null);

        (utterancesContainer.value || document.body).appendChild(utterancesElement);

        scriptInitialized.value = true;
    }
});
</script>
<style>
.utterances {
  max-width: 1320px !important;
  margin: 1 auto !important; 
  margin-bottom: 0.61rem !important;
  /* margin-right: 0.01rem;
  margin-left: 0.01; */
  background-color: #a3feb1;

}
/* Responsive styling */
@media screen and (max-width: 1300px) {
  .utterances {
    max-width: 97% !important; /* Adjust the percentage based on your preference */
  }
}
</style>