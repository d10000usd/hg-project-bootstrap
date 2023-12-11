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
const [fullTitle, label, number, restOfText] = props.title.match(/([^\d]+)(\d+)(.*)/);

const consplit = 400;
const truncatedText = computed(() => {
  // Find the index of "Description" in the content and slice until that point
  const descriptionIndex = content.value.indexOf('## Description  ');
  return content.value.slice(0, descriptionIndex !== -1 ? descriptionIndex : consplit);
});

const remainingText = computed(() => {
  // If "Description" is found, slice from that index, otherwise, slice from consplit
  const descriptionIndex = content.value.indexOf('## Description  ');
  return content.value.slice(descriptionIndex !== -1 ? descriptionIndex : consplit);
});

onMounted(async () => {
  const response = await fetch(props.contentUrl);
  content.value = await response.text();
});

const toggleContent = () => {
  showContent.value = !showContent.value;
};
</script>
