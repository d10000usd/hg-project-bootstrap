<template>

  <div class="card mb-2">
    <Markdown @click="toggleContent" :source="truncatedText" :html="true" :breaks="true" :linkify="true"
      :typographer="true" /> 
    <div v-if="showContent">
      <Markdown :source="remainingText" :html="true" :breaks="true" :linkify="true" :typographer="true" /> 
    </div>
  </div> 
</template>

<style scoped>



</style>

<script setup>
import { ref, onMounted, defineProps, computed } from 'vue';
import Markdown from 'vue3-markdown-it';
import { staticLoadMarkdown } from '../../ts/StaticLoadMarkdown';



const props = defineProps(['title', 'contentUrl']);
const content = ref('');
const showContent = ref(false);
const [fulltilte, label, number, restOfText] = props.title.match(/([^\d]+)(\d+)(.*)/);


const consplit = 400
const truncatedText = computed(() => content.value.slice(0, consplit));
const remainingText = computed(() => content.value.slice(consplit));
onMounted(async () => {
  const response = await fetch(props.contentUrl);
  content.value = await response.text();
});

const toggleContent = () => {
  showContent.value = !showContent.value;
};
</script>

